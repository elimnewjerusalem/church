# 🏛️ ENJC Church Website - Complete Package

## ✨ What's Included

This is a complete, professionally designed church website with:
- ✅ 6 responsive pages (Home, About, Media, Gallery, Events, Contact)
- ✅ Modern, elegant design with smooth animations
- ✅ Auto-playing image slider with touch support
- ✅ Interactive gallery with lightbox viewer
- ✅ Contact form with WhatsApp integration
- ✅ Mobile-friendly responsive design
- ✅ Professional typography and color scheme

---

## 📁 File Structure

```
your-website/
├── css/
│   └── style.css          ← Replace with new improved version
├── js/
│   ├── slider.js          ← Enhanced slider script
│   ├── gallery.js         ← Gallery with lightbox
│   └── events.js          ← Dynamic events loading
├── data/
│   └── events.json        ← Events data (optional)
├── images/
│   ├── logo/
│   │   └── logo.png
│   ├── home/
│   │   ├── slide1.jpg
│   │   └── slide2.jpg
│   ├── events/
│   │   ├── e1.jpg
│   │   ├── e2.jpg
│   │   └── e3.jpg
│   └── gallery/
│       ├── g1.jpg
│       ├── g2.jpg
│       └── g3.jpg
├── index.html             ← Home page
├── about.html             ← About page
├── media.html             ← Sermons & media
├── gallery.html           ← Photo gallery
├── events.html            ← Events listing
└── contact.html           ← Contact & map
```

---

## 🚀 Quick Setup Instructions

### Step 1: Replace Files

1. **CSS File**: Replace your `css/style.css` with the new improved version
2. **HTML Files**: Replace all 6 HTML pages (or keep your existing structure and copy sections you like)
3. **JavaScript Files**: Add the new JS files to your `js/` folder
4. **Events Data**: (Optional) Create a `data/` folder and add `events.json`

### Step 2: Update Your Content

#### **Contact Information**
Update these in `contact.html`:
- Phone number: `+91 94443 45102`
- Email address
- Physical address
- Google Maps embed code

#### **Google Maps Setup**
1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your church address
3. Click "Share" → "Embed a map"
4. Copy the iframe code
5. Replace the iframe in `contact.html`

#### **WhatsApp Integration**
Update phone number in all files:
- Search for `919444345102`
- Replace with your WhatsApp number (with country code, no + or spaces)
- Format: `919444345102` (India example)

#### **YouTube Videos**
In `media.html`, replace:
```html
src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
```
With your actual YouTube video ID.

---

## 🎨 Customization Guide

### Change Colors

Edit the `:root` section in `style.css`:

```css
:root{
  --primary:#0b2a45;      /* Navy blue - main color */
  --accent:#f4b400;       /* Gold - accent color */
  --light:#f6f8fb;        /* Light gray background */
  --white:#ffffff;        /* White */
}
```

### Change Fonts

The site uses:
- **Playfair Display** (headings) - elegant serif
- **Inter** (body text) - modern sans-serif

To change fonts, update this line in `style.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YOUR-FONT&display=swap');
```

Then update:
```css
body { font-family: 'YourFont', sans-serif; }
h1, h2, h3 { font-family: 'YourHeadingFont', serif; }
```

### Slider Speed

In `slider.js`, change auto-play speed:
```javascript
setInterval(nextSlide, 5000); // 5000 = 5 seconds
```

---

## 📱 Features Explained

### 1. **Auto-Playing Slider**
- Changes slides every 5 seconds
- Manual navigation with arrow buttons
- Swipe support on mobile
- Keyboard navigation (arrow keys)
- Pauses on hover (desktop)

### 2. **Gallery Lightbox**
- Click any image to view full size
- Navigate with arrow buttons
- Keyboard support (arrow keys, ESC to close)
- Swipe support on mobile
- Shows image captions

### 3. **Contact Form**
- Sends messages via WhatsApp
- Form validation
- Success confirmation
- Mobile-friendly

### 4. **Responsive Design**
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)
- Touch-friendly buttons
- Readable text at all sizes

---

## 🎯 Page-by-Page Guide

### **Home Page** (`index.html`)
- Hero slider with 2+ images
- Service timings cards
- Quick links

**To add more slides:**
```html
<img src="images/home/slide3.jpg" class="slide" alt="Description">
```

### **About Page** (`about.html`)
- Church story
- Vision & mission
- Core beliefs
- Join us section

**Customize:** Edit text content to match your church's story

### **Media Page** (`media.html`)
- Featured sermon video
- Recent sermons
- Audio podcasts
- Live stream info

**To add videos:**
1. Upload to YouTube
2. Get video ID from URL
3. Replace `YOUR_VIDEO_ID` in embed code

### **Gallery Page** (`gallery.html`)
- Photo grid
- Lightbox viewer
- Image captions

**To add photos:**
```html
<div class="item">
  <img src="images/gallery/g4.jpg" alt="Description">
  <p>Photo Caption</p>
</div>
```

### **Events Page** (`events.html`)
- Upcoming events
- Regular services
- Special events

**To add events:** Edit `events.json` or add HTML directly

### **Contact Page** (`contact.html`)
- Contact information
- Contact form
- Google Maps
- Prayer request section

**Update:** Address, phone, email, map location

---

## 🐛 Common Issues & Solutions

### Issue: Slider images not showing
**Solution:** Check image paths in `index.html`. Make sure images exist in `images/home/` folder.

### Issue: Slider not auto-playing
**Solution:** Make sure `slider.js` is properly linked in your HTML:
```html
<script src="js/slider.js"></script>
```

### Issue: Gallery lightbox not working
**Solution:** Verify `gallery.js` is included in `gallery.html`:
```html
<script src="js/gallery.js"></script>
```

### Issue: WhatsApp button not working
**Solution:** Update phone number format: `919444345102` (country code + number, no spaces)

### Issue: Fonts not loading
**Solution:** Check internet connection - Google Fonts requires online access

---

## 📊 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🎓 Tips for Best Results

1. **Use high-quality images** (1920x1080px recommended for slider)
2. **Compress images** before uploading (use TinyPNG.com)
3. **Keep text concise** - people scan, they don't read everything
4. **Update regularly** - add new sermons, events, photos
5. **Test on mobile** - most people will view on phones
6. **Get feedback** - ask church members to test the site

---

## 🔧 Advanced Customization

### Add More Pages
1. Copy any existing HTML file
2. Rename it
3. Update content
4. Add link in navigation menu

### Dynamic Events
To pull events from JSON file:
1. Create `data/events.json`
2. Add event objects following the format
3. Events will auto-load on page

### Newsletter Signup
Add this to footer:
```html
<form action="YOUR_MAILCHIMP_URL" method="post">
  <input type="email" name="EMAIL" placeholder="Your email">
  <button type="submit" class="btn register">Subscribe</button>
</form>
```

---

## 📞 Support

Need help? Contact via:
- WhatsApp: +91 94443 45102
- Email: (your email here)

---

## 📝 Checklist Before Going Live

- [ ] Replace all placeholder text with your church info
- [ ] Update phone numbers and email addresses
- [ ] Add your church logo
- [ ] Upload your slider images
- [ ] Add gallery photos
- [ ] Configure Google Maps with correct location
- [ ] Test contact form
- [ ] Add YouTube videos
- [ ] Test on mobile devices
- [ ] Check all links work
- [ ] Proofread all text
- [ ] Get feedback from 2-3 people

---

## 🎉 You're All Set!

Your church website is ready to inspire and connect your community!

**Remember:** This is a living website - keep it updated with new sermons, events, and photos to keep your congregation engaged.

God bless your ministry! 🙏
