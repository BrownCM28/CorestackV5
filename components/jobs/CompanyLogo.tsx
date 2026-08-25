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

  'Amazon.com': { src: '/Company Logos/corestack_company_logos/amazon.png' },
  'ATS Companies': { src: '/Company Logos/corestack_company_logos/ats-companies.png' },
  'Blueprint Technologies': { src: '/Company Logos/corestack_company_logos/blueprint-technologies.png' },
  'Chinook Systems': { src: '/Company Logos/corestack_company_logos/chinook-systems.png' },
  'Controlled Contamination Services': { src: '/Company Logos/corestack_company_logos/controlled-contamination-services.png' },
  'Controlled Contamination Services LLC': { src: '/Company Logos/corestack_company_logos/controlled-contamination-services.png' },
  'CoreWeave': { src: '/Company Logos/corestack_company_logos/coreweave.png' },
  'Cumming Group': { src: '/Company Logos/corestack_company_logos/cumming-group.png' },
  'Cumming Group UK & Europe': { src: '/Company Logos/corestack_company_logos/cumming-group.png' },
  'CUPERTINO ELECTRIC': { src: '/Company Logos/corestack_company_logos/cupertino-electric.png' },
  'FST Technical Services': { src: '/Company Logos/corestack_company_logos/fst-technical-services.png' },
  'KALCON': { src: '/Company Logos/corestack_company_logos/kalcon.png' },
  'Kimmel & Associates': { src: '/Company Logos/corestack_company_logos/kimmel-associates.png' },
  // Legacy long-form name -- the short "NTT Global Data Centers" above
  // already has its own logo, this is a separate name variant in the jobs
  // table that didn't match it.
  'NTT Global Data Centers Americas, Inc.': { src: '/Company Logos/corestack_company_logos/ntt-global-data-centers.png' },
  'Quest Global': { src: '/Company Logos/corestack_company_logos/quest-global.png' },
  'Ramboll': { src: '/Company Logos/corestack_company_logos/ramboll.png' },
  'Rippling': { src: '/Company Logos/corestack_company_logos/rippling.png' },
  'Salute Mission Inc.': { src: '/Company Logos/corestack_company_logos/salute.png' },
  'Veolia': { src: '/Company Logos/corestack_company_logos/veolia.png' },
  'Veolia Environnement SA': { src: '/Company Logos/corestack_company_logos/veolia.png' },

  // "Amazon" (the direct employer name) is a different jobs-table value
  // from "Amazon.com" above -- both map to a logo, just different files.
  'Amazon': { src: '/Company Logos/corestack_company_logos_2/amazon.png' },
  'Apple': { src: '/Company Logos/corestack_company_logos_2/apple.png' },
  'CAI': { src: '/Company Logos/corestack_company_logos_2/cai.png' },
  'CBRE': { src: '/Company Logos/corestack_company_logos_2/cbre.png' },
  'Cerebras Systems': { src: '/Company Logos/corestack_company_logos_2/cerebras-systems.png' },
  'Colovore': { src: '/Company Logos/corestack_company_logos_2/colovore.png' },
  'Constructiv': { src: '/Company Logos/corestack_company_logos_2/constructiv.png' },
  'Crusoe': { src: '/Company Logos/corestack_company_logos_2/crusoe.png' },
  'Fluidstack': { src: '/Company Logos/corestack_company_logos_2/fluidstack.png' },
  'Hut 8': { src: '/Company Logos/corestack_company_logos_2/hut-8.png' },
  'Jacobs': { src: '/Company Logos/corestack_company_logos_2/jacobs.png' },
  'Lambda': { src: '/Company Logos/corestack_company_logos_2/lambda.png' },
  'ON.energy': { src: '/Company Logos/corestack_company_logos_2/on-energy.png' },
  'OpenAI': { src: '/Company Logos/corestack_company_logos_2/openai.png' },
  'Prime Data Centers': { src: '/Company Logos/corestack_company_logos_2/prime-data-centers.png' },
  'Siemens': { src: '/Company Logos/corestack_company_logos_2/siemens.png' },
  'Switch': { src: '/Company Logos/corestack_company_logos_2/switch.png' },
  'xAI': { src: '/Company Logos/corestack_company_logos_2/xai.png' },
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
  /** false removes the border + white background tile around a real logo
   * image, so it reads as a plain floating logo instead of a boxed swatch.
   * The fallback initials tile always keeps its colored background (the
   * text needs a surface) but drops its border too. Defaults to true. */
  boxed?: boolean
}

export default function CompanyLogo({
  company,
  size = 36,
  round = false,
  radius,
  boxed = true,
}: Props) {
  const logo = REAL_LOGOS[company]
  const borderRadius = radius ?? (round ? '50%' : 0)

  if (logo) {
    return (
      <div
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius,
          overflow: 'hidden',
        }}
        className={[
          'flex items-center justify-center',
          boxed ? 'border border-black/10 bg-white' : '',
        ].join(' ')}
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
            padding: boxed ? '4px' : 0,
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
      className={['flex items-center justify-center font-semibold', boxed ? 'border border-black/10' : ''].join(' ')}
    >
      {initials(company)}
    </div>
  )
}
