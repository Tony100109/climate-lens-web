"use client";
import Link from "next/link";
import { Wind, Building2, Scale, Microscope, TreePine } from "lucide-react";

const ICON_MAP = {
  Wind,
  Building2,
  Scale,
  Microscope,
  TreePine,
};

const ARTICLES = [
  {
    slug: "what-is-aqi",
    title: "What is AQI and Why Should You Care?",
    icon: "Wind",
    preview: "The Air Quality Index is a number that tells you how clean or polluted your air is. Here's what the numbers actually mean for your health.",
    content: [
      { type: "p", text: "The Air Quality Index (AQI) is a standardized scale from 0 to 500 that the EPA uses to communicate how polluted the air is. It measures five major pollutants: ground-level ozone, particulate matter (PM2.5 and PM10), carbon monoxide, sulfur dioxide, and nitrogen dioxide." },
      { type: "h2", text: "What the Numbers Mean" },
      { type: "p", text: "0-50 (Good): Air quality is satisfactory. No health risk. Only 10% of the world's population breathes air this clean." },
      { type: "p", text: "51-100 (Moderate): Acceptable, but sensitive individuals (children, elderly, people with asthma) may experience minor effects. This level would trigger health advisories in many European countries." },
      { type: "p", text: "101-150 (Unhealthy for Sensitive Groups): The general public is less likely to be affected, but people with heart or lung disease, children, and older adults should reduce prolonged outdoor exertion." },
      { type: "p", text: "151-200 (Unhealthy): Everyone may begin to experience health effects. This is equivalent to breathing the exhaust of about 3 cigarettes over 8 hours." },
      { type: "p", text: "201-300 (Very Unhealthy): Health alert — everyone should avoid outdoor activity." },
      { type: "p", text: "301-500 (Hazardous): Emergency conditions. The entire population is at risk." },
      { type: "h2", text: "Why This Matters for Green Spaces" },
      { type: "p", text: "Trees and vegetation are natural air filters. A single mature tree can absorb 48 pounds of CO2 per year and filter particulate matter from the air through its leaves. Botanical gardens and conservatories concentrate this effect, creating measurably cleaner air zones in their surrounding neighborhoods." },
      { type: "p", text: "This is why organizations like conservatories aren't luxury amenities — they're public health infrastructure." },
    ],
  },
  {
    slug: "heat-islands",
    title: "Urban Heat Islands: Why Your Neighborhood Is Hotter",
    icon: "Building2",
    preview: "Some neighborhoods are 15-20°F hotter than others just miles away. The reason traces back decades — and green spaces are the solution.",
    content: [
      { type: "p", text: "An urban heat island is an area that's significantly warmer than surrounding rural or green areas. This happens because dark surfaces like asphalt and concrete absorb and re-emit heat, while a lack of vegetation removes the cooling effect of shade and evapotranspiration." },
      { type: "h2", text: "The Numbers" },
      { type: "p", text: "Urban areas can be 1-7°F warmer than surrounding rural areas during the day, and up to 22°F warmer at night. Within a single city, temperature differences between neighborhoods can reach 15-20°F depending on tree canopy and surface materials." },
      { type: "h2", text: "The Human Cost" },
      { type: "p", text: "Heat kills more Americans than hurricanes, tornadoes, and floods combined. During heat waves, neighborhoods without tree cover experience dramatically higher rates of heat-related illness and death. The people most affected are typically low-income, elderly, and communities of color." },
      { type: "h2", text: "The Solution: Green Infrastructure" },
      { type: "p", text: "A single mature tree can cool surrounding air by up to 10°F through shade and evapotranspiration. Botanical gardens, parks, and conservatories create cool zones that benefit everyone in the surrounding area. This is measurable, immediate, and cost-effective climate adaptation." },
    ],
  },
  {
    slug: "environmental-justice",
    title: "Environmental Justice: Why ZIP Code Predicts Health",
    icon: "Scale",
    preview: "Your ZIP code is a better predictor of your health than your genetic code. Here's why — and what's being done about it.",
    content: [
      { type: "p", text: "Environmental justice is the principle that all people deserve equal protection from environmental hazards, regardless of race, income, or geography. In practice, this principle is violated in nearly every American city." },
      { type: "h2", text: "The Redlining Connection" },
      { type: "p", text: "In the 1930s, the Home Owners' Loan Corporation created maps that graded neighborhoods A through D. 'D' neighborhoods — marked in red — were predominantly Black and immigrant communities. Banks refused to lend there, governments refused to invest, and developers refused to build parks." },
      { type: "p", text: "Today, formerly redlined neighborhoods have 41% less tree canopy, higher average temperatures, worse air quality, and higher rates of asthma, heart disease, and heat-related death than their 'A'-graded counterparts. The lines drawn in the 1930s predict environmental quality in the 2020s." },
      { type: "h2", text: "What the Data Shows" },
      { type: "p", text: "The EPA's EJScreen tool reveals that low-income communities and communities of color bear disproportionate environmental burdens: more proximity to toxic waste sites, higher air pollution, less access to green space, and more vulnerability to climate impacts." },
      { type: "h2", text: "Why Green Spaces Matter" },
      { type: "p", text: "Conservatories, botanical gardens, and community parks in underserved areas don't just beautify neighborhoods — they provide measurable public health benefits: cleaner air, cooler temperatures, reduced flooding, and improved mental health outcomes. Supporting these organizations is environmental justice work." },
    ],
  },
  {
    slug: "what-is-pm25",
    title: "PM2.5: The Invisible Killer in Your Air",
    icon: "Microscope",
    preview: "Particles 30 times smaller than a human hair that bypass your lungs and enter your bloodstream. What PM2.5 is and why it matters.",
    content: [
      { type: "p", text: "PM2.5 refers to fine particulate matter — tiny particles or droplets in the air that are 2.5 micrometers or smaller in diameter. For perspective, a human hair is about 70 micrometers thick. PM2.5 particles are so small they can penetrate deep into your lungs and enter your bloodstream." },
      { type: "h2", text: "Health Effects" },
      { type: "p", text: "Short-term exposure aggravates asthma, triggers heart attacks, and causes respiratory inflammation. Long-term exposure is linked to cardiovascular disease, lung cancer, stroke, and premature death. Air pollution contributes to an estimated 1 in 8 deaths worldwide." },
      { type: "h2", text: "Sources" },
      { type: "p", text: "PM2.5 comes from vehicle exhaust, industrial emissions, power plants, wildfires, and construction. Neighborhoods near highways or industrial zones have chronically elevated PM2.5 levels." },
      { type: "h2", text: "What Trees Do" },
      { type: "p", text: "Trees filter PM2.5 by capturing particles on their leaf surfaces. A study by the USDA Forest Service found that urban trees remove an estimated 711,000 metric tons of air pollution annually in the US, providing $3.8 billion in health benefits." },
    ],
  },
  {
    slug: "trees-climate-infrastructure",
    title: "Trees Are Climate Infrastructure, Not Decoration",
    icon: "TreePine",
    preview: "A single tree provides $7,000 in lifetime environmental services. Here's the economic case for botanical gardens and urban forests.",
    content: [
      { type: "p", text: "We tend to think of trees as aesthetic amenities — nice to have, but not essential. The data tells a different story. Trees are critical infrastructure that provides measurable, quantifiable benefits to public health, climate adaptation, and municipal budgets." },
      { type: "h2", text: "The Numbers" },
      { type: "p", text: "A single mature tree absorbs approximately 48 pounds of CO2 per year. Over its lifetime, it provides an estimated $7,000 worth of air quality improvement, stormwater management, energy savings, and property value increase." },
      { type: "p", text: "Urban tree canopy reduces energy costs by shading buildings — estimates show 10-30% savings on cooling costs. Trees reduce stormwater runoff by 7-12% in urban areas, reducing flood damage and the burden on municipal drainage systems." },
      { type: "h2", text: "The Equity Gap" },
      { type: "p", text: "Wealthy neighborhoods have, on average, 41% more tree canopy than low-income neighborhoods. This isn't coincidence — it's the result of decades of unequal investment. Every dollar spent on tree planting in underserved areas pays for itself many times over in reduced healthcare costs and infrastructure savings." },
      { type: "h2", text: "Botanical Gardens as Force Multipliers" },
      { type: "p", text: "Botanical gardens and conservatories don't just grow plants — they educate communities, train arborists, research climate-resilient species, and demonstrate what's possible. They're the R&D labs and training centers for urban forestry. Defunding them is cutting the pipeline for the climate solutions we need most." },
    ],
  },
];

export default function LearnPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Learn</h1>
          <p>Educational resources explaining what climate data means, why it matters, and how green spaces make a measurable difference. Written in plain English.</p>
        </div>

        {/* Glossary */}
        <div className="section">
          <h2 className="section-title">Quick Glossary</h2>
          <div className="card">
            {[
              ["AQI", "Air Quality Index — 0-500 scale measuring air pollution. Below 50 is good, above 100 is unhealthy for sensitive groups."],
              ["PM2.5", "Fine particulate matter under 2.5 micrometers. Enters bloodstream through lungs. Major health hazard."],
              ["Heat Island", "Urban area significantly warmer than surroundings due to dark surfaces and lack of vegetation."],
              ["EJ Index", "Environmental Justice Index — EPA measure of how pollution burden intersects with demographics."],
              ["Redlining", "1930s practice of denying investment to minority neighborhoods. Still predicts environmental quality today."],
              ["Tree Canopy", "Percentage of an area covered by tree crowns when viewed from above. Higher = cooler, cleaner air."],
              ["Evapotranspiration", "Process where plants release water vapor, cooling surrounding air. Trees are natural AC units."],
              ["Green Infrastructure", "Using natural systems (trees, gardens, wetlands) instead of concrete to manage heat, water, and air quality."],
            ].map(([term, def]) => (
              <div className="metric-row" key={term}>
                <span className="metric-label" style={{ fontWeight: 700, color: "var(--text)" }}>{term}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem", flex: 2, textAlign: "right" }}>{def}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="section">
          <h2 className="section-title">Articles</h2>
          <div className="grid-2">
            {ARTICLES.map((article) => (
              <Link key={article.slug} href={`/learn/${article.slug}`} className="card card-hover" style={{ textDecoration: "none" }}>
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>{(() => { const Icon = ICON_MAP[article.icon]; return Icon ? <Icon size={32} /> : null; })()}</div>
                <h3 style={{ marginBottom: 8, color: "var(--text)" }}>{article.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{article.preview}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ARTICLES, ICON_MAP };
