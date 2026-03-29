"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Wind, Building2, Scale } from "lucide-react";
import { zipToCoords, getAirQuality, getWeatherData, calcOverallScore, getHistoricalTemp } from "../../lib/climateApi";
import { getEJScreenData } from "../../lib/ejscreen";
import { getRedliningData, HOLC_COLORS } from "../../lib/redlining";

const GLOSSARY = {
  AQI: "Air Quality Index measures how clean or polluted the air is on a 0-500 scale. Below 50 is good; above 100 is unhealthy for sensitive groups.",
  "PM2.5": "Fine particulate matter smaller than 2.5 micrometers. These particles bypass your lungs and enter your bloodstream, increasing heart disease and stroke risk.",
  "Heat Island": "Urban areas that are significantly warmer than surrounding rural areas due to dark surfaces, lack of trees, and waste heat from buildings and vehicles.",
  "UV Index": "A measure of ultraviolet radiation intensity. Above 8 means sunburn in under 15 minutes without protection.",
};

export default function LookupPage() {
  return (
    <Suspense fallback={<div className="loading"><div className="spinner" />Loading...</div>}>
      <LookupContent />
    </Suspense>
  );
}

function LookupContent() {
  const searchParams = useSearchParams();
  const initialZip = searchParams.get("zip") || "";
  const [zip, setZip] = useState(initialZip);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    if (initialZip && /^\d{5}$/.test(initialZip)) fetchData(initialZip);
  }, [initialZip]);

  async function fetchData(z) {
    setLoading(true); setError(""); setData(null);
    try {
      const coords = await zipToCoords(z);
      if (!coords) throw new Error("Invalid ZIP");
      const [aqi, weather, history, ej, redlining] = await Promise.all([
        getAirQuality(coords.lat, coords.lon),
        getWeatherData(coords.lat, coords.lon),
        getHistoricalTemp(coords.lat, coords.lon),
        getEJScreenData(coords.lat, coords.lon),
        getRedliningData(coords.city),
      ]);
      const score = calcOverallScore(aqi, weather);
      setData({ coords, aqi, weather, history, score, ej, redlining, zip: z });
    } catch { setError("Could not fetch data for this ZIP code."); }
    setLoading(false);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const cleaned = zip.trim();
    if (!/^\d{5}$/.test(cleaned)) { setError("Enter a valid 5-digit ZIP code"); return; }
    fetchData(cleaned);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="section-label">Research</span>
          <h1>Climate Data Lookup</h1>
          <p>Search any US ZIP code for real-time environmental data and educational context.</p>
        </div>

        <form onSubmit={handleSearch} className="search-box" style={{ maxWidth: 500, margin: "0 0 32px" }}>
          <input className="input input-large" placeholder="ZIP code" value={zip}
            onChange={(e) => { setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5)); setError(""); }}
            maxLength={5} />
          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
        </form>
        {error && <p className="error-msg">{error}</p>}

        {loading && <div className="loading"><div className="spinner" />Fetching climate data...</div>}

        {data && (
          <>
            <h2 style={{ fontSize: "1.8rem", marginBottom: 4 }}>{data.coords.city}, {data.coords.state}</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>ZIP {data.zip} — Updated {new Date().toLocaleString()}</p>

            {/* Overall Score */}
            <div className="card" style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 24 }}>
              <div className="score-circle" style={{ borderColor: data.score.color, flexShrink: 0 }}>
                <span className="score-grade" style={{ color: data.score.color }}>{data.score.grade}</span>
                <span className="score-number">{data.score.score}/100</span>
              </div>
              <div>
                <h3 style={{ fontSize: "1.3rem", marginBottom: 4 }}>Climate Vulnerability Score</h3>
                <p style={{ color: data.score.color, fontWeight: 600, marginBottom: 8 }}>{data.score.desc}</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  This score combines air quality, heat risk, flood risk, and environmental justice data
                  into a single measure of how vulnerable this area is to climate impacts. Higher = more vulnerable.
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid-2" style={{ marginBottom: 24 }}>
              <div className="card">
                <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 12 }}>
                  Air Quality <button onClick={() => setTooltip(tooltip === "AQI" ? null : "AQI")} style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "0.8rem" }}>[?]</button>
                </h4>
                {tooltip === "AQI" && <div className="insight-banner" style={{ marginBottom: 12, fontSize: "0.85rem" }}>{GLOSSARY.AQI}</div>}
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: data.aqi.color }}>{data.aqi.aqi} <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>AQI</span></div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{data.aqi.category}</p>
                {data.aqi.pollutants && Object.keys(data.aqi.pollutants).length > 0 && (
                  <div style={{ marginTop: 12, display: "flex", gap: 16 }}>
                    {Object.entries(data.aqi.pollutants).map(([k, v]) => (
                      <div key={k} style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: 700 }}>{v}</div>
                        <div style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>
                          <button onClick={() => setTooltip(tooltip === k ? null : k)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", fontSize: "0.75rem", textTransform: "uppercase" }}>{k}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {tooltip === "pm25" && <div className="insight-banner" style={{ marginTop: 8, fontSize: "0.85rem" }}>{GLOSSARY["PM2.5"]}</div>}
              </div>

              <div className="card">
                <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 12 }}>Temperature</h4>
                {data.weather && (
                  <>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800 }}>{data.weather.currentTemp}°F</div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Feels like {data.weather.feelsLike}°F</p>
                    <div style={{ marginTop: 12 }}>
                      <div className="metric-row">
                        <span className="metric-label">Heat Risk</span>
                        <span className="metric-value" style={{ color: data.weather.heatRisk?.color }}>{data.weather.heatRisk?.level}</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Humidity</span>
                        <span className="metric-value">{data.weather.humidity}%</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">
                          UV Index <button onClick={() => setTooltip(tooltip === "UV" ? null : "UV")} style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "0.8rem" }}>[?]</button>
                        </span>
                        <span className="metric-value">{data.weather.uvIndex}</span>
                      </div>
                      {tooltip === "UV" && <div className="insight-banner" style={{ fontSize: "0.85rem" }}>{GLOSSARY["UV Index"]}</div>}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid-2" style={{ marginBottom: 24 }}>
              <div className="card">
                <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 12 }}>Flood Risk</h4>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: data.weather?.floodRisk?.color }}>{data.weather?.floodRisk?.level || "--"}</div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 4 }}>Based on 7-day precipitation forecast</p>
              </div>
              <div className="card">
                <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 12 }}>Wind Risk</h4>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: data.weather?.windRisk?.color }}>{data.weather?.windRisk?.level || "--"}</div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 4 }}>Based on 7-day wind speed forecast</p>
              </div>
            </div>

            {/* Historical trend */}
            {data.history?.yearly?.length > 0 && (
              <div className="card" style={{ marginBottom: 24 }}>
                <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 4 }}>10-Year Temperature Trend</h4>
                <p style={{ color: data.history.trend > 0 ? "var(--accent-red)" : "var(--accent-green)", fontWeight: 700, fontSize: "1.1rem", marginBottom: 16 }}>
                  {data.history.trend > 0 ? "+" : ""}{data.history.trend}°F over the past decade
                </p>
                <div className="bar-chart">
                  {data.history.yearly.map((yr) => {
                    const min = Math.min(...data.history.yearly.map(y => y.avg));
                    const max = Math.max(...data.history.yearly.map(y => y.avg));
                    const range = max - min || 1;
                    const height = ((yr.avg - min) / range) * 120 + 10;
                    return (
                      <div key={yr.year} className="bar-col">
                        <div className="bar-value">{yr.avg}°</div>
                        <div className="bar" style={{ height, backgroundColor: yr.avg > (min + max) / 2 ? "#ff7e00" : "#4a90d9" }} />
                        <div className="bar-label">{String(yr.year).slice(-2)}</div>
                      </div>
                    );
                  })}
                </div>
                {data.history.trend > 0 && (
                  <div className="fact-card" style={{ marginTop: 16 }}>
                    <div className="fact-main">What this means</div>
                    <div className="fact-context">
                      Your area has warmed by {data.history.trend}°F over the last decade.
                      {data.history.trend >= 2
                        ? " This is a significant increase that affects public health, energy costs, and local ecosystems. Urban heat islands amplify this effect — areas without tree canopy can be 15-20°F hotter than nearby green spaces."
                        : " While modest, this trend compounds over time. Even small increases stress infrastructure, raise cooling costs, and worsen air quality on hot days."}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* EJScreen Data */}
            {data.ej && (
              <div className="card" style={{ marginBottom: 24 }}>
                <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 12 }}>
                  EPA Environmental Justice Data
                  <button onClick={() => setTooltip(tooltip === "EJ" ? null : "EJ")} style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "0.8rem", marginLeft: 8 }}>[?]</button>
                </h4>
                {tooltip === "EJ" && (
                  <div className="insight-banner" style={{ marginBottom: 12, fontSize: "0.85rem" }}>
                    EJScreen is the EPA's environmental justice mapping tool. It combines environmental indicators (pollution, proximity to hazards) with demographic data (income, race) to identify communities facing disproportionate environmental burdens.
                  </div>
                )}
                {data.ej.available ? (
                  <>
                    {data.ej.demographics && (
                      <div style={{ marginBottom: 16 }}>
                        <h5 style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: 8 }}>Demographics</h5>
                        <div className="grid-3">
                          {data.ej.demographics.pctMinority != null && (
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>{data.ej.demographics.pctMinority}%</div>
                              <div style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>Minority</div>
                            </div>
                          )}
                          {data.ej.demographics.pctLowIncome != null && (
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>{data.ej.demographics.pctLowIncome}%</div>
                              <div style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>Low Income</div>
                            </div>
                          )}
                          {data.ej.demographics.population != null && (
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: "1.8rem", fontWeight: 800 }}>{data.ej.demographics.population.toLocaleString()}</div>
                              <div style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>Population</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {data.ej.ejIndices && (
                      <div>
                        <h5 style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: 8 }}>EJ Index Percentiles (higher = more burdened)</h5>
                        {Object.entries(data.ej.ejIndices).filter(([, v]) => v != null).map(([key, val]) => (
                          <div key={key} className="metric-row">
                            <span className="metric-label">{data.ej.indicators[key]?.label || key}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 100, height: 8, borderRadius: 4, background: "var(--border)", overflow: "hidden" }}>
                                <div style={{ width: `${val}%`, height: "100%", borderRadius: 4, background: val > 80 ? "var(--accent-red)" : val > 50 ? "var(--accent-orange)" : "var(--accent-green)" }} />
                              </div>
                              <span className="metric-value" style={{ color: val > 80 ? "var(--accent-red)" : val > 50 ? "var(--accent-orange)" : "var(--accent-green)", minWidth: 40 }}>{val}th</span>
                            </div>
                          </div>
                        ))}
                        <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", marginTop: 8 }}>
                          Percentile relative to all US census block groups. 90th means this area is more burdened than 90% of the country.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="insight-banner">
                    <p style={{ fontSize: "0.9rem" }}>{data.ej.note}</p>
                    <a href="https://screening-tools.com/epa-ejscreen" target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.85rem" }}>Access archived EJScreen data →</a>
                  </div>
                )}
              </div>
            )}

            {/* Redlining History */}
            {data.redlining && (
              <div className="card" style={{ marginBottom: 24 }}>
                <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 12 }}>
                  Historical Redlining — {data.coords.city}
                  <button onClick={() => setTooltip(tooltip === "redlining" ? null : "redlining")} style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "0.8rem", marginLeft: 8 }}>[?]</button>
                </h4>
                {tooltip === "redlining" && (
                  <div className="insight-banner" style={{ marginBottom: 12, fontSize: "0.85rem" }}>
                    In the 1930s, the Home Owners' Loan Corporation (HOLC) graded neighborhoods A through D. "D" neighborhoods — outlined in red — were denied loans and investment. These were predominantly Black and immigrant communities. Today, formerly redlined areas have worse air quality, less tree cover, and higher temperatures.
                  </div>
                )}
                {data.redlining.available ? (
                  <>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 16 }}>
                      {data.coords.city} was mapped by HOLC with <strong>{data.redlining.summary.totalNeighborhoods}</strong> graded neighborhoods.
                      <strong style={{ color: "var(--accent-red)" }}> {data.redlining.summary.percentRedlined}%</strong> were graded C or D (declining/hazardous).
                    </p>
                    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                      {Object.entries(data.redlining.summary.grades).map(([grade, count]) => (
                        <div key={grade} style={{ flex: 1, textAlign: "center", padding: 12, borderRadius: 8, background: `${HOLC_COLORS[grade].color}15`, border: `1px solid ${HOLC_COLORS[grade].color}30` }}>
                          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: HOLC_COLORS[grade].color }}>{count}</div>
                          <div style={{ fontSize: "0.75rem", color: HOLC_COLORS[grade].color }}>{HOLC_COLORS[grade].label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="fact-card">
                      <div className="fact-main">The connection to today</div>
                      <div className="fact-context">
                        Research shows that neighborhoods graded "D" (redlined) in the 1930s are today an average of 5°F hotter, have 23% less tree canopy, and have significantly higher rates of asthma and heart disease than "A"-graded neighborhoods in the same city. The lines drawn 90 years ago still predict who breathes clean air and who doesn't.
                      </div>
                    </div>
                    <a href={`https://dsl.richmond.edu/panorama/redlining/map`} target="_blank" rel="noopener noreferrer"
                      className="btn btn-secondary" style={{ marginTop: 12, width: "100%", textAlign: "center" }}>
                      View Full Interactive Map — Mapping Inequality Project →
                    </a>
                    <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", marginTop: 8 }}>
                      Data from the Mapping Inequality project, University of Richmond. Digital Scholarship Lab.
                    </p>
                  </>
                ) : (
                  <div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 12 }}>{data.redlining.note}</p>
                    {data.redlining.allCities && (
                      <details style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
                        <summary style={{ cursor: "pointer", color: "var(--primary)" }}>Cities with redlining data ({data.redlining.allCities.length})</summary>
                        <p style={{ marginTop: 8, lineHeight: 1.8 }}>{data.redlining.allCities.join(", ")}</p>
                      </details>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Educational context */}
            <div className="section">
              <h3 className="section-title">Understanding Your Data</h3>
              <div className="fact-card">
                <div className="fact-main"><Wind size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} /> About Air Quality Index (AQI)</div>
                <div className="fact-context">{GLOSSARY.AQI} The EPA calculates AQI from five pollutants: ground-level ozone, particulate matter, carbon monoxide, sulfur dioxide, and nitrogen dioxide.</div>
              </div>
              <div className="fact-card">
                <div className="fact-main"><Building2 size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} /> About Heat Islands</div>
                <div className="fact-context">{GLOSSARY["Heat Island"]} A single mature tree can cool surrounding air by up to 10°F through shade and evapotranspiration — this is why botanical gardens and conservatories are critical climate infrastructure.</div>
              </div>
              <div className="fact-card">
                <div className="fact-main"><Scale size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} /> About Environmental Justice</div>
                <div className="fact-context">Low-income neighborhoods have 41% less tree canopy than wealthy ones. This disparity traces directly to 1930s redlining policies that determined which neighborhoods received investment. The effects persist today in temperature, air quality, and health outcomes.</div>
              </div>
            </div>

            <div style={{ marginTop: 24, color: "var(--text-dim)", fontSize: "0.85rem" }}>
              Data sources: EPA AirNow, EPA EJScreen, NOAA/ECMWF via Open-Meteo, Mapping Inequality (University of Richmond)
            </div>
          </>
        )}
      </div>
    </div>
  );
}
