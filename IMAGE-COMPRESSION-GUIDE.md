# Fix: Compress slide1.jpg (20MB → under 300KB)

## Why this matters
Your `images/home/slide1.jpg` is **20MB**. This makes the homepage take
10–15 seconds to load on mobile in India. Fixing this is the #1 improvement
you can make — it costs nothing and takes 5 minutes.

---

## Option A — Squoosh (easiest, free, browser-based)

1. Go to **https://squoosh.app**
2. Drag in `images/home/slide1.jpg`
3. On the right panel, set:
   - Format: **WebP** (or JPEG if you prefer)
   - Quality: **75**
   - Resize: width **1920px** (your current size is fine, just reduce quality)
4. Click **Download**
5. Replace `images/home/slide1.jpg` with the downloaded file
6. Also compress `slide2.jpg` and `slide3.jpg` the same way (they're ~120KB each, still worth doing)

**Target size:** under 300KB per image.

---

## Option B — VS Code extension

Install **Squoosh** or **TinyPNG** VS Code extension, right-click the image → Compress.

---

## Option C — Command line (if you have ImageMagick installed)

```bash
magick images/home/slide1.jpg -quality 75 -resize 1920x -strip images/home/slide1.jpg
```

---

## After compressing

Commit and push to GitHub:

```bash
git add images/home/slide1.jpg
git commit -m "Compress slide1.jpg to fix slow load"
git push
```

GitHub Pages will update within ~1 minute.

---

## What about WebP format?

WebP is ~30% smaller than JPEG at the same quality. If you rename the file
to `slide1.webp`, update `index.html` too:

```html
<img src="images/home/slide1.webp" class="slide active" alt="Church worship service">
```

---

## Expected result

| Image       | Before   | After (target) |
|-------------|----------|----------------|
| slide1.jpg  | 20 MB    | < 300 KB       |
| slide2.jpg  | 257 KB   | < 120 KB       |
| slide3.jpg  | 184 KB   | < 100 KB       |

Load time improvement: **~10 seconds faster** on mobile.
