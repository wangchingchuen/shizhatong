// Capture real screenshots of the dist/ prototype for scene 7–8.
// Usage: node scripts/capture-demo.mjs  (starts ../server.mjs on 127.0.0.1:4173)
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const out = path.resolve(here, '../public/shots');
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const server = spawn(process.execPath, ['server.mjs'], {cwd: repo, stdio: 'ignore'});
await new Promise(r => setTimeout(r, 800));
const browser = await playwright.chromium.launch();
try {
  const page = await browser.newPage({viewport: {width: 480, height: 1400}, deviceScaleFactor: 2, reducedMotion: 'reduce'});
  await page.goto('http://127.0.0.1:4173/');
  await page.selectOption('#scenario', 'police');
  const union = async (a, b, pad = 12) => {
    const x = await page.locator(a).boundingBox(), y = await page.locator(b).boundingBox();
    const left = Math.min(x.x, y.x) - pad, top = Math.min(x.y, y.y) - pad;
    return {x: left, y: top, width: Math.max(x.x + x.width, y.x + y.width) - left + pad, height: Math.max(x.y + x.height, y.y + y.height) - top + pad};
  };
  // 0. consent not yet ticked, 1. consent ticked
  await page.locator('.call-card label.consent').scrollIntoViewIfNeeded();
  await page.screenshot({path: `${out}/00-consent-off.png`, clip: await union('.call-card label.consent', '.call-card .actions')});
  await page.check('#consent');
  await page.screenshot({path: `${out}/01-consent.png`, clip: await union('.call-card label.consent', '.call-card .actions')});
  // 2. press start -> "guarding" status (crop phone top to number; skips the demo's status sentence)
  await page.click('#start');
  await page.waitForTimeout(300);
  await page.screenshot({path: `${out}/02-guarding.png`, clip: await union('.phone-top', '#number', 16)});
  // 3. next two lines -> high risk card with reasons
  await page.click('#next'); await page.click('#next');
  await page.waitForTimeout(300);
  await page.locator('.risk-card').screenshot({path: `${out}/03-risk.png`});
  await page.locator('#reasons').screenshot({path: `${out}/04-reasons.png`});
  console.log('score', await page.textContent('#score'), await page.textContent('#risk-label'));
} finally { await browser.close(); server.kill(); }
