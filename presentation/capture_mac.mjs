import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AFTER = path.join(__dirname, "screenshots", "after");

const AFTER_PAGES = [
  ["home",      "http://localhost:8765/index.html"],
  ["domaine",   "http://localhost:8765/domaine.html"],
  ["chambres",  "http://localhost:8765/chambres.html"],
  ["activites", "http://localhost:8765/activites.html"],
  ["avis",      "http://localhost:8765/avis.html"],
  ["contact",   "http://localhost:8765/contact.html"],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

for (const [label, url] of AFTER_PAGES) {
  console.log(`Capturing ${label}...`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(3000);
  const out = path.join(AFTER, `${label}.png`);
  await page.screenshot({ path: out, fullPage: true });
  console.log(`  Saved: ${out}`);
}

await browser.close();
console.log("Done!");
