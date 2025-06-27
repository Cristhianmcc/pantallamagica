import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { dimensions } = await params;
  const [width, height] = dimensions.join('/').split('/').map(Number);

  // Crear un SVG placeholder
  const svg = `
    <svg width="${width || 300}" height="${height || 450}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f40612;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" opacity="0.1"/>
      <rect width="100%" height="100%" fill="#1a1a2e"/>
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" fill="#e50914" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
        🎬
      </text>
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="16">
        CineStream
      </text>
      <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" fill="#999999" font-family="Arial, sans-serif" font-size="12">
        ${width || 300}x${height || 450}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}
