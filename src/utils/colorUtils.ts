/**
 * Utility functions for color calculations, WCAG contrast audits, and palette generation.
 */

// Convert hex to rgb
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  if (cleanHex.length === 8) {
    // Has alpha channel, discard or take first 6
    cleanHex = cleanHex.substring(0, 6);
  }
  if (cleanHex.length !== 6) return null;

  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return null;

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Convert rgb to hex
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Calculate relative luminance based on WCAG 2.1
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate contrast ratio between two hex colors
export function getContrastRatio(foreground: string, background: string): number {
  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// WCAG rating
export function getWcagRating(ratio: number): {
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  scoreText: string;
  badgeClass: string;
} {
  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  const aaaNormal = ratio >= 7.0;

  let scoreText = 'Fail';
  let badgeClass = 'text-rose-400 bg-rose-950/40 border-rose-800/40';

  if (aaaNormal) {
    scoreText = 'AAA Pass';
    badgeClass = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
  } else if (aaNormal) {
    scoreText = 'AA Pass';
    badgeClass = 'text-teal-300 bg-teal-950/40 border-teal-800/40';
  } else if (aaLarge) {
    scoreText = 'AA Large Only';
    badgeClass = 'text-amber-400 bg-amber-950/40 border-amber-800/40';
  }

  return { aaNormal, aaLarge, aaaNormal, scoreText, badgeClass };
}

// Adjust brightness of a hex color
export function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const factor = 1 + percent / 100;
  return rgbToHex(rgb.r * factor, rgb.g * factor, rgb.b * factor);
}

// Check if dark or light
export function isDarkColor(hex: string): boolean {
  return getLuminance(hex) < 0.2;
}
