import Image from 'next/image'

type LogoConfig = {
  src: string
  // scale > 1 zooms in (crops) within the fixed container — use for logos
  // with excessive whitespace in the source file
  scale?: number
}

const REAL_LOGOS: Record<string, LogoConfig> = {
  'Equinix':            { src: '/Company Logos/Equinix.png' },
  'Iron Mountain':      { src: '/Company Logos/IronMountain.png' },
  'CyrusOne':           { src: '/Company Logos/cyrus-one.png' },
  'Meta':               { src: '/Company Logos/Metalogo.png', scale: 1.9 },
  'Schneider Electric': { src: '/Company Logos/SchneiderElectriclogo.webp' },
  'Turner Construction':{ src: '/Company Logos/Turner Logo.webp' },
  'Amazon Web Services':{ src: '/Company Logos/AWSlogo.webp' },
}

const PALETTES = [
  { bg: '#f0fdf4', text: '#166534' },
  { bg: '#eff6ff', text: '#1e40af' },
  { bg: '#fef3c7', text: '#92400e' },
  { bg: '#fdf4ff', text: '#7e22ce' },
  { bg: '#fff1f2', text: '#be123c' },
  { bg: '#f0f9ff', text: '#0369a1' },
  { bg: '#fefce8', text: '#854d0e' },
  { bg: '#f5f5f4', text: '#292524' },
  { bg: '#ecfdf5', text: '#065f46' },
  { bg: '#eef2ff', text: '#3730a3' },
]

function palette(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return PALETTES[Math.abs(h) % PALETTES.length]
}

function initials(name: string) {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

interface Props {
  company: string
  size?: number
  /** Pass true to render a circle (50% borderRadius) */
  round?: boolean
  /** Explicit border-radius override — takes precedence over round */
  radius?: string
}

export default function CompanyLogo({ company, size = 36, round = false, radius }: Props) {
  const logo = REAL_LOGOS[company]
  const borderRadius = radius ?? (round ? '50%' : 0)

  if (logo) {
    return (
      <div
        style={{ width: size, height: size, flexShrink: 0, borderRadius, overflow: 'hidden' }}
        className="border border-black/10 bg-white flex items-center justify-center"
      >
        <Image
          src={logo.src}
          alt={`${company} logo`}
          width={size}
          height={size}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '4px',
            transform: logo.scale ? `scale(${logo.scale})` : undefined,
          }}
        />
      </div>
    )
  }

  const { bg, text } = palette(company)
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        color: text,
        fontSize: Math.round(size * 0.38),
        flexShrink: 0,
        borderRadius,
      }}
      className="flex items-center justify-center font-semibold border border-black/10"
    >
      {initials(company)}
    </div>
  )
}
