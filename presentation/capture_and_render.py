# -*- coding: utf-8 -*-
"""
Before / After video - Domaine Saint Dominique
Screenshots via Playwright - Video via FFmpeg
"""

import asyncio, os, subprocess, sys, shutil
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright

# ── Paths ──────────────────────────────────────────────────────────
BASE   = r"C:\Dev\Projects\Shunpo\Saint_Dominique\presentation"
BEFORE = os.path.join(BASE, "screenshots", "before")
AFTER  = os.path.join(BASE, "screenshots", "after")
OUT    = os.path.join(BASE, "before_after.mp4")

FFMPEG = (shutil.which("ffmpeg") or
          r"C:\Users\Thomas\AppData\Local\Microsoft\WinGet\Packages"
          r"\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe"
          r"\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe")

# ── Video settings ─────────────────────────────────────────────────
W, H   = 1280, 720   # output resolution
FPS    = 30
SCROLL_SPEED = 180   # px per second

# ── Pages to capture ───────────────────────────────────────────────
BEFORE_PAGES = [
    ("home",     "https://www.domainesaintdominique.fr/fran%C3%A7ais/bienvenue-au-domaine-saint-dominique/"),
    ("rooms",    "https://www.domainesaintdominique.fr/fran%C3%A7ais/chambres-d-h%C3%B4tes/"),
    ("tarifs",   "https://www.domainesaintdominique.fr/fran%C3%A7ais/tarifs/"),
    ("activites","https://www.domainesaintdominique.fr/fran%C3%A7ais/activit%C3%A9s/"),
    ("galerie",  "https://www.domainesaintdominique.fr/fran%C3%A7ais/galerie-de-photos/"),
    ("contact",  "https://www.domainesaintdominique.fr/fran%C3%A7ais/contact/"),
    ("presse",   "https://www.domainesaintdominique.fr/fran%C3%A7ais/presse/"),
]

AFTER_PAGES = [
    ("home",      "http://localhost:8765/index.html"),
    ("domaine",   "http://localhost:8765/domaine.html"),
    ("chambres",  "http://localhost:8765/chambres.html"),
    ("activites", "http://localhost:8765/activites.html"),
    ("avis",      "http://localhost:8765/avis.html"),
    ("contact",   "http://localhost:8765/contact.html"),
]


# ── Screenshot capture ─────────────────────────────────────────────
async def screenshot(page, url, out_path, label):
    print(f"  >> {label}: {url}")
    await page.goto(url, wait_until="domcontentloaded", timeout=30000)
    await page.wait_for_timeout(3000)  # let JS + images settle

    # dismiss cookie banners if present
    for sel in ["button:has-text('Accepter')", "button:has-text('Accept')",
                "button:has-text('Tout accepter')", "#onetrust-accept-btn-handler"]:
        try:
            btn = page.locator(sel).first
            if await btn.is_visible(timeout=1000):
                await btn.click()
                await page.wait_for_timeout(500)
                break
        except Exception:
            pass

    await page.screenshot(path=out_path, full_page=True)
    print(f"     saved: {out_path}")


async def capture_all():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(
            viewport={"width": W, "height": H},
            device_scale_factor=1,
        )
        page = await ctx.new_page()

        for label, url in BEFORE_PAGES:
            out = os.path.join(BEFORE, f"{label}.png")
            try:
                await screenshot(page, url, out, f"BEFORE/{label}")
            except Exception as e:
                print(f"     SKIPPED ({e})")

        for label, url in AFTER_PAGES:
            out = os.path.join(AFTER, f"{label}.png")
            try:
                await screenshot(page, url, out, f"AFTER/{label}")
            except Exception as e:
                print(f"     SKIPPED ({e})")

        await browser.close()


# ── FFmpeg helpers ─────────────────────────────────────────────────
def scroll_clip(img_path, clip_path, label_text, label_color):
    """
    Turn a full-page screenshot into a scrolling video clip.
    Prepends a 2-second title card, then scrolls top-to-bottom.
    """
    ffprobe = FFMPEG.replace("ffmpeg.exe", "ffprobe.exe")
    probe = subprocess.run(
        [ffprobe, "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=height", "-of", "csv=p=0", img_path],
        capture_output=True, text=True
    )
    try:
        img_h = int(probe.stdout.strip())
    except Exception:
        img_h = 3000  # fallback

    scroll_dist  = max(0, img_h - H)
    scroll_secs  = max(4, scroll_dist / SCROLL_SPEED)
    total_frames = int((2 + scroll_secs + 1) * FPS)  # 2s title + scroll + 1s hold

    # Title card filter (black bg, centered text)
    title_frames = 2 * FPS
    hold_frames  = 1 * FPS
    scroll_frames = int(scroll_secs * FPS)

    # FFmpeg filter commas would split the filtergraph, so use algebraic equivalents:
    #   max(0, x)  = (x + abs(x)) / 2
    #   min(S, y)  = (S + y - abs(S - y)) / 2
    speed = f"{SCROLL_SPEED}/{FPS}"
    raw   = f"(n-{title_frames})*{speed}"
    lo    = f"({raw}+abs({raw}))/2"           # = max(0, raw)
    S     = scroll_dist
    y_expr = f"({S}+{lo}-abs({S}-({lo})))/2"  # = min(S, lo)

    font_b    = r"C\:/Windows/Fonts/calibrib.ttf"
    box_color = label_color + "CC"

    vf = (
        f"crop={W}:{H}:0:{y_expr},"
        f"drawtext=fontfile='{font_b}':text='{label_text}':fontsize=46:fontcolor=white"
        f":box=1:boxcolor={box_color}:boxborderw=20"
        f":x=(w-text_w)/2:y=28"
        f":enable='lt(n,{title_frames})'"
    )

    cmd = [
        FFMPEG, "-y",
        "-loop", "1", "-framerate", str(FPS), "-i", img_path,
        "-vf", vf,
        "-t", str(2 + scroll_secs + 1),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-pix_fmt", "yuv420p",
        clip_path
    ]
    print(f"  Rendering {os.path.basename(clip_path)} ...")
    result = subprocess.run(cmd, capture_output=True)
    if result.returncode != 0:
        print("  FFmpeg stderr:", result.stderr.decode(errors="replace")[-600:])
        raise subprocess.CalledProcessError(result.returncode, cmd)


def title_card(text, sub, color, out_path, duration=3):
    """Render a plain title card with FFmpeg lavfi."""
    font_b = r"C\:/Windows/Fonts/calibrib.ttf"
    font_r = r"C\:/Windows/Fonts/calibri.ttf"
    cmd = [
        FFMPEG, "-y",
        "-f", "lavfi",
        "-i", f"color=c={color}:s={W}x{H}:r={FPS}:d={duration}",
        "-vf", (
            f"drawtext=fontfile='{font_b}':text='{text}':fontsize=80:fontcolor=white"
            f":x=(w-text_w)/2:y=(h-text_h)/2-40,"
            f"drawtext=fontfile='{font_r}':text='{sub}':fontsize=34:fontcolor=white@0.8"
            f":x=(w-text_w)/2:y=(h-text_h)/2+60"
        ),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-pix_fmt", "yuv420p",
        out_path
    ]
    print(f"  Title card: {text} ...")
    result = subprocess.run(cmd, capture_output=True)
    if result.returncode != 0:
        print("  FFmpeg stderr:", result.stderr.decode(errors="replace")[-600:])
        raise subprocess.CalledProcessError(result.returncode, cmd)


def concat_clips(clip_list, out_path):
    list_file = os.path.join(BASE, "clips.txt")
    with open(list_file, "w") as f:
        for c in clip_list:
            f.write(f"file '{c}'\n")
    cmd = [
        FFMPEG, "-y",
        "-f", "concat", "-safe", "0", "-i", list_file,
        "-c", "copy",
        out_path
    ]
    print("  Concatenating clips …")
    subprocess.run(cmd, check=True, capture_output=True)


# ── Main ───────────────────────────────────────────────────────────
def build_video():
    clips_dir = os.path.join(BASE, "clips")
    os.makedirs(clips_dir, exist_ok=True)
    clips = []

    # Intro card
    intro = os.path.join(clips_dir, "00_intro.mp4")
    title_card("Domaine Saint Dominique",
               "Refonte du site web  -  Avant / Apres",
               "0x1a1a1a", intro, duration=3)
    clips.append(intro)

    # AVANT card
    avant_card = os.path.join(clips_dir, "01_avant_card.mp4")
    title_card("AVANT", "Site actuel  -  domainesaintdominique.fr",
               "0x3d1a1a", avant_card, duration=2)
    clips.append(avant_card)

    # Before pages
    for i, (label, _) in enumerate(BEFORE_PAGES):
        img = os.path.join(BEFORE, f"{label}.png")
        if not os.path.exists(img):
            continue
        clip = os.path.join(clips_dir, f"02_before_{i:02d}_{label}.mp4")
        names = {"home": "Accueil", "rooms": "Chambres", "tarifs": "Tarifs",
                 "activites": "Activites", "galerie": "Galerie", "contact": "Contact", "presse": "Presse"}
        scroll_clip(img, clip, f"AVANT  {names.get(label, label)}", "3d1a1a")
        clips.append(clip)

    # APRÈS card
    apres_card = os.path.join(clips_dir, "03_apres_card.mp4")
    title_card("APRES", "Nouveau prototype  -  Design modernise",
               "0x1a2e1a", apres_card, duration=2)
    clips.append(apres_card)

    # After pages
    for i, (label, _) in enumerate(AFTER_PAGES):
        img = os.path.join(AFTER, f"{label}.png")
        if not os.path.exists(img):
            continue
        clip = os.path.join(clips_dir, f"04_after_{i:02d}_{label}.mp4")
        names = {"home": "Accueil", "domaine": "Le Domaine", "chambres": "Chambres",
                 "activites": "Activites", "avis": "Avis clients", "contact": "Contact"}
        scroll_clip(img, clip, f"APRES  {names.get(label, label)}", "1a3d1a")
        clips.append(clip)

    # Outro card
    outro = os.path.join(clips_dir, "05_outro.mp4")
    title_card("Domaine Saint Dominique",
               "Prototype realise par Shunpo Studio",
               "0x1a1a1a", outro, duration=4)
    clips.append(outro)

    concat_clips(clips, OUT)
    print(f"\nDone! Video saved to:\n  {OUT}")


if __name__ == "__main__":
    import sys
    skip_capture = "--no-capture" in sys.argv

    if not skip_capture:
        print("=== Step 1: Capturing screenshots ===")
        asyncio.run(capture_all())
    else:
        print("=== Step 1: Skipping capture (screenshots already exist) ===")

    print("\n=== Step 2: Building video ===")
    build_video()
