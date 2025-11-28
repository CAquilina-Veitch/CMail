// Simple script to generate PWA icons
// Run with: node scripts/generate-icons.js

import { writeFileSync } from 'fs';

// Create a simple SVG icon (envelope)
const createSvgIcon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="24" height="24" rx="4" fill="url(#grad)"/>
  <path d="M4 8l7.89 5.26a2 2 0 002.22 0L22 8M6 19h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
        fill="none"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        transform="scale(0.75) translate(4, 4)"/>
</svg>`;

// Convert SVG to a data URL that can be used
const svg192 = createSvgIcon(192);
const svg512 = createSvgIcon(512);

writeFileSync('public/icons/icon-192.svg', svg192);
writeFileSync('public/icons/icon-512.svg', svg512);

console.log('SVG icons generated! Convert to PNG for best compatibility.');
console.log('You can use an online tool like https://svgtopng.com/');
