import * as DATA from './imagegen-data.js';
import * as UI from './imagegen-ui.js';
import * as EXPORTER from './imagegen-export.js';
import './imagegen-canvas.js'; // sets window.draw, window.drawBgImage, window.roundRect

// Expose everything to window so inline onclick handlers work
Object.assign(window, DATA, UI, EXPORTER);

// Kick off init once DOM is ready (initStudio handles logo preload internally)
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => window.initStudio?.());
} else {
  window.initStudio?.();
}
