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
// 832events-specific selector notes (the first eval app):
//   - dialogs are `[role=dialog]` (class `.a-dlg`); dismiss via the dialog's
//     own close/primary button, not a backdrop click.
//   - on mobile the search box is hidden behind an icon — click the search
//     toggle before filling `input[placeholder*='Search']`.
//   - `.a-iconbtn` matches several controls (back button, mobile search toggle)
//     — scope it (e.g. `.a-content > .a-iconbtn`) or use an aria-label.
//   - first-run modals (welcome / how-it-works) are gated by localStorage and
//     won't reappear on a later goto in the same run; capture them on the
//     first navigation.
//
// Steps fail fast (8s) on a bad selector rather than stalling, and log the error.

import { readFileSync } from 'fs';
import pkg from './832events/web/node_modules/playwright-core/index.js';
const { chromium } = pkg;

const scenarioPath = process.argv[2];
if (!scenarioPath) {
  console.error('usage: node evals/shoot.mjs <scenario.json>');
  process.exit(1);
}
const s = JSON.parse(readFileSync(scenarioPath, 'utf8'));
const baseUrl = s.baseUrl || 'http://localhost:5173';
const outDir = process.argv[3] || s.outDir || '/tmp/shots';

const browser = await chromium.launch();
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
