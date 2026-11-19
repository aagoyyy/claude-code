// render.mjs — deterministic frame renderer: Playwright (Chromium) screenshots JPEG -> ffmpeg (libx264, yuv420p).
// usage:
//   node engine/render.mjs video  <scene.html> <out.mp4> [fps=60] [workers=4] [crf=18]
//   node engine/render.mjs stills <scene.html> <outdir> t1 t2 ...        (full-size PNG stills)
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");   // works with a global playwright install too
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [mode, scene, out, ...rest] = process.argv.slice(2);
const url = pathToFileURL(path.resolve(scene)).href;

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  const size = await page.evaluate(() => { const s = document.getElementById("stage"); return { w: +s.getAttribute("width"), h: +s.getAttribute("height") }; });
  await page.setViewportSize({ width: size.w, height: size.h });
  return { page, size };
}

async function renderChunk(browser, frames, fps, file, crf) {
  const { page, size } = await openPage(browser);
  const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-preset", "medium", "-crf", String(crf), "-pix_fmt", "yuv420p", "-r", String(fps), file], { stdio: ["pipe", "inherit", "inherit"] });
  for (const i of frames) {
    await page.evaluate(t => window.render(t), i / fps);
    const buf = await page.screenshot({ type: "jpeg", quality: 92, clip: { x: 0, y: 0, width: size.w, height: size.h } });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on("close", r));
  await page.close();
}

const browser = await chromium.launch();
if (mode === "video") {
  const fps = +(rest[0] || 60), workers = +(rest[1] || 4), crf = +(rest[2] || 18);
  const { page } = await openPage(browser); const dur = await page.evaluate(() => window.DUR); await page.close();
  const n = Math.round(dur * fps), per = Math.ceil(n / workers), tmp = out + ".parts"; mkdirSync(tmp, { recursive: true });
  const parts = [];
  const jobs = [];
  for (let w = 0; w < workers; w++) {
    const fr = []; for (let i = w * per; i < Math.min(n, (w + 1) * per); i++) fr.push(i);
    if (!fr.length) continue;
    const f = path.join(tmp, `part${w}.mp4`); parts.push(f); jobs.push(renderChunk(browser, fr, fps, f, crf));
  }
  const t0 = Date.now(); await Promise.all(jobs);
  writeFileSync(path.join(tmp, "list.txt"), parts.map(p => `file '${path.resolve(p)}'`).join("\n"));
  await new Promise(r => spawn("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", path.join(tmp, "list.txt"), "-c", "copy", out], { stdio: "inherit" }).on("close", r));
  rmSync(tmp, { recursive: true, force: true });
  console.log(`done ${n} frames @${fps}fps in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${out}`);
} else if (mode === "stills") {
  mkdirSync(out, { recursive: true });
  const { page, size } = await openPage(browser);
  for (const t of rest) {
    await page.evaluate(t => window.render(t), +t);
    await page.screenshot({ path: path.join(out, `still_${(+t).toFixed(2)}.png`), clip: { x: 0, y: 0, width: size.w, height: size.h } });
  }
  console.log("stills ->", out);
}
await browser.close();
