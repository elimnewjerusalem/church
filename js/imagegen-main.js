import * as DATA from './imagegen-data.js';
import * as UI from './imagegen-ui.js';
import * as EXPORTER from './imagegen-export.js';
import * as CANVAS from './imagegen-canvas.js';

Object.assign(window, DATA, UI, EXPORTER, CANVAS);

window._logoImg = new Image();
window._logoImg.onload = () => window.debounceDraw?.();

window.addEventListener('DOMContentLoaded', () => {
  window.initStudio?.();
});
