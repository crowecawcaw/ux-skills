// Drive the app and capture screenshots from a scenario file.
//
// Usage: node evals/shoot.mjs <scenario.json> [outDir]
//        outDir (optional) overrides the scenario's outDir — lets a committed
//        happy-path scenario be re-run into a fresh screenshot folder.
//
// Scenario shape:
// {
//   "baseUrl": "http://localhost:5173",
//   "viewport": { "width": 1280, "height": 900 },   // optional
//   "outDir": "/tmp/shots",                          // where PNGs land
//   "steps": [
//     { "goto": "/" },
//     { "shot": "01-home" },                         // viewport screenshot
//     { "shot": "01-home-full", "fullPage": true },  // whole scrollable page
//     { "shotEl": ["help-modal", ".modal"] },        // just one element (modals!)
//     { "click": "text=Start browsing" },
//     { "fill": ["input", "brewery"] },              // [selector, value]
//     { "selectOption": ["select#range", "90"] },    // [selector, value] for <select>
//     { "press": "Enter" },
//     { "wait": 1500 }                               // ms
//   ]
// }
//
// Set "viewport" to review a specific device, e.g. {"width":390,"height":844}
// for mobile. Selectors are Playwright selectors (text=, CSS, role=...). Prefer
// specific selectors (role=, title=, nth=) over bare text= for ambiguous labels
// like "Follow" that match several elements. The browser is shared across all
// steps so state (filters, selections) carries through.
//
// Notes:
//   - For modals/dialogs, capture with `shotEl` and dismiss via the dialog's
//     own close/primary button, not a backdrop click.
//   - First-run modals gated by localStorage won't reappear on a later goto in
//     the same run; capture them on the first navigation.
//
// Steps fail fast (8s) on a bad selector rather than stalling, and log the error.

// Requires playwright-core (and a browser): `npm i -D playwright-core && npx playwright install chromium`
import { readFileSync, readdirSync, existsSync } from 'fs';
import { chromium } from 'playwright-core';

// The pinned playwright-core version may expect a newer chromium build than
// what's cached locally. Fall back to whatever chromium-<rev> build actually
// exists under PLAYWRIGHT_BROWSERS_PATH (same logic as style-inventory.mjs).
async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch (err) {
    const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
    let dirs = [];
    try { dirs = readdirSync(base); } catch { /* fall through to rethrow */ }
    const candidate = dirs.filter((d) => /^chromium-\d+$/.test(d)).sort().reverse()[0];
    const exe = candidate ? `${base}/${candidate}/chrome-linux/chrome` : null;
    if (!exe || !existsSync(exe)) throw err;
    return await chromium.launch({ executablePath: exe });
  }
}

const scenarioPath = process.argv[2];
if (!scenarioPath) {
  console.error('usage: node evals/shoot.mjs <scenario.json>');
  process.exit(1);
}
const s = JSON.parse(readFileSync(scenarioPath, 'utf8'));
const baseUrl = s.baseUrl || 'http://localhost:5173';
const outDir = process.argv[3] || s.outDir || '/tmp/shots';

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: s.viewport || { width: 1280, height: 900 } });
page.setDefaultTimeout(8000);  // fail fast on bad selectors instead of stalling 30s

for (const step of s.steps) {
  try {
    if (step.goto !== undefined) {
      await page.goto(baseUrl + step.goto, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1500);
    } else if (step.click !== undefined) {
      await page.click(step.click, { timeout: 8000 });
      await page.waitForTimeout(800);
    } else if (step.fill !== undefined) {
      await page.fill(step.fill[0], step.fill[1], { timeout: 8000 });
      await page.waitForTimeout(800);
    } else if (step.selectOption !== undefined) {
      await page.selectOption(step.selectOption[0], step.selectOption[1], { timeout: 8000 });
      await page.waitForTimeout(800);
    } else if (step.press !== undefined) {
      await page.keyboard.press(step.press);
      await page.waitForTimeout(800);
    } else if (step.wait !== undefined) {
      await page.waitForTimeout(step.wait);
    } else if (step.shot !== undefined) {
      const path = `${outDir}/${step.shot}.png`;
      await page.screenshot({ path, fullPage: step.fullPage === true });
      console.log('shot ' + path);
    } else if (step.shotEl !== undefined) {
      const [name, selector] = step.shotEl;
      const path = `${outDir}/${name}.png`;
      await page.locator(selector).first().screenshot({ path });
      console.log('shot ' + path);
    }
  } catch (err) {
    console.error(`step failed (${JSON.stringify(step)}): ${err.message}`);
  }
}

await browser.close();
console.log('done');
