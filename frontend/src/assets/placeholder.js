// Inline SVG fallback shown when a product image can't be loaded.
// Works offline and under strict CSPs (no external request).
export const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#00457c"/>
      <stop offset="1" stop-color="#00bcd4"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <text x="200" y="215" font-size="96" text-anchor="middle">🐠</text>
  <text x="200" y="300" font-size="20" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" opacity="0.85">Photo coming soon</text>
</svg>
`);
