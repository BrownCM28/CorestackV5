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
  // The jobs table uses the bare company name, not the legacy long form --
  // keep both keys since older mock data may still reference the long form.
  'AWS': { src: '/Company Logos/AWSlogo.webp' },
  'Amazon Web Services (AWS)': { src: '/Company Logos/AWSlogo.webp' },

  'Google': { src: '/Company Logos/Google.webp' },
  'Oracle': { src: '/Company Logos/images (4).png' },
  'Graycor': { src: '/Company Logos/Graycor.png' },
  'Milestone Technologies, Inc.': { src: '/Company Logos/Milestone-Technologies-Logo-247x135-2.png.webp' },
  'Mortenson': { src: '/Company Logos/Mortenson.jpg' },
  'Mortenson Construction': { src: '/Company Logos/Mortenson.jpg' },
  'Holder Construction': { src: '/Company Logos/Holder-construction.jpg' },
  'Compass Datacenters': { src: '/Company Logos/compass-datacenters-logo.png' },
  'Digital Realty': { src: '/Company Logos/Digital_Realty_Black_Logo.jpg' },
  'QTS': { src: '/Company Logos/QTS-Datacenters.jpg' },
  'QTS Data Centers': { src: '/Company Logos/QTS-Datacenters.jpg' },
  'Microsoft': { src: '/Company Logos/Microsoft-logo.png' },
  'Vantage Data Centers': { src: '/Company Logos/Vantage_Logo.jpg' },
  'Stack Infrastructure': { src: '/Company Logos/images (5).jpeg' },
  'NTT Global Data Centers': { src: '/Company Logos/ntt_global_data_centers_americas_logo.jpeg' },
  'Schweitzer Engineering Laboratories': { src: '/Company Logos/Schweitzer.png' },
  'Schweitzer Engineering Laboratories, Inc.': { src: '/Company Logos/Schweitzer.png' },
  'Wesco': { src: '/Company Logos/WESCO_Logo.jpg' },
  'Russell Tobin': { src: '/Company Logos/russell_tobin__associates_llc_logo.jpeg' },
  'PGTEK': { src: '/Company Logos/PGTEK.png' },

  'Accenture Infrastructure and Capital Projects, LLC': { src: '/Company Logos/Accenture.png' },
  'Black Box': { src: '/Company Logos/Black Box.png' },
  'IES HOLDINGS': { src: '/Company Logos/IES Holdings.png' },
  'IES Commercial, Inc. – DBA IES Electrical': { src: '/Company Logos/IES Holdings.png' },
  'Pkaza - Critical Facilities Recruiting': { src: '/Company Logos/Pkaza.png' },
  'Altura': { src: '/Company Logos/altura-horz-logo-color-126@2x.webp' },
  'Hitachi Energy': { src: '/Company Logos/hitachi_logo_2025.svg' },
  'Hitachi Rail': { src: '/Company Logos/hitachi_logo_2025.svg' },
  'AbbVie': { src: '/Company Logos/AbbVie.png' },
  'Fluence': { src: '/Company Logos/Fluence.svg' },

  'Amazon.com': { src: '/Company Logos/amazon.png' },
  'ATS Companies': { src: '/Company Logos/ats-companies.png' },
  'Blueprint Technologies': { src: '/Company Logos/blueprint-technologies.png' },
  'Chinook Systems': { src: '/Company Logos/chinook-systems.png' },
  'Controlled Contamination Services': { src: '/Company Logos/controlled-contamination-services.png' },
  'Controlled Contamination Services LLC': { src: '/Company Logos/controlled-contamination-services.png' },
  'CoreWeave': { src: '/Company Logos/coreweave.png' },
  'Cumming Group': { src: '/Company Logos/cumming-group.png' },
  'Cumming Group UK & Europe': { src: '/Company Logos/cumming-group.png' },
  'CUPERTINO ELECTRIC': { src: '/Company Logos/cupertino-electric.png' },
  'FST Technical Services': { src: '/Company Logos/fst-technical-services.png' },
  'KALCON': { src: '/Company Logos/kalcon.png' },
  'Kimmel & Associates': { src: '/Company Logos/kimmel-associates.png' },
  // Legacy long-form name -- the short "NTT Global Data Centers" above
  // already has its own logo, this is a separate name variant in the jobs
  // table that didn't match it.
  'NTT Global Data Centers Americas, Inc.': { src: '/Company Logos/ntt-global-data-centers.png' },
  'Quest Global': { src: '/Company Logos/quest-global.png' },
  'Ramboll': { src: '/Company Logos/ramboll.png' },
  'Rippling': { src: '/Company Logos/rippling.png' },
  'Salute Mission Inc.': { src: '/Company Logos/salute.png' },
  'Veolia': { src: '/Company Logos/veolia.png' },
  'Veolia Environnement SA': { src: '/Company Logos/veolia.png' },
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

export function hasRealLogo(company: string): boolean {
  return company in REAL_LOGOS
}

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
