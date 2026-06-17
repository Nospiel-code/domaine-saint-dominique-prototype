/**
 * Before / After video - Domaine Saint Dominique
 * Mac version — ffmpeg crossfade transitions between paired pages
 */
import { execSync, spawnSync } from "child_process";
import { existsSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE      = __dirname;
const BEFORE    = path.join(BASE, "screenshots", "before");
const AFTER     = path.join(BASE, "screenshots", "after");
const CLIPS     = path.join(BASE, "clips");
const OUT       = path.join(BASE, "before_after.mp4");

mkdirSync(CLIPS, { recursive: true });

const W  = 1280, H = 720, FPS = 30;
const SCROLL_SPEED = 180; // px / sec
const FADE_DURATION = 1;  // seconds crossfade

// Pages: [beforeLabel, afterLabel, displayName]
const PAGE_PAIRS = [
  ["home",      "home",      "Accueil"],
  ["rooms",     "chambres",  "Chambres"],
  ["activites", "activites", "Activités"],
  ["contact",   "contact",   "Contact"],
];
// New pages with no before equivalent
const NEW_PAGES = [
  ["domaine",  "Le Domaine"],
  ["avis",     "Avis clients"],
];

// ── helpers ────────────────────────────────────────────────────────────────

const FFMPEG = "/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg";
const FFPROBE = "/opt/homebrew/opt/ffmpeg-full/bin/ffprobe";

function ffmpeg(args, label) {
  const result = spawnSync(FFMPEG, args, { maxBuffer: 100 * 1024 * 1024 });
  if (result.status !== 0) {
    console.error(`FFmpeg failed (${label}):`, result.stderr?.toString().slice(-600));
    process.exit(1);
  }
}

function imgHeight(imgPath) {
  const r = spawnSync(FFPROBE, [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=height", "-of", "csv=p=0", imgPath
  ], { maxBuffer: 1024 * 1024 });
  return parseInt(r.stdout?.toString().trim()) || 3000;
}

function scrollClip(imgPath, outPath, labelText, duration = null) {
  const imgH   = imgHeight(imgPath);
  const dist   = Math.max(0, imgH - H);
  const secs   = duration ?? Math.max(4, dist / SCROLL_SPEED);
  const speed  = SCROLL_SPEED / FPS;
  const tf     = 0;                // no title frame overlay
  const raw    = `n*${speed}`;
  const lo     = `(${raw}+abs(${raw}))/2`;
  const yExpr  = `(${dist}+${lo}-abs(${dist}-(${lo})))/2`;

  ffmpeg([
    "-y", "-loop", "1", "-framerate", String(FPS), "-i", imgPath,
    "-vf", `crop=${W}:${H}:0:${yExpr}`,
    "-t", String(secs + 1),
    "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
    outPath
  ], `scroll ${labelText}`);
  console.log(`  ✓ ${path.basename(outPath)}`);
  return secs + 1;
}

function titleCard(text, sub, color, outPath, duration = 3) {
  ffmpeg([
    "-y",
    "-f", "lavfi",
    "-i", `color=c=${color}:s=${W}x${H}:r=${FPS}:d=${duration}`,
    "-vf", [
      `drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial Unicode.ttf:text='${text}':fontsize=80:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-40`,
      `drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial Unicode.ttf:text='${sub}':fontsize=34:fontcolor=white@0.8:x=(w-text_w)/2:y=(h-text_h)/2+60`,
    ].join(","),
    "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
    outPath
  ], `title card: ${text}`);
  console.log(`  ✓ ${path.basename(outPath)}`);
}

/** Crossfade between clipA and clipB, output to outPath */
function crossfade(clipAPath, clipBPath, outPath, fadeSecs = FADE_DURATION) {
  // Get duration of clip A
  const r = spawnSync(FFPROBE, [
    "-v", "error", "-show_entries", "format=duration",
    "-of", "csv=p=0", clipAPath
  ]);
  const durA = parseFloat(r.stdout?.toString().trim()) || 5;
  const offset = Math.max(0, durA - fadeSecs);

  ffmpeg([
    "-y",
    "-i", clipAPath,
    "-i", clipBPath,
    "-filter_complex",
    `[0:v][1:v]xfade=transition=fade:duration=${fadeSecs}:offset=${offset}[v]`,
    "-map", "[v]",
    "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
    outPath
  ], `crossfade → ${path.basename(outPath)}`);
  console.log(`  ✓ crossfade → ${path.basename(outPath)}`);
}

function concatClips(clipPaths, outPath) {
  const listFile = path.join(BASE, "clips.txt");
  writeFileSync(listFile, clipPaths.map(c => `file '${c}'`).join("\n"));
  ffmpeg([
    "-y", "-f", "concat", "-safe", "0", "-i", listFile,
    "-c", "copy", outPath
  ], "concat");
  console.log(`  ✓ Final video: ${outPath}`);
}

// ── main ───────────────────────────────────────────────────────────────────

const finalClips = [];
let idx = 0;

// Intro card
const intro = path.join(CLIPS, "00_intro.mp4");
console.log("\n── Intro card ──");
titleCard("Domaine Saint Dominique", "Refonte du site web  —  Avant / Après", "0x1a1a1a", intro, 3);
finalClips.push(intro);

// Paired pages: before scroll → crossfade → after scroll
for (const [beforeLabel, afterLabel, name] of PAGE_PAIRS) {
  const beforeImg = path.join(BEFORE, `${beforeLabel}.png`);
  const afterImg  = path.join(AFTER,  `${afterLabel}.png`);
  if (!existsSync(beforeImg) || !existsSync(afterImg)) {
    console.log(`  ⚠ Skipping ${name} (missing screenshot)`);
    continue;
  }

  console.log(`\n── ${name} ──`);
  const i = String(idx).padStart(2, "0");
  const beforeClip = path.join(CLIPS, `pair_${i}_${beforeLabel}_before.mp4`);
  const afterClip  = path.join(CLIPS, `pair_${i}_${afterLabel}_after.mp4`);
  const fadedClip  = path.join(CLIPS, `pair_${i}_${beforeLabel}_faded.mp4`);

  scrollClip(beforeImg, beforeClip, `AVANT ${name}`);
  scrollClip(afterImg,  afterClip,  `APRÈS ${name}`);
  crossfade(beforeClip, afterClip, fadedClip);
  finalClips.push(fadedClip);
  idx++;
}

// New pages (no before equivalent) — just scroll with a card
for (const [afterLabel, name] of NEW_PAGES) {
  const afterImg = path.join(AFTER, `${afterLabel}.png`);
  if (!existsSync(afterImg)) {
    console.log(`  ⚠ Skipping ${name} (missing screenshot)`);
    continue;
  }

  console.log(`\n── ${name} (nouveau) ──`);
  const cardClip  = path.join(CLIPS, `new_${idx}_${afterLabel}_card.mp4`);
  const afterClip = path.join(CLIPS, `new_${idx}_${afterLabel}_scroll.mp4`);

  titleCard(`Nouveau — ${name}`, "Page absente de l'ancien site", "0x1a2e1a", cardClip, 2);
  scrollClip(afterImg, afterClip, `APRÈS ${name}`);

  const fadedClip = path.join(CLIPS, `new_${idx}_${afterLabel}_faded.mp4`);
  crossfade(cardClip, afterClip, fadedClip);
  finalClips.push(fadedClip);
  idx++;
}

// Outro card
console.log("\n── Outro ──");
const outro = path.join(CLIPS, "99_outro.mp4");
titleCard("Domaine Saint Dominique", "Réalisé par Shunpo", "0x1a1a1a", outro, 4);
finalClips.push(outro);

// Concat all
console.log("\n── Assembling final video ──");
concatClips(finalClips, OUT);
console.log(`\nDone! → ${OUT}`);
