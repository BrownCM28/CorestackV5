import type { Resource } from './types'

export const MOCK_RESOURCES: Resource[] = [
  // ── Training Programs ───────────────────────────────────────────────────────
  {
    id: 'mr-prog-1',
    name: "America's Workforce Academy",
    type: 'program',
    provider: 'Meta',
    url: 'https://www.meta.com/actions/americas-workforce-academy/',
    description:
      "Meta's $115M nationwide skilled-trades training initiative, offering two free 4-week tracks — Construction-Ready Training (with Associated Builders and Contractors) and Fiber Technician Training (with CBRE). No experience required, with a guaranteed job at a Meta construction site upon completion.",
  },
  {
    id: 'mr-prog-2',
    name: 'Schneider Electric University',
    type: 'program',
    provider: 'Schneider Electric',
    url: 'https://www.se.com/us/en/about-us/university/',
    description:
      "Schneider Electric's free online education platform covering data center power, cooling, and efficiency fundamentals, feeding into industry certifications like DCCA (Data Center Certified Associate) and PEM (Professional Energy Manager).",
  },
  {
    id: 'mr-prog-3',
    name: 'Vertiv Academy — Data Center Training',
    type: 'program',
    provider: 'Vertiv',
    url: 'https://www.vertiv.com/en-us/services-catalog/services/training/',
    description:
      "Vertiv's training and services hub covering critical power and thermal management. Full course scheduling and registration is handled through the Vertiv Connect Learning partner portal, which requires a login.",
  },
  {
    id: 'mr-prog-4',
    name: 'Google IT Support Professional Certificate',
    type: 'program',
    provider: 'Google / Coursera',
    url: 'https://www.coursera.org/professional-certificates/google-it-support',
    description:
      'Six-course online certificate covering technical support, networking, operating systems, system administration, and IT security. Strong foundation for data center operations roles; designed to reach job readiness in 3-6 months. Financial aid available.',
  },
  {
    id: 'mr-prog-5',
    name: 'AWS Work-Based Learning Program',
    type: 'program',
    provider: 'Amazon Web Services',
    url: 'https://amazon.jobs/content/en/teams/amazon-web-services/data-centers/work-based-learning-program',
    description:
      'A 12-month paid AWS training program combining self-directed instruction, instructor-led sessions, and on-the-job training across four data center career tracks — operations tech, install tech, decommissioning tech, and logistics specialist — leading to a permanent AWS data center role.',
  },
  {
    id: 'mr-prog-6',
    name: 'Equinix Career Transition Program',
    type: 'program',
    provider: 'Equinix',
    url: 'https://careers.equinix.com/equinix-career-transition-program',
    description:
      'A program bringing talent from adjacent industries — manufacturing, telecom, oil & gas, military — into data center technician and engineer roles with full training provided. Includes SkillBridge listings for transitioning veterans.',
  },

  // ── Certifications ──────────────────────────────────────────────────────────
  {
    id: 'mr-cert-1',
    name: 'Data Center Design Consultant (DCDC)',
    type: 'cert',
    provider: 'BICSI',
    url: 'https://www.bicsi.org/education-certification/certification/dcdc',
    description:
      'Premier data center design credential covering site selection, physical infrastructure, power and cooling systems, cabling, and sustainability. Requires 3 years of design experience. Exam is 3 hours, 100 questions. Recognized by hyperscalers as preferred qualification for design engineers.',
  },
  {
    id: 'mr-cert-2',
    name: 'Registered Communications Distribution Designer (RCDD)',
    type: 'cert',
    provider: 'BICSI',
    url: 'https://www.bicsi.org/education-certification/certification/rcdd',
    description:
      'Industry-standard credential for structured cabling and communications infrastructure design. Essential for low-voltage cabling leads in data centers. Requires passing the BICSI Installer 2 exam series plus 2 years of supervised experience. Widely required for colocation cabling contracts.',
  },
  {
    id: 'mr-cert-3',
    name: 'CompTIA Server+',
    type: 'cert',
    provider: 'CompTIA',
    url: 'https://www.comptia.org/certifications/server',
    description:
      'Vendor-neutral certification covering server hardware installation, configuration, storage, security, and disaster recovery. Recommended first certification for data center technicians. Exam SK0-005; approximately 90 questions, 90 minutes. Valid 3 years with continuing education.',
  },
  {
    id: 'mr-cert-4',
    name: 'Certified Data Centre Professional (CDCP)',
    type: 'cert',
    provider: 'EXIN',
    url: 'https://www.exin.com/technologies-software/exin-epi-data-centre-management/certified-data-centre-professional/',
    description:
      'Foundation-level, EXIN-accredited certification (2-day course, 40-question exam, 68% pass mark) covering data center facilities, operations, and management basics. Entry point to the EXIN/EPI data center certification path; valid 3 years.',
  },
  {
    id: 'mr-cert-5',
    name: 'Certified Data Centre Specialist (CDCS)',
    type: 'cert',
    provider: 'EXIN',
    url: 'https://www.exin.com/technologies-software/exin-epi-data-centre-management/certified-data-centre-specialist/',
    description:
      'Advanced-level EXIN certification (3-day course, 60-question exam, 75% pass mark) building on CDCP, focused on data center design and build engineering calculations. Requires a valid CDCP as prerequisite.',
  },
  {
    id: 'mr-cert-6',
    name: 'CompTIA Network+',
    type: 'cert',
    provider: 'CompTIA',
    url: 'https://www.comptia.org/certifications/network',
    description:
      'Core networking certification covering TCP/IP, switching, routing, wireless, security, and troubleshooting. Strongly recommended for NOC engineers, low-voltage technicians, and anyone in a data center networking role. Prerequisite for many advanced networking credentials.',
  },
  {
    id: 'mr-cert-7',
    name: 'EPA Section 608 Technician Certification',
    type: 'cert',
    provider: 'U.S. Environmental Protection Agency',
    url: 'https://www.epa.gov/section608/section-608-technician-certification',
    description:
      'Federally mandated certification (Clean Air Act, 40 CFR Part 82 Subpart F) required for technicians servicing refrigerant-containing HVAC equipment — directly relevant to data center cooling and facilities roles. Credential does not expire.',
  },
  {
    id: 'mr-cert-8',
    name: 'NETA Certified Electrical Testing Technician',
    type: 'cert',
    provider: 'InterNational Electrical Testing Association (NETA)',
    url: 'https://www.netaworld.org/accreditation/technician-certification',
    description:
      "NETA's official 4-level technician certification framework (Level 1 Trainee through Level 4 Certified Senior Technician), administered via proctored exams. Candidates must be employed by a NETA Accredited Company — a strong fit for critical-power and electrical infrastructure roles.",
  },
  {
    id: 'mr-cert-9',
    name: 'Data Center Energy Practitioner (DCEP)',
    type: 'cert',
    provider: 'U.S. Department of Energy',
    url: 'https://datacenters.lbl.gov/dcep',
    description:
      'DOE/FEMP-developed certification qualifying practitioners to conduct data center energy assessments, offered at Generalist and three Specialist levels (HVAC, IT, Electrical) through approved training organizations.',
  },

  // ── Schools ─────────────────────────────────────────────────────────────────
  {
    id: 'mr-school-1',
    name: 'Data Center Operations',
    type: 'school',
    provider: 'Northern Virginia Community College',
    url: 'https://www.nvcc.edu/academics/programs/data-center-operations.html',
    description:
      "The first and only fully accredited two-year program of its kind in Virginia, offered at the Loudoun campus, preparing students for BICSI Installer 1/2 credentials and OSHA 10 with an industry pipeline into local Microsoft and Equinix data centers.",
  },
  {
    id: 'mr-school-2',
    name: 'Data Center Networking (NET-135)',
    type: 'school',
    provider: 'Wake Technical Community College',
    url: 'https://www.waketech.edu/course/net-135',
    description:
      "A data center networking course within Wake Tech's broader Network & Cloud Administration program in Research Triangle Park, NC — the older standalone data center certificate has been folded into this program. Covers data center network design, implementation, and troubleshooting.",
  },
  {
    id: 'mr-school-3',
    name: 'IT – Microsoft Data Center Certificate',
    type: 'school',
    provider: 'Gateway Technical College',
    url: 'https://www.gtc.edu/programs/certificates/it-microsoft-data-center-certificate',
    description:
      "Wisconsin's only Microsoft-partnered Data Center Academy — a 4-course, 2-semester certificate covering CompTIA Tech+, A+, and Server+, feeding directly into Microsoft's Mount Pleasant, WI data center.",
  },
  {
    id: 'mr-school-4',
    name: 'Data Center Technician Certificate',
    type: 'school',
    provider: 'Columbus State Community College',
    url: 'https://www.cscc.edu/academics/departments/computer-it/data-center-technician.shtml',
    description:
      'Trains students to maintain cloud-computing server hardware infrastructure and troubleshoot common issues. Backed by an AWS scholarship (up to $3,000 lifetime) for students pursuing the certificate, reflecting Central Ohio\'s 50+ data center employer base.',
  },
]
