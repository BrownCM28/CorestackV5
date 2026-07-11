-- =============================================================================
-- Corestack Seed Data
-- 30 jobs (6 per category), 12 news items, 9 resources
-- =============================================================================

-- -------------------------------------------------------------------------
-- JOBS
-- -------------------------------------------------------------------------

-- CATEGORY: operations (6)
INSERT INTO jobs (title, company, location, category, remote, description, salary_min, salary_max, apply_target, posted_by, status, paid_amount_cents)
VALUES
  (
    'Data Center Technician I',
    'Equinix',
    'Ashburn, VA',
    'operations',
    false,
    'Perform routine hardware installations, replacements, and decommissions across a hyperscale colocation campus. Monitor data hall environmental conditions, respond to critical alerts, and follow strict DCIM change-management procedures. Candidates must have hands-on experience with server racking, cable management, and basic network patching in a 24/7 mission-critical environment.',
    55000, 75000,
    'https://careers.equinix.com',
    NULL, 'active', 9900
  ),
  (
    'Critical Environment Specialist',
    'CyrusOne',
    'Dallas, TX',
    'operations',
    false,
    'Maintain and operate all critical infrastructure systems including UPS, generators, PDUs, and CRAC units within a Tier III+ data center campus. Conduct preventive maintenance rounds, coordinate with third-party vendors, and document all activities in the facility management system. Requires a minimum of two years of data center operations experience and strong troubleshooting skills.',
    65000, 85000,
    'https://careers.cyrusone.com',
    NULL, 'active', 9900
  ),
  (
    'Data Center Operations Manager',
    'Iron Mountain',
    'Atlanta, GA',
    'operations',
    false,
    'Lead a team of 10–15 technicians responsible for 24/7 operations of a 40MW colocation facility in the Atlanta metro area. Drive continuous improvement in uptime, safety compliance, and customer satisfaction while managing shift schedules, training programs, and vendor relationships. Ideal candidates will have 5+ years of progressive data center leadership experience and familiarity with ITIL change-control frameworks.',
    95000, 120000,
    'https://careers.ironmountain.com',
    NULL, 'active', 9900
  ),
  (
    'Site Operations Lead',
    'QTS',
    'Richmond, VA',
    'operations',
    false,
    'Oversee day-to-day operations of a QTS hyperscale campus, serving as the primary escalation point for all critical infrastructure events. Develop and enforce standard operating procedures, coordinate planned maintenance windows with customers, and maintain compliance with SSAE 18 / SOC 2 requirements. Five or more years of data center ops experience and a strong working knowledge of BMS platforms are required.',
    80000, 100000,
    'https://www.qtsdatacenters.com/company/careers',
    NULL, 'active', 9900
  ),
  (
    'Remote Hands Technician',
    'Flexential',
    'Phoenix, AZ',
    'operations',
    false,
    'Provide on-site remote-hands support for colocation customers including hardware swaps, cable runs, smart-hands tasks, and escorted access coordination. Respond to customer ticketing system requests within defined SLAs and accurately document all work performed. Entry-level candidates with A+ or CompTIA Server+ certification and a customer-service mindset are encouraged to apply.',
    50000, 65000,
    'https://www.flexential.com/about/careers',
    NULL, 'active', 9900
  ),
  (
    'Infrastructure Operations Engineer',
    'Equinix',
    'Columbus, OH',
    'operations',
    false,
    'Support the operational readiness and reliability of Equinix''s Columbus campus by executing planned maintenance activities and responding to infrastructure incidents. Collaborate with engineering and construction teams on capacity expansion projects and document lessons learned to improve runbooks. Candidates should have a background in electrical or mechanical systems and at least three years of data center operations experience.',
    70000, 90000,
    'https://careers.equinix.com',
    NULL, 'active', 9900
  ),

-- CATEGORY: construction (6)
  (
    'Data Center Construction Manager',
    'Turner Construction',
    'Ashburn, VA',
    'construction',
    false,
    'Lead all phases of a 100MW+ ground-up data center construction project in Loudoun County, from pre-construction planning through commissioning and owner handover. Manage a team of superintendents, subcontractors, and engineers while maintaining schedule, budget, and quality targets for a mission-critical delivery. Requires 10+ years of construction management experience with at least three completed data center or mission-critical projects.',
    110000, 140000,
    'https://www.turnerconstruction.com/careers',
    NULL, 'active', 9900
  ),
  (
    'Project Manager, Mission Critical',
    'PCL Construction',
    'Dallas, TX',
    'construction',
    false,
    'Manage construction of large-scale hyperscale data center campus projects in the Dallas-Fort Worth market, coordinating with owners, architects, and MEP trade partners. Responsible for developing project schedules, tracking costs, running OAC meetings, and ensuring safety compliance across all work fronts. A minimum of seven years of project management experience in commercial or industrial construction is required; data center experience strongly preferred.',
    100000, 130000,
    'https://www.pclconstruction.com/careers',
    NULL, 'active', 9900
  ),
  (
    'Site Superintendent, Data Center',
    'Turner Construction',
    'Phoenix, AZ',
    'construction',
    false,
    'Direct daily field operations for a multi-phase data center campus build in the Phoenix metro, supervising subcontractor crews and ensuring work is executed per design drawings and specifications. Enforce safety protocols, manage material deliveries and logistics, and coordinate with the commissioning team during systems turn-over. Candidates must have 8+ years of field supervision experience on large commercial or industrial projects.',
    90000, 115000,
    'https://www.turnerconstruction.com/careers',
    NULL, 'active', 9900
  ),
  (
    'MEP Coordinator',
    'PCL Construction',
    'Columbus, OH',
    'construction',
    false,
    'Coordinate mechanical, electrical, and plumbing trades on a hyperscale data center project using BIM/VDC tools to resolve conflicts and sequence installations. Work closely with the project superintendent and trade foremen to maintain schedule and quality on all MEP systems including switchgear, UPS, chillers, and cooling towers. Experience with Navisworks or similar clash-detection software and at least five years of MEP coordination experience are required.',
    75000, 95000,
    'https://www.pclconstruction.com/careers',
    NULL, 'active', 9900
  ),
  (
    'Construction Engineer, Critical Facilities',
    'Holder Construction',
    'Atlanta, GA',
    'construction',
    false,
    'Support project management and field operations on mission-critical construction projects, including document control, RFI/submittal management, and schedule tracking. Assist superintendents with daily reporting, safety inspections, and subcontractor coordination across electrical and mechanical scopes. Recent graduates with a degree in civil, mechanical, or construction management engineering and an internship in commercial construction are encouraged to apply.',
    85000, 110000,
    'https://www.holderconstruction.com/careers',
    NULL, 'active', 9900
  ),
  (
    'Senior Project Engineer',
    'DPR Construction',
    'Hillsboro, OR',
    'construction',
    false,
    'Manage engineering and documentation functions on a hyperscale data center project in the Portland/Hillsboro corridor, supporting the project manager with cost control, schedule analysis, and owner reporting. Review subcontractor shop drawings and submittals for compliance with design intent and mission-critical specifications. Five to eight years of project engineering experience on large-scale commercial or mission-critical construction projects required.',
    95000, 125000,
    'https://www.dpr.com/careers',
    NULL, 'active', 9900
  ),

-- CATEGORY: electrical_power (6)
  (
    'Electrical Engineer — Data Center',
    'Rosendin Electric',
    'Ashburn, VA',
    'electrical_power',
    false,
    'Design and oversee installation of medium-voltage switchgear, 480V power distribution, UPS systems, and generator plant for large-scale colocation and hyperscale data centers in the Northern Virginia market. Collaborate with the design-build team on value-engineering opportunities and serve as the technical lead during commissioning and start-up activities. A PE license and 6+ years of electrical engineering experience in mission-critical projects are strongly preferred.',
    90000, 115000,
    'https://www.rosendin.com/careers',
    NULL, 'active', 9900
  ),
  (
    'UPS Systems Technician',
    'Vertiv',
    'Dallas, TX',
    'electrical_power',
    false,
    'Install, commission, and perform preventive and corrective maintenance on Vertiv Liebert UPS systems at customer data center sites across the Dallas metro area. Diagnose battery, static switch, and inverter faults and maintain accurate service records in the field service management system. Candidates should hold a BICSI RCDD or similar credential and have at least three years of hands-on UPS maintenance experience.',
    70000, 90000,
    'https://www.vertiv.com/en-us/about/careers',
    NULL, 'active', 9900
  ),
  (
    'Power Distribution Engineer',
    'Schneider Electric',
    'Remote',
    'electrical_power',
    true,
    'Develop power distribution architecture and equipment specifications for hyperscale data center clients, including busway, PDUs, RPPs, and metering systems. Produce single-line diagrams, load calculations, and equipment schedules in coordination with MEP engineering firms and owner technical teams. This is a fully remote role requiring 5+ years of experience in data center power systems design and proficiency with AutoCAD or Revit.',
    95000, 125000,
    'https://www.se.com/us/en/about-us/careers',
    NULL, 'active', 9900
  ),
  (
    'Critical Power Specialist',
    'ABB',
    'Phoenix, AZ',
    'electrical_power',
    false,
    'Provide pre-sales and post-sales technical support for ABB''s critical power product portfolio at data center customer sites in the Southwest region, including APC symmetra systems, PDUs, and power management software. Conduct site surveys, develop technical proposals, and support commissioning engineers during system start-up. Candidates must have strong knowledge of three-phase power systems and at least four years of critical power field experience.',
    85000, 110000,
    'https://careers.abb.com',
    NULL, 'active', 9900
  ),
  (
    'Generator Systems Engineer',
    'Faith Technologies',
    'Chicago, IL',
    'electrical_power',
    false,
    'Engineer and oversee installation of standby generator systems for mission-critical data center projects in the Midwest, including fuel systems, automatic transfer switches, exhaust, and sound attenuation. Coordinate with local utilities, AHJs, and commissioning agents to ensure code compliance and successful integrated systems testing. A bachelor''s degree in electrical engineering and 5+ years of generator or emergency power experience are required.',
    80000, 105000,
    'https://www.faithtechinc.com/careers',
    NULL, 'active', 9900
  ),
  (
    'Electrical Project Manager',
    'Rosendin Electric',
    'San Jose, CA',
    'electrical_power',
    false,
    'Lead the electrical scope on large hyperscale data center projects in the Silicon Valley market, managing subcontractor crews, material procurement, and financial performance from mobilization through project closeout. Interface daily with the general contractor, owner''s representative, and commissioning agent to maintain schedule and resolve technical issues. Requires 8+ years of electrical project management experience with a proven track record on projects exceeding $20M in electrical contract value.',
    100000, 135000,
    'https://www.rosendin.com/careers',
    NULL, 'active', 9900
  ),

-- CATEGORY: cooling_mechanical (6)
  (
    'CRAC/CRAH Technician',
    'Vertiv',
    'Ashburn, VA',
    'cooling_mechanical',
    false,
    'Perform installations, preventive maintenance, and emergency repairs on Vertiv Liebert computer room air conditioning and air handling units at colocation data centers in Northern Virginia. Maintain refrigerant logs, calibrate sensors and controls, and coordinate planned maintenance windows with facility operations teams. EPA 608 certification and a minimum of three years of HVAC/R service experience in a data center environment are required.',
    65000, 85000,
    'https://www.vertiv.com/en-us/about/careers',
    NULL, 'active', 9900
  ),
  (
    'Mechanical Engineer, Cooling Systems',
    'Schneider Electric',
    'Dallas, TX',
    'cooling_mechanical',
    false,
    'Design chilled water, direct expansion, and evaporative cooling systems for hyperscale and colocation data centers, producing mechanical drawings, equipment specifications, and energy models. Collaborate with electrical and controls engineers to deliver integrated cooling solutions that meet PUE targets and owner sustainability requirements. A PE license and 6+ years of mechanical engineering experience with a focus on data center cooling are preferred.',
    90000, 120000,
    'https://www.se.com/us/en/about-us/careers',
    NULL, 'active', 9900
  ),
  (
    'HVAC Controls Engineer',
    'Johnson Controls',
    'Atlanta, GA',
    'cooling_mechanical',
    false,
    'Program, commission, and troubleshoot building automation and HVAC controls systems for data center clients in the Southeast, including Metasys and third-party BMS platforms. Develop points lists, sequences of operations, and graphics packages, and provide on-site commissioning support during final integrated testing. Candidates with 4+ years of BMS programming experience and familiarity with data center cooling architectures will be prioritized.',
    85000, 110000,
    'https://www.johnsoncontrols.com/careers',
    NULL, 'active', 9900
  ),
  (
    'Cooling Systems Specialist',
    'Google',
    'Remote',
    'cooling_mechanical',
    true,
    'Support Google''s global data center fleet by developing and refining cooling system operating procedures, analyzing thermal performance data, and leading projects to improve water usage effectiveness across multiple campuses. Partner with onsite operations teams and external vendors to diagnose anomalies, drive improvements, and evaluate new cooling technologies for potential deployment at scale. This remote role requires 7+ years of experience in data center mechanical systems and a strong background in thermodynamics and fluid systems.',
    110000, 145000,
    'https://careers.google.com',
    NULL, 'active', 9900
  ),
  (
    'Thermal Management Engineer',
    'Meta',
    'Hillsboro, OR',
    'cooling_mechanical',
    false,
    'Drive the design and optimization of next-generation thermal management solutions for Meta''s high-density AI compute infrastructure at the Hillsboro campus, including liquid cooling and rear-door heat exchanger deployments. Conduct computational fluid dynamics analysis and collaborate with hardware and facilities teams to validate thermal performance of new server generations. A master''s degree in mechanical or thermal engineering and 5+ years of data center thermal management experience are required.',
    115000, 150000,
    'https://www.metacareers.com',
    NULL, 'active', 9900
  ),
  (
    'Chilled Water Systems Technician',
    'CyrusOne',
    'Phoenix, AZ',
    'cooling_mechanical',
    false,
    'Operate and maintain the chilled water plant at a CyrusOne data center campus in Phoenix, including centrifugal chillers, cooling towers, variable frequency drives, and associated pumping systems. Perform routine preventive maintenance, water treatment sampling, and vibration analysis, and respond to critical alarms in accordance with established SOPs. Candidates should hold a universal refrigerant certification and have at least four years of experience with large commercial or industrial chilled water systems.',
    70000, 90000,
    'https://careers.cyrusone.com',
    NULL, 'active', 9900
  ),

-- CATEGORY: networking (6)
  (
    'Network Engineer, Data Center',
    'Zayo Group',
    'Dallas, TX',
    'networking',
    false,
    'Design, deploy, and support data center interconnect and colocation network infrastructure for Zayo customers in the Dallas market, including DWDM, dark fiber, and Ethernet services. Collaborate with NOC and field operations teams to troubleshoot circuit impairments and drive resolution within SLA windows. A CCNP or equivalent certification and 5+ years of carrier or data center networking experience are required.',
    85000, 110000,
    'https://www.zayo.com/careers',
    NULL, 'active', 9900
  ),
  (
    'Fiber Optic Technician',
    'Lumen Technologies',
    'Ashburn, VA',
    'networking',
    false,
    'Install, splice, and test single-mode and multimode fiber optic cabling within data centers and campus environments in Northern Virginia, supporting both colocation buildouts and carrier interconnect projects. Use OTDRs, power meters, and fusion splicers to ensure installations meet performance specifications and document all work in the OSP management system. FOA certification and a minimum of two years of fiber optic splicing experience are required.',
    60000, 80000,
    'https://jobs.lumen.com',
    NULL, 'active', 9900
  ),
  (
    'Network Infrastructure Engineer',
    'AWS',
    'Columbus, OH',
    'networking',
    false,
    'Build and maintain the physical and logical network infrastructure underpinning AWS availability zones in the Columbus region, including structured cabling, patch panels, top-of-rack switching, and out-of-band management networks. Develop automation scripts to improve deployment velocity and work with the network engineering team to validate capacity plans for future expansion. A bachelor''s degree in a technical field and 4+ years of large-scale data center networking experience are required.',
    100000, 135000,
    'https://www.amazon.jobs',
    NULL, 'active', 9900
  ),
  (
    'Data Center Network Architect',
    'Microsoft',
    'Remote',
    'networking',
    true,
    'Define the reference architectures and hardware standards for Microsoft''s next-generation data center network fabric, encompassing spine-leaf designs, 400G optics, and AI cluster networking requirements. Partner with software, hardware, and operations teams to develop migration strategies for existing fleet infrastructure and evaluate emerging networking technologies from key vendors. This remote role requires 10+ years of large-scale network architecture experience, with deep expertise in BGP, EVPN, and high-performance computing network topologies.',
    130000, 175000,
    'https://careers.microsoft.com',
    NULL, 'active', 9900
  ),
  (
    'Cabling Technician, Mission Critical',
    'Black Box Corporation',
    'Atlanta, GA',
    'networking',
    false,
    'Install and certify structured cabling systems — copper and fiber — inside active data centers and mission-critical facilities in the Atlanta metro, adhering to BICSI TDMM standards and customer change-management requirements. Coordinate with facility operations and general contractors to schedule work during approved maintenance windows and provide as-built documentation upon project completion. BICSI Installer 2 certification and at least three years of structured cabling experience in live data centers are required.',
    55000, 75000,
    'https://www.blackbox.com/en-us/about/careers',
    NULL, 'active', 9900
  ),
  (
    'SDN Engineer',
    'Oracle',
    'Austin, TX',
    'networking',
    false,
    'Develop and operate software-defined networking solutions for Oracle Cloud Infrastructure''s data center fabric, including network virtualization, policy automation, and observability tooling. Work within a distributed engineering team to improve reliability, reduce provisioning time, and support new OCI services from a networking perspective. Candidates should have 5+ years of experience in network engineering or software development with deep knowledge of OpenFlow, VXLAN, or comparable SDN platforms.',
    110000, 145000,
    'https://www.oracle.com/corporate/careers',
    NULL, 'active', 9900
  );

-- -------------------------------------------------------------------------
-- NEWS (12 items)
-- -------------------------------------------------------------------------

INSERT INTO news (headline, source, url, excerpt, published_at)
VALUES
  (
    'Equinix Reports Record Leasing Activity as AI Workload Demand Surges',
    'Data Center Dynamics',
    'https://www.datacenterdynamics.com/en/news/equinix-reports-record-leasing-activity-as-ai-workload-demand-surges/',
    'Equinix posted its strongest quarterly leasing results in company history, driven by hyperscale AI training deployments across its North American and EMEA campuses. The company cited GPU cluster co-location as the primary demand driver, with interconnection revenues also reaching record highs.',
    '2025-11-12 00:00:00+00'
  ),
  (
    'Ashburn Power Constraints Force Developers to Look Beyond Northern Virginia',
    'Data Center Knowledge',
    'https://www.datacenterknowledge.com/industry-trends/ashburn-power-constraints-force-developers-beyond-northern-virginia',
    'Loudoun County''s transmission capacity limitations have prompted major hyperscalers and colocation providers to accelerate site selection in secondary markets including Columbus, Phoenix, and San Antonio. Dominion Energy has confirmed multi-year wait times for new large-load interconnection in the Ashburn corridor.',
    '2025-08-04 00:00:00+00'
  ),
  (
    'Meta Expands Data Center Technician Training Program to 10 New Cities',
    'Meta Newsroom',
    'https://about.fb.com/news/meta-expands-data-center-technician-training-program',
    'Meta announced the expansion of its Data Center Academy workforce training initiative to ten additional metropolitan areas, with a goal of graduating 5,000 entry-level technicians by 2027. The program partners with community colleges and workforce development agencies to create a pipeline for underrepresented workers.',
    '2025-03-18 00:00:00+00'
  ),
  (
    'New EPA Guidelines Target PUE Improvements for Hyperscale Facilities',
    'Uptime Institute',
    'https://uptimeinstitute.com/resources/research-and-reports/new-epa-guidelines-pue-hyperscale',
    'The Environmental Protection Agency released updated voluntary guidelines recommending a PUE ceiling of 1.4 for new hyperscale data center construction, citing the sector''s growing share of national electricity consumption. The Uptime Institute called the targets achievable but warned that legacy colocation facilities may face significant retrofit costs.',
    '2024-10-22 00:00:00+00'
  ),
  (
    'CyrusOne Breaks Ground on 500MW Campus in Central Texas',
    'Bisnow',
    'https://www.bisnow.com/national/news/data-center/cyrusone-breaks-ground-500mw-campus-central-texas',
    'CyrusOne held a groundbreaking ceremony for its largest campus to date, a 500-megawatt development in the Pflugerville submarket north of Austin. The phased project is expected to create over 800 permanent operations and construction jobs when fully built out.',
    '2025-06-09 00:00:00+00'
  ),
  (
    'Water Usage Effectiveness Becomes New Battleground in Sustainable DC Design',
    'Data Center Dynamics',
    'https://www.datacenterdynamics.com/en/analysis/water-usage-effectiveness-sustainable-data-center-design/',
    'As hyperscalers face increasing regulatory and community pressure over water consumption, WUE has emerged alongside PUE as a key sustainability metric. Facilities in arid markets such as Phoenix and Las Vegas are piloting closed-loop adiabatic cooling and direct liquid cooling to reduce reliance on municipal water supplies.',
    '2025-04-30 00:00:00+00'
  ),
  (
    'BICSI Releases Updated ANSI/BICSI 002 Standard for Data Center Design',
    'BICSI',
    'https://www.bicsi.org/standards/available-from-bicsi/data-center-standards',
    'BICSI published the latest revision of its flagship ANSI/BICSI 002 Data Center Design and Implementation Best Practices standard, incorporating guidance on high-density cabling for AI clusters, updated fire suppression requirements, and a new section on modular and edge data center deployments.',
    '2024-12-05 00:00:00+00'
  ),
  (
    'Labor Shortage in Mission Critical Sector Pushes Wages Up 15% in Key Markets',
    'Structure Research',
    'https://structureresearch.net/reports/labor-shortage-mission-critical-wages-2025',
    'A new Structure Research report found that average compensation for experienced data center operations and engineering roles increased by 15% year-over-year in top markets including Northern Virginia, Phoenix, and Columbus. The report attributes the wage growth to a persistent shortage of credentialed technicians relative to the pace of capacity expansion.',
    '2025-09-17 00:00:00+00'
  ),
  (
    'AWS Announces 7 New Availability Zones Across North America',
    'Amazon Web Services',
    'https://aws.amazon.com/about-aws/whats-new/2025/aws-announces-7-new-availability-zones-north-america',
    'Amazon Web Services unveiled plans for seven new availability zones in existing and new AWS regions spanning the eastern United States, Texas, and the Pacific Northwest. The expansion, representing tens of billions in infrastructure investment, is expected to generate thousands of data center construction and operations jobs over the next five years.',
    '2025-05-21 00:00:00+00'
  ),
  (
    'NV Energy Signs 10-Year Renewable Power Agreement with Hyperscale Clients',
    'The Register',
    'https://www.theregister.com/2025/02/14/nv_energy_renewable_power_agreement_hyperscale/',
    'Nevada''s NV Energy finalized a landmark 10-year power purchase agreement to supply 2.4 gigawatts of solar and battery storage capacity to a consortium of hyperscale data center operators in the Las Vegas and Reno markets. The deal marks one of the largest utility-scale renewable contracts in the western United States.',
    '2025-02-14 00:00:00+00'
  ),
  (
    'Phoenix Emerges as Top Market for Data Center Expansion Outside Virginia',
    'Data Center Knowledge',
    'https://www.datacenterknowledge.com/data-center-market-analysis/phoenix-emerges-top-market-expansion-outside-virginia',
    'Site selectors and developers cite Phoenix''s available land, competitive power rates, and growing fiber density as factors driving a wave of new construction announcements totaling more than 2 gigawatts of planned capacity. The surge is prompting local workforce development agencies to fast-track training programs for data center technicians.',
    '2024-11-03 00:00:00+00'
  ),
  (
    'CompTIA Reports 40% Growth in Server+ Certification Completions',
    'CompTIA',
    'https://www.comptia.org/newsroom/comptia-reports-40-percent-growth-server-plus-certification-completions',
    'CompTIA announced a 40% year-over-year increase in Server+ certification completions, driven in part by data center operator tuition reimbursement programs and the expansion of Meta''s technician training initiative. The organization also noted a significant uptick in candidates from community college workforce programs in Phoenix, Columbus, and Ashburn.',
    '2026-01-28 00:00:00+00'
  );

-- -------------------------------------------------------------------------
-- RESOURCES (9 entries)
-- -------------------------------------------------------------------------

INSERT INTO resources (name, type, provider, url, description)
VALUES
  (
    'Meta Data Center Technician Training Program',
    'program',
    'Meta',
    'https://datacenteracademy.com',
    'Free 16-week program training entry-level data center technicians. Covers hardware, networking, safety, and operations. Graduates are connected with Meta''s data center partners for job placement.'
  ),
  (
    'CompTIA Server+',
    'cert',
    'CompTIA',
    'https://www.comptia.org/certifications/server',
    'Industry-standard certification for server hardware and software technologies. Covers server architecture, storage, networking, security, and disaster recovery.'
  ),
  (
    'BICSI Data Center Design Consultant (DCDC)',
    'cert',
    'BICSI',
    'https://www.bicsi.org/education-certification/certification/dcdc',
    'Professional certification for data center design. Covers infrastructure design, power and cooling systems, cabling, and compliance with ANSI/BICSI standards.'
  ),
  (
    'Schneider Electric Energy University',
    'program',
    'Schneider Electric',
    'https://www.se.com/ww/en/work/training/energy-university.jsp',
    'Free online training platform with 200+ courses on power, cooling, and data center design. Covers topics from basic concepts to advanced critical infrastructure management.'
  ),
  (
    'Uptime Institute Professional (AEIT)',
    'cert',
    'Uptime Institute',
    'https://www.uptimeinstitute.com/education',
    'Accredited tier certification training for data center design and operations. The gold standard for mission-critical infrastructure professionals.'
  ),
  (
    'Lincoln Tech Data Center Technology Program',
    'school',
    'Lincoln Tech',
    'https://www.lincolntech.edu',
    'Hands-on technical training program covering data center operations, networking, and server administration. Programs available at multiple campuses across the US.'
  ),
  (
    'Vertiv Training Academy',
    'program',
    'Vertiv',
    'https://www.vertiv.com/en-us/support/training',
    'Technical training for power, thermal, and IT management products. Covers UPS systems, CRAC units, and monitoring software. Available online and in-person.'
  ),
  (
    'OSHA 30-Hour Construction (Mission Critical Track)',
    'cert',
    'OSHA Education Center',
    'https://www.oshaeducationcenter.com',
    'Required safety certification for data center construction roles. Covers fall protection, electrical safety, confined spaces, and mission critical site protocols.'
  ),
  (
    'Maricopa Skill Center Data Center Program',
    'school',
    'Maricopa Community Colleges',
    'https://www.maricopa.edu',
    'Workforce training program preparing students for entry-level data center roles in the Phoenix metro area. Covers cabling, hardware, and basic operations.'
  );
