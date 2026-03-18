"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { zipToCoords, getAirQuality, getWeatherData, calcOverallScore, getHistoricalTemp } from "../../lib/climateApi";

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
      const [aqi, weather, history] = await Promise.all([
        getAirQuality(coords.lat, coords.lon),
        getWeatherData(coords.lat, coords.lon),
        getHistoricalTemp(coords.lat, coords.lon),
      ]);
      const score = calcOverallScore(aqi, weather);
      setData({ coords, aqi, weather, history, score, zip: z });
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

            {/* Educational context */}
            <div className="section">
              <h3 className="section-title">Understanding Your Data</h3>
              <div className="fact-card">
                <div className="fact-main">💨 About Air Quality Index (AQI)</div>
                <div className="fact-context">{GLOSSARY.AQI} The EPA calculates AQI from five pollutants: ground-level ozone, particulate matter, carbon monoxide, sulfur dioxide, and nitrogen dioxide.</div>
              </div>
              <div className="fact-card">
                <div className="fact-main">🏙️ About Heat Islands</div>
                <div className="fact-context">{GLOSSARY["Heat Island"]} A single mature tree can cool surrounding air by up to 10°F through shade and evapotranspiration — this is why botanical gardens and conservatories are critical climate infrastructure.</div>
              </div>
              <div className="fact-card">
                <div className="fact-main">⚖️ About Environmental Justice</div>
                <div className="fact-context">Low-income neighborhoods have 41% less tree canopy than wealthy ones. This disparity traces directly to 1930s redlining policies that determined which neighborhoods received investment. The effects persist today in temperature, air quality, and health outcomes.</div>
              </div>
            </div>

            <div style={{ marginTop: 24, color: "var(--text-dim)", fontSize: "0.85rem" }}>
              Data sources: EPA AirNow, Open-Meteo (NOAA/ECMWF), Open-Meteo Air Quality, Open-Meteo Archive
            </div>
          </>
        )}
      </div>
    </div>
  );
}
