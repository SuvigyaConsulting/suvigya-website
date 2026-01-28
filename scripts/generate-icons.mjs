import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join } from 'path';

const PUBLIC = join(import.meta.dirname, '..', 'public');
const SAGE_500 = '#4A7C59';
const SAGE_900 = '#1a3a24';
const CREAM = '#F4F7F5';

function iconSvg(size) {
  const fontSize = Math.round(size * 0.55);
  const y = Math.round(size * 0.62);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.15)}" fill="${SAGE_500}"/>
  <text x="50%" y="${y}" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="${fontSize}" fill="white">S</text>
</svg>`;
}

function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${SAGE_900}"/>
  <rect x="60" y="60" width="1080" height="510" rx="8" fill="none" stroke="${SAGE_500}" stroke-width="2" opacity="0.4"/>
  <text x="600" y="270" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="64" fill="white" letter-spacing="6">SUVIGYA</text>
  <text x="600" y="340" text-anchor="middle" font-family="Georgia,serif" font-weight="400" font-size="28" fill="${SAGE_500}" letter-spacing="8">CONSULTING</text>
  <text x="600" y="420" text-anchor="middle" font-family="Arial,sans-serif" font-size="20" fill="#a0b8a8">Natural Resources Management &amp; Policy</text>
</svg>`;
}

async function generate() {
  // Icon sizes
  for (const [name, size] of [['favicon.ico', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
    const svg = Buffer.from(iconSvg(size));
    if (name.endsWith('.ico')) {
      await sharp(svg).png().toFile(join(PUBLIC, 'favicon.png'));
      // Also save as ico (just a PNG, browsers handle it)
      await sharp(svg).png().toFile(join(PUBLIC, name));
    } else {
      await sharp(svg).png().toFile(join(PUBLIC, name));
    }
    console.log(`Created ${name} (${size}x${size})`);
  }

  // Also create favicon.svg for modern browsers
  writeFileSync(join(PUBLIC, 'favicon.svg'), iconSvg(32));
  console.log('Created favicon.svg');

  // OG image
  const ogBuffer = Buffer.from(ogSvg());
  await sharp(ogBuffer).png().toFile(join(PUBLIC, 'og-image.png'));
  console.log('Created og-image.png (1200x630)');
}

generate().catch(console.error);
