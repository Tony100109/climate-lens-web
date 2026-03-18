"use client";
import { useState } from "react";
import { zipToCoords, getAirQuality, getWeatherData, calcOverallScore } from "../../lib/climateApi";

export default function ImpactPage() {
  const [orgName, setOrgName] = useState("");
  const [siteZip, setSiteZip] = useState("");
  const [nearbyZip, setNearbyZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);

  async function fetchArea(z) {
    const coords = await zipToCoords(z);
    if (!coords) throw new Error("Invalid ZIP");
    const [aqi, weather] = await Promise.all([getAirQuality(coords.lat, coords.lon), getWeatherData(coords.lat, coords.lon)]);
    const score = calcOverallScore(aqi, weather);
    return { coords, aqi, weather, score, zip: z };
  }

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) { setError("Enter your organization name"); return; }
    if (!/^\d{5}$/.test(siteZip.trim())) { setError("Enter a valid ZIP for your site"); return; }
    if (!/^\d{5}$/.test(nearbyZip.trim())) { setError("Enter a valid nearby ZIP for comparison"); return; }
    setError(""); setLoading(true); setReport(null);
    try {
      const [site, nearby] = await Promise.all([fetchArea(siteZip.trim()), fetchArea(nearbyZip.trim())]);
      setReport({ site, nearby, orgName: orgName.trim() });
    } catch { setError("Could not fetch data."); }
    setLoading(false);
  };

  const handlePrint = () => window.print();

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Green Impact Report</h1>
          <p>Generate a data-backed report showing your conservatory, garden, or park's measurable environmental impact. Attach it to grant applications and funder presentations.</p>
        </div>

        {!report && (
          <form onSubmit={handleGenerate} style={{ maxWidth: 500 }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>Organization Name</label>
              <input className="input" placeholder="e.g. Phipps Conservatory" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>Your Site's ZIP Code</label>
              <input className="input" placeholder="ZIP of your garden/park" value={siteZip}
                onChange={(e) => { setSiteZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5)); setError(""); }} maxLength={5} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>Nearby Comparison ZIP Code</label>
              <input className="input" placeholder="A nearby area without green space" value={nearbyZip}
                onChange={(e) => { setNearbyZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5)); setError(""); }} maxLength={5} />
              <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", marginTop: 4 }}>Pick a nearby commercial or industrial area to show the contrast</p>
            </div>
            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="btn btn-primary btn-large" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Generating Report..." : "Generate Impact Report"}
            </button>
          </form>
        )}

        {loading && <div className="loading"><div className="spinner" />Generating your impact report...</div>}

        {report && (
          <div id="impact-report">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
              <div>
                <h2 style={{ fontSize: "1.6rem" }}>{report.orgName}</h2>
                <p style={{ color: "var(--text-muted)" }}>Environmental Impact Report — {new Date().toLocaleDateString()}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handlePrint} className="btn btn-secondary">Print / Save PDF</button>
                <button onClick={() => setReport(null)} className="btn btn-secondary">New Report</button>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="card" style={{ marginBottom: 24, borderLeft: "4px solid var(--primary)" }}>
              <h3 style={{ marginBottom: 8 }}>Executive Summary</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
                {report.orgName}, located in {report.site.coords.city}, {report.site.coords.state} (ZIP {report.site.zip}),
                operates in an area with a climate vulnerability score of <strong style={{ color: report.site.score.color }}>{report.site.score.grade} ({report.site.score.score}/100)</strong>.
                Compared to the nearby area of {report.nearby.coords.city} (ZIP {report.nearby.zip}), which scores <strong style={{ color: report.nearby.score.color }}>{report.nearby.score.grade} ({report.nearby.score.score}/100)</strong>,
                {report.site.score.score < report.nearby.score.score
                  ? ` the presence of green infrastructure at ${report.orgName} correlates with a ${report.nearby.score.score - report.site.score.score}-point improvement in climate vulnerability.`
                  : ` both areas face similar climate challenges, underscoring the need for continued green infrastructure investment.`}
              </p>
            </div>

            {/* Side by side */}
            <h3 className="section-title">Environmental Comparison</h3>
            <div className="grid-2" style={{ marginBottom: 24 }}>
              <div className="card">
                <h4 style={{ color: "var(--primary)", marginBottom: 12 }}>Your Site — {report.site.coords.city}</h4>
                <div className="metric-row"><span className="metric-label">Climate Score</span><span className="metric-value" style={{ color: report.site.score.color }}>{report.site.score.grade} ({report.site.score.score})</span></div>
                <div className="metric-row"><span className="metric-label">Air Quality</span><span className="metric-value" style={{ color: report.site.aqi.color }}>{report.site.aqi.aqi} AQI</span></div>
                <div className="metric-row"><span className="metric-label">Temperature</span><span className="metric-value">{report.site.weather?.currentTemp}°F</span></div>
                <div className="metric-row"><span className="metric-label">Feels Like</span><span className="metric-value">{report.site.weather?.feelsLike}°F</span></div>
                <div className="metric-row"><span className="metric-label">Heat Risk</span><span className="metric-value" style={{ color: report.site.weather?.heatRisk?.color }}>{report.site.weather?.heatRisk?.level}</span></div>
                <div className="metric-row"><span className="metric-label">Flood Risk</span><span className="metric-value" style={{ color: report.site.weather?.floodRisk?.color }}>{report.site.weather?.floodRisk?.level}</span></div>
              </div>
              <div className="card">
                <h4 style={{ color: "var(--accent-orange)", marginBottom: 12 }}>Comparison — {report.nearby.coords.city}</h4>
                <div className="metric-row"><span className="metric-label">Climate Score</span><span className="metric-value" style={{ color: report.nearby.score.color }}>{report.nearby.score.grade} ({report.nearby.score.score})</span></div>
                <div className="metric-row"><span className="metric-label">Air Quality</span><span className="metric-value" style={{ color: report.nearby.aqi.color }}>{report.nearby.aqi.aqi} AQI</span></div>
                <div className="metric-row"><span className="metric-label">Temperature</span><span className="metric-value">{report.nearby.weather?.currentTemp}°F</span></div>
                <div className="metric-row"><span className="metric-label">Feels Like</span><span className="metric-value">{report.nearby.weather?.feelsLike}°F</span></div>
                <div className="metric-row"><span className="metric-label">Heat Risk</span><span className="metric-value" style={{ color: report.nearby.weather?.heatRisk?.color }}>{report.nearby.weather?.heatRisk?.level}</span></div>
                <div className="metric-row"><span className="metric-label">Flood Risk</span><span className="metric-value" style={{ color: report.nearby.weather?.floodRisk?.color }}>{report.nearby.weather?.floodRisk?.level}</span></div>
              </div>
            </div>

            {/* Key findings */}
            <h3 className="section-title">Key Findings</h3>
            <div className="fact-card">
              <div className="fact-main">🌡️ Temperature Impact</div>
              <div className="fact-context">
                {report.site.weather && report.nearby.weather
                  ? `Your site area currently measures ${report.site.weather.currentTemp}°F compared to ${report.nearby.weather.currentTemp}°F in the comparison area. `
                  : ""}
                Research shows that urban green spaces can reduce surrounding temperatures by 2-10°F through shade and evapotranspiration.
                A single mature tree provides approximately $7,000 worth of air quality and stormwater management over its lifetime.
              </div>
            </div>
            <div className="fact-card">
              <div className="fact-main">💨 Air Quality Impact</div>
              <div className="fact-context">
                Your site area has an AQI of {report.site.aqi.aqi} ({report.site.aqi.category}) vs {report.nearby.aqi.aqi} ({report.nearby.aqi.category}) in the comparison area.
                Trees and vegetation filter particulate matter, absorb gaseous pollutants, and produce oxygen. The health cost of air pollution in the US is estimated at $150 billion annually.
              </div>
            </div>
            <div className="fact-card">
              <div className="fact-main">🌊 Stormwater Management</div>
              <div className="fact-context">
                Green spaces absorb rainfall, reducing flood risk and preventing stormwater overflow into waterways.
                One inch of floodwater can cause $25,000 in property damage. Green infrastructure is a cost-effective alternative to gray infrastructure for flood mitigation.
              </div>
            </div>

            {/* For funders */}
            <div className="card" style={{ marginTop: 24, borderLeft: "4px solid var(--accent-green)" }}>
              <h3 style={{ marginBottom: 8 }}>For Funders & Grant Reviewers</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
                This report demonstrates that {report.orgName}'s green space provides measurable environmental benefits
                to its surrounding community. Investment in green infrastructure is not merely aesthetic — it is public health
                infrastructure, climate adaptation, and environmental justice work. Continued funding ensures these benefits
                persist and expand to serve the community.
              </p>
              <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", marginTop: 12 }}>
                Data sourced from: EPA AirNow, NOAA/ECMWF via Open-Meteo, FEMA National Risk Index.
                Report generated by Climate Lens — climatelens.org
              </p>
            </div>

            {/* Relevant grants */}
            <div className="card" style={{ marginTop: 24 }}>
              <h3 style={{ marginBottom: 12 }}>Relevant Funding Opportunities</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 16 }}>Attach this report when applying to these programs:</p>
              {[
                { name: "EPA Environmental Justice Grants", url: "https://www.epa.gov/environmentaljustice/environmental-justice-grants-funding-and-technical-assistance", desc: "Federal grants for community-based EJ projects" },
                { name: "USDA Urban & Community Forestry Grants", url: "https://www.fs.usda.gov/managing-land/urban-forests/ucf", desc: "Funding for tree planting and green infrastructure" },
                { name: "NOAA Climate Resilience Grants", url: "https://www.noaa.gov/climate-funding", desc: "Competitive grants for climate adaptation projects" },
                { name: "National Recreation Foundation", url: "https://nationalrecreation.org/", desc: "Grants for parks, recreation, and conservation" },
              ].map((grant) => (
                <a key={grant.name} href={grant.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                  <div className="metric-row" style={{ cursor: "pointer" }}>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text)" }}>{grant.name}</div>
                      <div style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>{grant.desc}</div>
                    </div>
                    <span style={{ color: "var(--primary)" }}>Visit →</span>
                  </div>
                </a>
              ))}
            </div>

            {/* Cross-reference */}
            <div className="insight-banner" style={{ marginTop: 24 }}>
              <strong>Strengthen this report:</strong> Cross-reference your data with the{" "}
              <a href="https://climatevulnerabilityindex.org/" target="_blank" rel="noopener noreferrer">U.S. Climate Vulnerability Index</a>,{" "}
              <a href="https://www.epa.gov/ejscreen" target="_blank" rel="noopener noreferrer">EPA EJScreen</a>, and the{" "}
              <a href="https://screeningtool.geoplatform.gov/" target="_blank" rel="noopener noreferrer">CEJST</a> for
              additional census-tract-level data that funders recognize.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
