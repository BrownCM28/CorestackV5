export interface PathwayStep {
  role: string
  timeframe: string
  salary: string
  color: string
  skills: string[]
}

export const PATHWAY_STEPS: PathwayStep[] = [
  {
    role: 'Data Center Technician',
    timeframe: '0 – 2 yrs',
    salary: '$50K – $70K',
    color: '#3ecf8e',
    skills: ['CompTIA Server+', 'CompTIA Network+', 'CDCP'],
  },
  {
    role: 'Operations Specialist',
    timeframe: '2 – 5 yrs',
    salary: '$70K – $90K',
    color: '#3b82f6',
    skills: ['CDCS', 'BICSI Installer 2'],
  },
  {
    role: 'Shift Lead / Senior Tech',
    timeframe: '4 – 7 yrs',
    salary: '$85K – $110K',
    color: '#8b5cf6',
    skills: ['Vendor certs (Schneider, Vertiv)', 'OSHA 30'],
  },
  {
    role: 'Critical Facilities Manager',
    timeframe: '7 – 12 yrs',
    salary: '$110K – $145K',
    color: '#f97316',
    skills: ['BICSI DCDC', 'PE License (preferred)'],
  },
  {
    role: 'Campus Director / VP Ops',
    timeframe: '12+ yrs',
    salary: '$145K – $200K+',
    color: '#ec4899',
    skills: ['PMP', 'MBA or equivalent'],
  },
]
