/**
 * ENJC imagegen-canvas.js
 * Canvas drawing engine for Verse Studio.
 * Exported draw() is called by imagegen-ui.js via debounceDraw().
 */

import { g, ST } from './imagegen-data.js';

/**
 * Main draw function — renders current ST state onto the canvas.
 */
export function draw() {
  const cv = g('mob-preview-cv') || g('igcv');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, cv.width, cv.height);

  // Background
  if (ST.bgMode === 'solid') {
    ctx.fillStyle = ST.bgColor;
    ctx.fillRect(0, 0, cv.width, cv.height);
  } else if (ST.bgMode === 'gradient') {
    const grd = ST.gradMode === 'radial'
      ? ctx.createRadialGradient(cv.width/2, cv.height/2, 0, cv.width/2, cv.height/2, Math.max(cv.width, cv.height)/1.4)
      : ctx.createLinearGradient(
          cv.width  * Math.cos((ST.gradAngle * Math.PI) / 180 + Math.PI) / 2 + cv.width  / 2,
          cv.height * Math.sin((ST.gradAngle * Math.PI) / 180 + Math.PI) / 2 + cv.height / 2,
          cv.width  * Math.cos((ST.gradAngle * Math.PI) / 180) / 2 + cv.width  / 2,
          cv.height * Math.sin((ST.gradAngle * Math.PI) / 180) / 2 + cv.height / 2
        );
    grd.addColorStop(0, ST.grad.a);
    grd.addColorStop(1, ST.grad.b);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, cv.width, cv.height);
  }

  // Text rendering delegated to imagegen-ui draw helpers if available
  if (typeof window._enjcDrawText === 'function') {
    window._enjcDrawText(ctx, cv);
  }
}
