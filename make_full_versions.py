"""
Makes lighter "full size" versions of my flyers for the lightbox.
They stay big and sharp enough to zoom, but are MUCH smaller files.

USAGE (i put it in the same folder that has 'Assets'):
    pip install pillow (if you dont already have it installed)
    python make_full_versions.py

Output: Assets/myownwork/full/<name>.webp   (my originals are not touched)
Existing files are skipped, so re-running only converts new images.
"""
from pathlib import Path
from PIL import Image

SRC = Path("Assets/myownwork")
OUT = SRC / "full"
LONGEST_SIDE = 2000      # px - plenty for zooming on any screen
OUT.mkdir(exist_ok=True)

for f in SRC.iterdir():
    if f.suffix.lower() in (".png", ".jpg", ".jpeg"):
        target = OUT / (f.stem + ".webp")
        if target.exists():
            print("skipped", target.name)
            continue
        im = Image.open(f).convert("RGB")
        im.thumbnail((LONGEST_SIDE, LONGEST_SIDE), Image.LANCZOS)   # only shrinks, never enlarges
        im.save(target, "WEBP", quality=85)
        print("made", target.name)