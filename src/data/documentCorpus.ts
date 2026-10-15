import { FinancialDocument } from '../types';

export const FINANCIAL_DOCUMENTS: FinancialDocument[] = [
  {
    id: 'DOC-NSE-RELIANCE-Q3',
    title: 'Reliance Industries Limited: Consolidated Q3 Financial Results & Capital Allocation',
    publisher: 'National Stock Exchange Corporate Disclosures',
    publication_date: '2025-01-18',
    ticker: 'RELIANCE',
    sector: 'Energy & Retail Conglomerate',
    doc_type: 'Earnings',
    is_synthetic: false,
    source_url: 'https://www.bseindia.com/corporates/ann.html',
    summary: 'Consolidated EBITDA expanded 11.4% YoY led by retail floor expansion and digital services tariff rationalization. Oil-to-chemicals downstream refining margins stabilized.',
    content: `Reliance Industries Limited reported consolidated quarterly revenue of ₹2,48,600 Crore with an EBITDA margin of 17.8%. Digital Services (Jio) recorded ARPU growth of 7.2% to ₹195 following mobile tariff rationalization. Organized retail footfalls grew 14% across tier-2 and tier-3 cities with steady same-store sales growth. In the Oil-to-Chemicals (O2C) segment, refining margins saw modest recovery of $1.8/bbl amid firm petrochemical crack spreads. Capital expenditure for the new energy giga-complex in Jamnagar remains within targeted budgetary allocation, expected to commence commercial phased rollout in late 2025. Management reaffirmed debt-to-equity ratio discipline below 0.65x.`,
    chunks: [
      {
        chunk_id: 'DOC-RELIANCE-C1',
        doc_id: 'DOC-NSE-RELIANCE-Q3',
        section_title: 'Segment Performance & Operating Margins',
        tags: ['RELIANCE', 'EBITDA', 'ARPU', 'O2C', 'Retail'],
        text: 'Consolidated revenue reached ₹2,48,600 Crore with EBITDA margins at 17.8%. Jio ARPU expanded 7.2% to ₹195 following tariff rationalization, while organized retail floor additions surged 14% YoY across Indian cities.'
      },
      {
        chunk_id: 'DOC-RELIANCE-C2',
        doc_id: 'DOC-NSE-RELIANCE-Q3',
        section_title: 'Capex, Debt Profile & Downstream Outlook',
        tags: ['RELIANCE', 'Capex', 'Green Energy', 'Debt', 'Jamnagar'],
        text: 'Jamnagar new energy giga-complex capex tracking within targeted ceiling. Net debt to EBITDA sustained at conservative 0.65x leverage. O2C refining spread premium improved $1.8/bbl, offsetting petchem feedstock volatility.'
      }
    ]
  },
  {
    id: 'DOC-NSE-INFY-Q3',
    title: 'Infosys Limited: Guidance Revision & Large Deal TCV Commentary',
    publisher: 'Infosys Investor Relations / Exchange Filing',
    publication_date: '2025-01-14',
    ticker: 'INFY',
    sector: 'Information Technology',
    doc_type: 'Earnings',
    is_synthetic: false,
    source_url: 'https://www.infosys.com/investors.html',
    summary: 'Management revised constant currency revenue growth guidance upward to 4.5%-5.0% for FY25 with large deal TCV touching $2.8B. European BFSI demand rebounded.',
    content: `Infosys announced strong contract signings with Total Contract Value (TCV) touching $2.8 Billion, 52% of which represents net new business. FY25 constant currency revenue guidance narrowed upwards from 3.75%-4.5% to 4.5%-5.0%. Operating margins stood resilient at 21.1%, supported by the Project Maximus operational efficiency program. Management noted that banking and financial services (BFSI) in European corridors showed positive inflection, though retail clients in North America continue to defer non-critical discretionary digital transformation projects. Headcount utilization stood at 84.3%, with voluntary attrition declining to a twelve-quarter low of 12.6%.`,
    chunks: [
      {
        chunk_id: 'DOC-INFY-C1',
        doc_id: 'DOC-NSE-INFY-Q3',
        section_title: 'Guidance Upgrade & Deal Wins',
        tags: ['INFY', 'Guidance', 'TCV', 'BFSI', 'Margin'],
        text: 'Infosys upgraded FY25 CC revenue growth target to 4.5%-5.0%. Large deal TCV reached $2.8 Billion with 52% net new wins, indicating resilience in core cloud migration and cost takeout mandates.'
      },
      {
        chunk_id: 'DOC-INFY-C2',
        doc_id: 'DOC-NSE-INFY-Q3',
        section_title: 'Discretionary Spend Risks & Geographic Pockets',
        tags: ['INFY', 'Risks', 'Discretionary Spend', 'North America', 'Attrition'],
        text: 'Discretionary software modernization outlays in North American retail and manufacturing remain sluggish. Headcount utilization reached 84.3% while voluntary attrition subsided to 12.6%.'
      }
    ]
  },
  {
    id: 'DOC-NSE-TATASTEEL-Q3',
    title: 'Tata Steel Limited: Domestic Production Surge & European Restructuring Update',
    publisher: 'BSE/NSE Corporate Disclosures',
    publication_date: '2025-01-22',
    ticker: 'TATASTEEL',
    sector: 'Metals & Mining',
    doc_type: 'Exchange Disclosure',
    is_synthetic: false,
    summary: 'Kalinganagar 5 MTPA blast furnace ramp-up compensates for Port Talbot UK transition costs. High coking coal cost volatility and Chinese export dumping remain ongoing headwinds.',
    content: `Tata Steel informed stock exchanges that domestic crude steel production rose 6.1% to 5.32 million tonnes during the quarter, aided by the successful commissioning of the Kalinganagar phase-2 expansion. Deliveries in automotive and infrastructure segments reached all-time quarterly highs. Conversely, the transition of the Port Talbot UK facility to an Electric Arc Furnace (EAF) entailed one-off restructuring provisions. Management highlighted pressure from cheap Chinese hot-rolled coil imports into Southeast Asian benchmarks, prompting Indian industry bodies to petition the Directorate General of Trade Remedies (DGTR) for safeguard duties.`,
    chunks: [
      {
        chunk_id: 'DOC-TATASTEEL-C1',
        doc_id: 'DOC-NSE-TATASTEEL-Q3',
        section_title: 'Indian Domestic Volume Surge',
        tags: ['TATASTEEL', 'Kalinganagar', 'Domestic Steel', 'Volumes'],
        text: 'Indian domestic crude output climbed 6.1% YoY to 5.32 MT led by Kalinganagar 5 MTPA blast furnace ramp-up. Automotive steel deliveries registered double-digit expansion.'
      },
      {
        chunk_id: 'DOC-TATASTEEL-C2',
        doc_id: 'DOC-NSE-TATASTEEL-Q3',
        section_title: 'European Restructuring & Import Price Pressure',
        tags: ['TATASTEEL', 'Port Talbot', 'Chinese Imports', 'DGTR', 'EAF'],
        text: 'Port Talbot EAF conversion incurred one-off restructuring costs. Steel realisations faced downward pricing pressure from Chinese HRC export dumping across Asian trade routes.'
      }
    ]
  },
  {
    id: 'DOC-NSE-HDFCBANK-Q3',
    title: 'HDFC Bank Limited: Net Interest Margin (NIM) Stabilization & Deposit Accretion',
    publisher: 'HDFC Bank Investor Relations',
    publication_date: '2025-01-16',
    ticker: 'HDFCBANK',
    sector: 'Banking & Financial Services',
    doc_type: 'Earnings',
    is_synthetic: false,
    summary: 'Core NIM stabilized at 3.46% post-merger integration. Credit-to-deposit (LDR) ratio normalized towards 101% through aggressive retail deposit mobilization.',
    content: `HDFC Bank reported net profit growth of 18.2% YoY to ₹16,372 Crore. Net Interest Margin (NIM) on total assets stabilized at 3.46%, up 3 basis points sequentially as high-cost wholesale borrowings were retired. Gross NPA improved 4 bps to 1.24%, while Net NPA remained pristine at 0.31%. Retail deposits expanded 19.5% YoY, narrowing the post-merger Credit-Deposit ratio from 110% down towards 101%. Management guided that the bank will prioritize deposit accretion over aggressive wholesale loan origination to rebuild statutory liquidity buffers.`,
    chunks: [
      {
        chunk_id: 'DOC-HDFCBANK-C1',
        doc_id: 'DOC-NSE-HDFCBANK-Q3',
        section_title: 'NIM Stabilization & Asset Quality',
        tags: ['HDFCBANK', 'NIM', 'Gross NPA', 'Net Profit'],
        text: 'Net Interest Margin on total assets held firm at 3.46% with Gross NPA improving to 1.24%. Net profit rose 18.2% to ₹16,372 Crore with credit costs tracking below 50 bps.'
      },
      {
        chunk_id: 'DOC-HDFCBANK-C2',
        doc_id: 'DOC-NSE-HDFCBANK-Q3',
        section_title: 'Deposit Accretion & LDR Glidepath',
        tags: ['HDFCBANK', 'LDR', 'Deposits', 'Credit Growth'],
        text: 'Retail deposits grew 19.5% YoY, bringing credit-to-deposit ratio down from 110% to 101%. The bank continues to pace loan growth below deposit growth to reinforce statutory liquidity.'
      }
    ]
  },
  {
    id: 'DOC-NSE-TCS-Q3',
    title: 'Tata Consultancy Services: Enterprise AI Pipeline & Cloud Infrastructure Mandates',
    publisher: 'Tata Consultancy Services Press Release',
    publication_date: '2025-01-11',
    ticker: 'TCS',
    sector: 'Information Technology',
    doc_type: 'Corporate announcements',
    is_synthetic: false,
    summary: 'TCS active enterprise AI engagement pipeline crosses $900M; operating margins sustained at industry-leading 25.0%.',
    content: `Tata Consultancy Services announced that its pipeline of active AI and Machine Learning enterprise projects crossed $900 Million across healthcare, retail, and financial clients. Operating margin came in at 25.0%, maintaining sector leadership. The company has trained more than 350,000 software engineers in foundation models and cloud architectures. Total Q3 order book stood at $8.1 Billion with a book-to-bill ratio of 1.1x. CEO emphasized that clients are moving from exploratory proof-of-concepts to enterprise-scale production workloads, specifically in automated code migration, customer service automation, and claims processing.`,
    chunks: [
      {
        chunk_id: 'DOC-TCS-C1',
        doc_id: 'DOC-NSE-TCS-Q3',
        section_title: 'AI Engagements & Workforce Upskilling',
        tags: ['TCS', 'Generative AI', 'Order Book', 'Margins'],
        text: 'TCS reported an active AI project pipeline of $900M+ with 350,000 associates certified on frontier LLM architectures. Q3 total bookings came in at $8.1B with book-to-bill at 1.1x.'
      }
    ]
  },
  {
    id: 'DOC-NSE-ZOMATO-Q3',
    title: 'Zomato Limited: Blinkit Quick-Commerce Dark Store Economics & Turnaround',
    publisher: 'Zomato Shareholder Letter / BSE Filing',
    publication_date: '2025-01-20',
    ticker: 'ZOMATO',
    sector: 'Consumer Internet',
    doc_type: 'Earnings',
    is_synthetic: false,
    summary: 'Blinkit store count scaled to 910 dark stores; GOV expanded 115% YoY with contribution margin turning positive at 3.8% of GOV.',
    content: `Zomato Limited reported consolidated quarterly net profit of ₹258 Crore compared to ₹36 Crore in the prior year period. Quick-commerce arm Blinkit expanded its footprint to 910 active dark stores, on track to reach 1,200 stores by mid-2025. Gross Order Value (GOV) for Blinkit surged 115% YoY with average delivery time holding at 11.8 minutes. Contribution margin as a percentage of GOV improved from -1.1% to +3.8% driven by advertising revenue from FMCG brands and higher order basket sizes. Food delivery adjusted EBITDA margin reached 3.4% of GOV.`,
    chunks: [
      {
        chunk_id: 'DOC-ZOMATO-C1',
        doc_id: 'DOC-NSE-ZOMATO-Q3',
        section_title: 'Blinkit Hypergrowth & Contribution Margin Inflection',
        tags: ['ZOMATO', 'Blinkit', 'Quick Commerce', 'Dark Stores', 'GOV'],
        text: 'Blinkit reached 910 dark stores with GOV accelerating 115% YoY. Contribution margins swung to +3.8% of GOV boosted by FMCG brand ad monetization and larger ticket sizes.'
      }
    ]
  },
  {
    id: 'DOC-MACRO-RBI-MPC',
    title: 'Reserve Bank of India: Monetary Policy Committee Resolution & Macro Outlook',
    publisher: 'Reserve Bank of India Press Bulletin',
    publication_date: '2025-02-08',
    ticker: null,
    sector: 'Macroeconomics',
    doc_type: 'Macro',
    is_synthetic: false,
    summary: 'RBI maintains policy Repo Rate at 6.50% while shifting stance to Neutral. FY26 real GDP growth projected at 7.0% with headline CPI inflation expected to align towards 4.2%.',
    content: `The Monetary Policy Committee (MPC) of the Reserve Bank of India voted 5 to 1 to keep the policy repo rate unchanged at 6.50%. The policy stance was formally adopted as "Neutral", providing flexibility to respond to domestic and external economic developments. Real GDP growth for FY26 is projected at 7.0%, buoyed by robust rural consumption, sustained government capital expenditure on railways and highways, and revival in private corporate investments. CPI inflation is projected at 4.2% for the coming fiscal year, assuming a normal monsoon and stable crude oil prices below $80/barrel.`,
    chunks: [
      {
        chunk_id: 'DOC-RBI-C1',
        doc_id: 'DOC-MACRO-RBI-MPC',
        section_title: 'Repo Rate Stance & Macro Growth Outlook',
        tags: ['RBI', 'Repo Rate', 'GDP', 'Inflation', 'Monetary Policy'],
        text: 'RBI MPC maintained policy repo rate at 6.50% while transitioning stance to Neutral. Indian real GDP growth for FY26 is pegged at 7.0% supported by rural demand and infrastructure capex.'
      }
    ]
  },
  {
    id: 'DOC-FLOW-FII-DII',
    title: 'Institutional Capital Flow Monitor: FII Reallocation vs Domestic SIP Resiliency',
    publisher: 'National Stock Exchange / CDSL Flow Data',
    publication_date: '2025-01-31',
    ticker: null,
    sector: 'Capital Markets',
    doc_type: 'FII_DII_Flow',
    is_synthetic: false,
    summary: 'Foreign Institutional Investors recorded net selling of ₹18,400 Crore in large caps, while Domestic Mutual Funds absorbed ₹28,600 Crore fueled by record ₹23,000 Crore monthly SIP inflows.',
    content: `Capital flow data for Indian exchanges indicated sustained divergence between institutional cohorts. Foreign Portfolio Investors (FPIs/FIIs) recorded net sales of ₹18,400 Crore ($2.2B), driven by US dollar index firmness and portfolio rebalancing into lower-multiple emerging markets. Conversely, Domestic Institutional Investors (DIIs), anchored by domestic mutual funds and insurance companies, poured ₹28,600 Crore into equities. Systematic Investment Plan (SIP) contributions crossed an all-time monthly high of ₹23,330 Crore, effectively insulating domestic benchmarks from deep foreign selling shocks.`,
    chunks: [
      {
        chunk_id: 'DOC-FLOW-C1',
        doc_id: 'DOC-FLOW-FII-DII',
        section_title: 'FII Net Selling vs DII Domestic Absorption',
        tags: ['FII', 'DII', 'SIP', 'Flows', 'Mutual Funds'],
        text: 'Foreign portfolio flows saw net outflow of ₹18,400 Crore in large-cap indices. Domestic mutual fund absorption reached ₹28,600 Crore propelled by record monthly SIP run-rate of ₹23,330 Crore.'
      }
    ]
  },
  {
    id: 'DOC-SEBI-DERIVATIVES',
    title: 'Securities and Exchange Board of India: Regulatory Framework for Index Derivatives',
    publisher: 'SEBI Circular / Gazetted Notification',
    publication_date: '2024-11-20',
    ticker: null,
    sector: 'Financial Regulation',
    doc_type: 'Regulatory',
    is_synthetic: false,
    summary: 'SEBI implements revised contract sizing between ₹15-20 Lakhs and rationalized weekly expiries to safeguard retail participants from unhedged derivative losses.',
    content: `The Securities and Exchange Board of India (SEBI) announced measures to enhance investor protection in equity index derivatives. The minimum contract value for index options and futures is calibrated between ₹15 Lakhs and ₹20 Lakhs, and weekly expiry contracts are rationalized to one benchmark per exchange. SEBI studies highlighted that 93% of individual retail traders suffered net losses in F&O during FY22-FY24, with average loss exceeding ₹1.25 Lakh per trader. The regulator urged brokers to mandate behavioral risk profiling and explicit margin buffers.`,
    chunks: [
      {
        chunk_id: 'DOC-SEBI-C1',
        doc_id: 'DOC-SEBI-DERIVATIVES',
        section_title: 'Index Derivative Measures & Retail Risk Data',
        tags: ['SEBI', 'F&O', 'Derivatives', 'Retail Risk', 'Contract Sizing'],
        text: 'SEBI increased minimum index contract size to ₹15-20 Lakhs and restricted weekly expiries. Regulatory data revealed 93% of active retail derivative participants experienced cumulative trading losses.'
      }
    ]
  },
  {
    id: 'DOC-NSE-SUNPHARMA-Q3',
    title: 'Sun Pharmaceutical Industries: Global Specialty Pipeline & US FDA Compliance Update',
    publisher: 'Sun Pharma Investor Relations',
    publication_date: '2025-01-28',
    ticker: 'SUNPHARMA',
    sector: 'Pharmaceuticals',
    doc_type: 'Exchange Disclosure',
    is_synthetic: false,
    summary: 'Global specialty sales touched $295M led by Ilumya and Cequa. Halol facility remediation response submitted to US FDA; domestic formulation revenue grew 11.2%.',
    content: `Sun Pharmaceutical Industries provided an operational update on its specialty biopharmaceutical pipeline. Global specialty revenues reached $295 Million for the third quarter, accounting for 19.4% of total sales. Dermatological biologic Ilumya and ophthalmic solution Cequa registered double-digit volume expansion in US and European markets. In the domestic formulation business, chronic therapies including cardiology and diabetology grew 11.2% YoY, outpacing the Indian Pharma Market (IPM) benchmark. Corrective actions following US FDA observations at the Halol formulation plant were submitted, with audit clearance pending.`,
    chunks: [
      {
        chunk_id: 'DOC-SUNPHARMA-C1',
        doc_id: 'DOC-NSE-SUNPHARMA-Q3',
        section_title: 'Specialty Pharma Growth & Domestic Leadership',
        tags: ['SUNPHARMA', 'Ilumya', 'Specialty', 'USFDA', 'Formulations'],
        text: 'Global specialty sales reached $295M (19.4% of sales) led by Ilumya psoriasis franchise. Indian domestic branded formulations grew 11.2% driven by cardiology and metabolic chronic segments.'
      }
    ]
  },
  {
    id: 'DOC-SECTOR-AUTO-EV',
    title: 'Society of Indian Automobile Manufacturers: Passenger Vehicle Retail Dynamics & EV Trajectory',
    publisher: 'SIAM Industry Bulletin',
    publication_date: '2025-01-25',
    ticker: 'TATAMOTORS',
    sector: 'Automobile',
    doc_type: 'Sector Report',
    is_synthetic: false,
    summary: 'Utility Vehicles (SUVs) captured 54% of domestic passenger vehicle sales. Electric vehicle penetration in four-wheelers reached 3.1%, alongside rising popularity of strong hybrids.',
    content: `The Indian automotive industry experienced divergence in consumer demand during Q3 FY25. Utility Vehicles (SUVs) constituted 54% of overall passenger vehicle volumes, while entry-level hatchback sales contracted 6.8% YoY. EV penetration in personal four-wheelers climbed to 3.1%, led by new model launches with localized battery pack assembly. Strong-hybrid vehicles gained traction in premium segments owing to lower total cost of ownership in urban commute cycles. Commercial vehicle volumes remained subdued pending post-monsoon infrastructure contract award disbursements.`,
    chunks: [
      {
        chunk_id: 'DOC-AUTO-C1',
        doc_id: 'DOC-SECTOR-AUTO-EV',
        section_title: 'SUV Dominance & Hybrid/EV Penetration',
        tags: ['Automobile', 'EV', 'Hybrid', 'SUV', 'Demand'],
        text: 'SUVs captured 54% of domestic passenger vehicle sales. Electric vehicle adoption in four-wheelers reached 3.1%, alongside rising popularity of strong hybrids in urban corridors.'
      }
    ]
  },
  {
    id: 'DOC-NSE-ICICI-Q3',
    title: 'ICICI Bank Limited: Core Operating Profit & Asset Quality Performance',
    publisher: 'ICICI Bank Press Release / BSE Filing',
    publication_date: '2025-01-25',
    ticker: 'ICICIBANK',
    sector: 'Banking & Financial Services',
    doc_type: 'Earnings',
    is_synthetic: false,
    summary: 'Core operating profit grew 14.5% YoY to ₹16,110 Crore. Net Interest Margin stood at 4.27% with Net NPA holding at 0.42%.',
    content: `ICICI Bank reported quarterly net profit growth of 14.5% YoY to ₹11,792 Crore. Net Interest Margin (NIM) was 4.27% compared to 4.27% in the previous quarter. Domestic loan portfolio grew 15.7% YoY driven by business banking (30.1% YoY) and SME lending. Retail loans comprised 53.6% of the total loan portfolio. The bank maintained provision coverage ratio of 80.2% on non-performing loans, with annualized credit cost of 0.48%. Retail deposits increased by 16.8% YoY, supporting balanced balance sheet growth.`,
    chunks: [
      {
        chunk_id: 'DOC-ICICI-C1',
        doc_id: 'DOC-NSE-ICICI-Q3',
        section_title: 'Profitability & Loan Growth',
        tags: ['ICICIBANK', 'NIM', 'NPA', 'Retail Loans'],
        text: 'Core operating profit grew 14.5% to ₹16,110 Crore with NIM stable at 4.27%. Domestic loan book expanded 15.7% led by SME and business banking.'
      }
    ]
  }
];
