"""
Makes small, fast-loading card thumbnails from your big flyer images.

HOW TO USE
1. I put this file next to my 'Assets' folder and run:
       pip install pillow (if you dont already have it installed)
       python make_thumbnails.py
2. It reads every png/jpg in Assets/myownwork and writes a small .webp
   version of each into Assets/myownwork/thumbs/
3. Thumbnails that already exist are skipped, so re-running only converts NEW images.
  
4. My  full-size original ones are not touched (the lightbox still would uses them one the button is clicked for original quality).
you can use this for any folder with imaages just replace the paths

"""
from pathlib import Path
from PIL import Image

SRC = Path("Assets/myownwork")
OUT = SRC / "thumbs"
WIDTH = 650          # cards are 325px wide, so 650 stays sharp on retina screens
OUT.mkdir(exist_ok=True)

for f in SRC.iterdir():
    if f.suffix.lower() in (".png", ".jpg", ".jpeg"):
        target = OUT / (f.stem + ".webp")
        if target.exists():
            print("skipped (already exists)", target.name)
            continue
        im = Image.open(f).convert("RGB")
        if im.width > WIDTH:
            im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)
        im.save(target, "WEBP", quality=80)
        print("made", f.stem + ".webp")