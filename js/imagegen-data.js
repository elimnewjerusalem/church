/**
 * ENJC imagegen-data.js
 * Global helpers and shared state for the Verse Studio.
 * Imported by imagegen-main.js and used by imagegen-ui.js via window globals.
 */

/** Shorthand for document.getElementById */
export function g(id) { return document.getElementById(id); }

/** Global studio state object */
export const ST = {
  sz:       '9:16',
  bgMode:   'solid',
  bgColor:  '#0a1628',
  grad:     { a: '#0a1628', b: '#1a3060' },
  gradAngle: 135,
  gradMode: 'linear',
  font:     'Cormorant Garamond',
  txColor:  '#f5c842',
  textPos:  'center',
  textGlow: false,
  showRef:  true,
  showEn:   false,
  showTa:   true,
  showWM:   true,
  autoFit:  true,
  verseIdx: 0,
  activeTpl: null,
};

/** Verse list (populated by imagegen-ui.js from the full dataset) */
export let VERSES = [];
