# ENJC Website

Official website for Elim New Jerusalem Church, Tondiarpet, Chennai.

Pages: Home, About, Ministries, Events, Gallery, Contact.

## Deploy
Push this folder's contents to the root of the `church` GitHub repo,
enable GitHub Pages (branch: main, folder: /root).

Live at: `https://elimnewjerusalem.github.io/church/`

## Structure
```
index.html, about.html, ministries.html, events.html, gallery.html, contact.html, 404.html
css/        — main.css, pages.css, design-system.css, premium-v2.css, mobile-fix.css
js/         — site.js, design-upgrade.js, events.js, live-stream.js, sw.js
data/       — manifest.json, events.json
images/     — logo, home, gallery, ministries, Live, pastor photos
```

## Notes
- The Bible Reader and Verse Card Studio have moved to a separate app:
  `https://elimnewjerusalem.github.io/enjc-bible/`
  This website no longer links to or depends on that app.
- Service worker registers at `js/sw.js` (relative path — works at any deploy path).
