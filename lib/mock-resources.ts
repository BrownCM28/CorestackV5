import type { Resource } from './types'

export const MOCK_RESOURCES: Resource[] = [
  // ── Training Programs ───────────────────────────────────────────────────────
  {
    id: 'mr-prog-1',
    name: 'Data Center Technician Training Program',
    type: 'program',
    provider: 'Meta',
    url: 'https://metacareers.com/life/data-center-technician-training',
    description:
      'Free 16-week hands-on program covering server hardware, structured cabling, power distribution, and cooling systems. Graduates receive a direct pathway to full-time roles at Meta data centers. No experience required; program provides a $2,500 stipend.',
  },
  {
    id: 'mr-prog-2',
    name: 'Critical Facilities Technician Training',
    type: 'program',
    provider: 'Schneider Electric',
    url: 'https://www.se.com/us/en/work/training/',
    description:
      'Instructor-led and online curriculum covering UPS systems, power distribution units, precision cooling, and DCIM fundamentals. Courses aligned with Schneider Equipment certifications and recommended for technicians supporting APC and Galaxy product lines.',
  },
  {
    id: 'mr-prog-3',
    name: 'Vertiv Academy — Data Center Operations',
    type: 'program',
    provider: 'Vertiv',
    url: 'https://www.vertiv.com/en-us/support/training/',
    description:
      '8-week blended learning program for critical power and thermal management. Covers Liebert UPS, CRAC units, PDUs, and remote monitoring. Certificate issued upon completion; recognized by major colocation operators as qualification for entry-level ops roles.',
  },
  {
    id: 'mr-prog-4',
    name: 'Google IT Support Professional Certificate',
    type: 'program',
    provider: 'Google / Coursera',
    url: 'https://grow.google/certificates/it-support/',
    description:
      'Five-course online certificate covering IT fundamentals, networking, operating systems, system administration, and security. Strong foundation for data center operations roles. Self-paced; typical completion 6 months at 10 hrs/week. Financial aid available.',
  },
  {
    id: 'mr-prog-5',
    name: 'AWS Data Center Operations Training',
    type: 'program',
    provider: 'Amazon Web Services',
    url: 'https://aws.amazon.com/training/data-center-operations/',
    description:
      'Role-based training track for physical infrastructure roles at AWS. Covers server lifecycle management, fiber optic cabling, physical security, and compliance procedures. Required for all AWS Data Center Technician candidates; available as internal or partner-track program.',
  },
  {
    id: 'mr-prog-6',
    name: 'Mission Critical Operations Bootcamp',
    type: 'program',
    provider: 'Equinix',
    url: 'https://careers.equinix.com/students',
    description:
      '12-week apprenticeship program for entry-level candidates with no data center experience. Covers physical infrastructure, safety protocols, incident response, and customer escalation handling. Program runs twice yearly at Ashburn, Dallas, and Chicago campuses.',
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
    name: 'Certified Data Center Professional (CDCP)',
    type: 'cert',
    provider: 'EPI / Exin',
    url: 'https://www.exin.com/certifications/exin-data-centre-professional/',
    description:
      'Foundation-level certification covering data center facilities, power, cooling, cabling, and operations management. 2-day instructor-led course with closed-book exam. Entry point to the EPI Data Center certification path; recognized across colocation, enterprise, and hyperscale sectors.',
  },
  {
    id: 'mr-cert-5',
    name: 'Certified Data Center Specialist (CDCS)',
    type: 'cert',
    provider: 'EPI / Exin',
    url: 'https://www.exin.com/certifications/exin-data-centre-specialist/',
    description:
      'Intermediate credential building on the CDCP, covering advanced topics in redundancy design, capacity planning, energy efficiency, and change management in mission-critical environments. Requires CDCP prerequisite. Exam is 40 questions in 60 minutes.',
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

  // ── Schools ─────────────────────────────────────────────────────────────────
  {
    id: 'mr-school-1',
    name: 'Data Center Technology — AAS Degree',
    type: 'school',
    provider: 'Northern Virginia Community College',
    url: 'https://www.nvcc.edu/academics/programs/data-center-technology/',
    description:
      'Two-year associate degree program in Annandale, VA, covering data center operations, infrastructure management, and cloud services. Adjacent to Loudoun County — the world\'s largest data center market. Strong placement partnerships with Equinix, Iron Mountain, and QTS.',
  },
  {
    id: 'mr-school-2',
    name: 'Data Center Technology Certificate',
    type: 'school',
    provider: 'Wake Technical Community College',
    url: 'https://www.waketech.edu/programs/data-center-technology',
    description:
      'One-year technical certificate in Research Triangle, NC, covering server hardware, virtualization, networking, and facilities management. Located minutes from multiple RTP hyperscale campuses. Hands-on lab access and industry advisory board from Apple, Google, and Lenovo.',
  },
  {
    id: 'mr-school-3',
    name: 'Data Center Operations Certificate',
    type: 'school',
    provider: 'Pellissippi State Community College',
    url: 'https://www.pstcc.edu/programs/data-center/',
    description:
      'Workforce certificate focused on data center operations, physical infrastructure, and cooling management. Located in Knoxville, TN, near Oak Ridge National Laboratory data facilities. Offers evening and weekend classes designed for workers transitioning from skilled trades.',
  },
  {
    id: 'mr-school-4',
    name: 'IT Network Specialist — Data Center Track',
    type: 'school',
    provider: 'Gateway Technical College',
    url: 'https://www.gtc.edu/programs/it-network-specialist/',
    description:
      'One-year diploma program with an elective data center track covering structured cabling, physical networking, and server management. Located in Kenosha, WI; strong ties to Milwaukee-area data center operators. CompTIA Network+ exam prep included.',
  },
  {
    id: 'mr-school-5',
    name: 'Data Center Technology AAS',
    type: 'school',
    provider: 'Cuyahoga Community College',
    url: 'https://www.tri-c.edu/programs/data-center-technology/',
    description:
      'Two-year program in Cleveland, OH, with coursework in server administration, cloud infrastructure, physical security, and power systems. Partners with Microsoft and Amazon for curriculum alignment and internship placements at regional data center campuses.',
  },
]
