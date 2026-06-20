// Drive the app and capture screenshots from a scenario file.
//
// Usage: node evals/shoot.mjs <scenario.json>
//
// Scenario shape:
// {
//   "baseUrl": "http://localhost:5173",
//   "viewport": { "width": 1280, "height": 900 },   // optional
//   "outDir": "/tmp/shots",                          // where PNGs land
//   "steps": [
//     { "goto": "/" },
//     { "shot": "01-home" },                         // -> <outDir>/01-home.png
//     { "click": "text=Start browsing" },
//     { "fill": ["input", "brewery"] },              // [selector, value]
//     { "press": "Enter" },
//     { "wait": 1500 }                               // ms
//   ]
// }
//
// Selectors are Playwright selectors (text=, CSS, role=...). The browser is
// shared across all steps so state (filters, selections) carries through.

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
const outDir = s.outDir || '/tmp/shots';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: s.viewport || { width: 1280, height: 900 } });

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
    } else if (step.press !== undefined) {
      await page.keyboard.press(step.press);
      await page.waitForTimeout(800);
    } else if (step.wait !== undefined) {
      await page.waitForTimeout(step.wait);
    } else if (step.shot !== undefined) {
      const path = `${outDir}/${step.shot}.png`;
      await page.screenshot({ path });
      console.log('shot ' + path);
    }
  } catch (err) {
    console.error(`step failed (${JSON.stringify(step)}): ${err.message}`);
  }
}

await browser.close();
console.log('done');
