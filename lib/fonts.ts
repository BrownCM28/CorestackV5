import localFont from 'next/font/local'

// Homepage-only display font. Variable weight range is 300-700 (no
// 800/900 static weight ships with this family) -- font-black headings
// render at the font's max available weight (700) instead, which is
// still the boldest cut of this typeface.
export const tabular = localFont({
  src: '../components/new_font/Tabular_Complete/Fonts/WEB/fonts/Tabular-Variable.woff2',
  variable: '--font-tabular',
  weight: '300 700',
  style: 'normal',
  display: 'swap',
})
