// Every figure on the site lives here, once. Sources match the notes in README.md.
export const person = {
  name: 'Tarang (TJ) Jammalamadaka',
  short: 'TJ Jammalamadaka',
  role: 'Data analyst',
  email: 'tarangjammalamadaka9@gmail.com',
  linkedin: 'https://linkedin.com/in/tarang-tj/',
  github: 'https://github.com/tarang-tj',
};

// Home page proof strip: one number per line of work.
export const proof = [
  ['~50', 'people used the tool I built at Coca-Cola'],
  ['100 to 40', 'support tickets after the fixes I proposed at Quadcore'],
  ['4,433', 'weather markets scored by my forecasting model'],
  ['14th of 1,983', 'in the HackerRank Orchestrate hackathon'],
];

// Case studies. `visual` names a window renderer in src/visuals.mjs.
export const cases = [
  {
    slug: 'coca-cola',
    title: 'Replacing a manual data pull at Coca-Cola',
    org: 'The Coca-Cola Company', year: 'Summer 2026',
    line: 'An internal tool that replaced a four-person, three-day manual pull.',
    role: 'AI MarTech Intern, Ignite Program', team: 'Global Human Insights, Atlanta',
    when: 'May 18 to Aug 14, 2026', tools: 'Azure OpenAI, Python, Power BI, Excel',
    visual: 'runlog',
    overview: [
      'A recurring analytical request took a four-person team about three days to pull by hand. I interviewed 10 of the people who relied on it, then built an internal tool to replace the manual pull.',
      'Azure OpenAI plans the query. Deterministic Python computes every figure over a 25 to 30 million row backend. Model output is schema validated, and more than 50 reconciliation checks run across Excel, Power BI and Python.',
      'Along the way I traced a recurring discrepancy to the order in which figures were rounded, and wrote the calculation standard the team adopted.',
    ],
    finding: 'If two systems disagree on a number, the tool stops and reports it instead of picking one. The checks caught nine mismatches.',
    figures: [['Manual pull it replaced', '4 people, ~3 days'], ['Direct users', '~50'], ['Rows in the backend', '25 to 30M'],
      ['Reconciliation checks', '50+'], ['Mismatches caught', '9'], ['Employees reached by its output', '500+']],
    note: 'The tool, its code and its data are internal to the company, so the window above is an illustration of how a run behaves, not a screenshot.',
    links: [],
  },
  {
    slug: 'quadcore',
    title: 'Cutting support tickets at Quadcore',
    org: 'Quadcore Innovations', year: '2025 to 2026',
    line: 'Tracing most support tickets to one crash path and getting it fixed.',
    role: 'Operations Improvement Analyst', team: 'Fintech payments platform',
    when: 'Oct 2025 to May 2026', tools: 'SQL, Power BI, Tableau',
    visual: 'tickets',
    overview: [
      'I mapped the platform with the people who operate it and traced about 70% of support tickets to a single crash path. The product lead accepted the fixes I proposed.',
      'I also replaced a manual weekly reporting cycle with automated SQL and Power BI feeds behind four Tableau dashboards. Over the same period, monthly active users grew from 400 to 550.',
    ],
    finding: 'Tickets fell from about 100 to 40, and resolution time went from 2 to 4 days to 24 hours.',
    figures: [['Tickets traced to one crash path', '~70%'], ['Support tickets, before and after', 'about 100 to 40'],
      ['Resolution time, before and after', '2 to 4 days to 24 hours'], ['Monthly active users', '400 to 550']],
    note: 'Figures are from my engagement records. The chart is drawn from them; the real dashboards are the company’s.',
    links: [],
  },
  {
    slug: 'kalshi',
    title: 'Forecasting weather prediction markets',
    org: 'Independent research', year: '2026',
    line: 'A temperature forecasting model scored against 4,433 Kalshi markets.',
    role: 'Sole author', team: 'Python, Kalshi market data',
    when: 'Scoreboard as of Oct 22, 2026', tools: 'Python, pandas',
    visual: 'brier',
    overview: [
      'The model turns day-ahead temperature forecasts for 7 U.S. cities into probabilities and compares them with Kalshi market prices.',
      'The first paper backtest returned 7.7%. The Brier score, which measures calibration, showed the market was much better, so I did not treat the return as evidence the model works.',
    ],
    finding: 'Across 4,433 settled markets, on the 1,216 where the market was unsure, the market scores 0.2114 and my model scores 0.3047. Paper return is -3.37% on 212 picks. My rule for real money has not been met, so none has been traded.',
    figures: [['Settled markets scored', '4,433'], ['Contested markets', '1,216'], ['Brier, market', '0.2114'],
      ['Brier, my model', '0.3047'], ['Paper return', '-3.37% on 212 picks']],
    note: 'Lower Brier is better. Full write-up and code are public.',
    links: [['Full write-up', 'https://github.com/tarang-tj/kalshi-weather-engine-report']],
  },
  {
    slug: 'retail-sql',
    title: 'Segmenting online store customers in SQL',
    org: 'SQL study', year: '2026',
    line: 'Customers with four or more orders are a third of buyers and 54.4% of revenue.',
    role: 'Sole author', team: 'PostgreSQL, six-table retail schema',
    when: '620 orders, Jan 2024 to Jun 2025', tools: 'PostgreSQL, window functions, cohorts',
    visual: 'segments',
    overview: [
      'A six-table retail schema with 620 orders and $112,344 in sales, analyzed with cohort and window-function queries.',
      'The segment query splits buyers by how often they come back, then compares each group’s share of buyers with its share of revenue.',
    ],
    finding: 'Loyal customers, with four or more orders, are a third of buyers (63 of 189) and bring in 54.4% of revenue. One-time buyers are 19% of buyers and 7.5% of revenue.',
    figures: [['Buyers analyzed', '189'], ['Loyal customers (4+ orders)', '33.3% of buyers'], ['Their share of revenue', '54.4%'],
      ['One-time buyers', '19.0% of buyers, 7.5% of revenue']],
    note: 'Query 2.4, rerun on the repository’s seed data on Oct 24, 2026. An earlier version of the repository’s README reported different shares; this rerun replaces them.',
    links: [['Queries and data', 'https://github.com/tarang-tj/ecommerce-sql']],
  },
];

// Smaller builds: shown as tiles, linking out.
export const builds = [
  { name: 'AutoAppli', url: 'https://autoappli.com', img: 'img/autoappli.webp',
    text: 'A job-search tracker that shows where an application pipeline is leaking. About 400 weekly users.' },
  { name: 'SyllabusAI', url: 'https://syllabusai.net', img: 'img/syllabusai.webp',
    text: 'Turns a syllabus into dated calendar deadlines. I built and ran it from March to August 2026, with 1,055 tests.' },
  { name: 'ragproof', url: 'https://github.com/tarang-tj/ragproof', visual: 'ndcg',
    text: 'An open-source harness that scores how well a search system finds the right documents, on BEIR SciFact.' },
  { name: 'Economic Pulse', url: 'https://tarang-tj.github.io/economic-pulse-dashboard/', code: 'https://github.com/tarang-tj/economic-pulse-dashboard',
    text: 'Seven live indicators from the Federal Reserve’s FRED API in Python and Streamlit, with recessions shaded.' },
  { name: 'Washington housing', url: 'https://tarang-tj.github.io/wa-housing-homelessness/', code: 'https://github.com/tarang-tj/wa-housing-homelessness',
    text: 'Nine years of rent, income, vacancy and homelessness data, modeled in R and published in Tableau.' },
];

export const experience = [
  ['Fall 2026', 'Principal Investigator', 'NASA L’SPACE NPWEE', 'Our concept was chosen from four pitches and hit every milestone.'],
  ['2026 to 2027', 'Treasurer', 'UW Bothell Club Council', 'A $200,000+ annual allocation across 95+ organizations.'],
  ['May to Aug 2026', 'AI MarTech Intern, Ignite Program', 'The Coca-Cola Company', ''],
  ['Mar to Aug 2026', 'Built and ran SyllabusAI', 'Independent', ''],
  ['Oct 2025 to May 2026', 'Operations Improvement Analyst', 'Quadcore Innovations', ''],
  ['Apr 2025 to May 2026', 'President', 'Delta Sigma Pi, Upsilon Psi', 'Named Collegiate Member of the Year 2026.'],
  ['2022 to 2024', 'Product Analyst Intern', 'JMT Worldwide LLC', 'Ran 50 user interviews, wrote PRDs and ran UAT.'],
  ['2021 to 2022', 'IT Business Analyst Intern', 'JMT Worldwide LLC', ''],
];
