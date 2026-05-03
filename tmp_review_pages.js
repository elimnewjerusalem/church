const fs = require('fs');
const path = require('path');
const root = process.cwd();
const files = fs.readdirSync(root).filter(f => f.endsWith('.html'));
for (const file of files) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  const title = (text.match(/<title>([^<]*)<\/title>/i) || [,''])[1].trim();
  const desc = (text.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) || [,''])[1].trim();
  const og = text.includes('property="og:') || text.includes("property='og:");
  const viewport = text.includes('name="viewport"');
  const canon = text.includes('rel="canonical"') || text.includes("rel='canonical'");
  const css = (text.match(/<link[^>]+href=["'][^"']+\.css["']/gi) || []).length;
  const js = (text.match(/<script[^>]+src=["'][^"']+["']/gi) || []).length;
  const inlineScript = /<script(?![^>]*src)/i.test(text);
  const h1 = /<h1[^>]*>/i.test(text);
  console.log('FILE:', file);
  console.log('  title:', title || '[missing]');
  console.log('  meta description:', desc ? desc : '[missing]');
  console.log('  viewport:', viewport, 'og tags:', og, 'canonical:', canon);
  console.log('  css refs:', css, 'js refs:', js, 'inline script:', inlineScript, 'h1:', h1);
  const bodyClasses = (text.match(/<body[^>]*class=["']([^"']*)["']/i)||[,'']);
  if (bodyClasses[1]) console.log('  body classes:', bodyClasses[1]);
  const mobile = /mob-/i.test(text) ? 'yes' : 'no';
  console.log('  mobile-related ids/classes:', mobile);
  console.log('');
}
