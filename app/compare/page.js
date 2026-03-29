"use client";
import { useState } from "react";
import { zipToCoords, getAirQuality, getWeatherData, calcOverallScore } from "../../lib/climateApi";

const EXAMPLES = [
  ["90210", "90011", "Beverly Hills vs South LA"],
  ["10001", "10451", "Midtown Manhattan vs South Bronx"],
  ["94102", "94124", "Downtown SF vs Bayview"],
  ["60614", "60621", "Lincoln Park vs Englewood (Chicago)"],
];

export default function ComparePage() {
  const [zip1, setZip1] = useState("");
  const [zip2, setZip2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function fetchOne(z) {
    const coords = await zipToCoords(z);
    if (!coords) throw new Error("Invalid ZIP");
    const [aqi, weather] = await Promise.all([getAirQuality(coords.lat, coords.lon), getWeatherData(coords.lat, coords.lon)]);
    const score = calcOverallScore(aqi, weather);
    return { coords, aqi, weather, score, zip: z };
  }

  const handleCompare = async (e) => {
    e.preventDefault();
    const c1 = zip1.trim(), c2 = zip2.trim();
    if (!/^\d{5}$/.test(c1) || !/^\d{5}$/.test(c2)) { setError("Enter two valid ZIP codes"); return; }
    if (c1 === c2) { setError("Enter two different ZIP codes"); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const [d1, d2] = await Promise.all([fetchOne(c1), fetchOne(c2)]);
      setResult({ a: d1, b: d2 });
    } catch { setError("Could not fetch data."); }
    setLoading(false);
  };

  const MetricRow = ({ label, v1, v2, unit = "", lowerBetter = true }) => {
    const n1 = parseFloat(v1) || 0, n2 = parseFloat(v2) || 0;
    const better1 = lowerBetter ? n1 <= n2 : n1 >= n2;
    const better2 = lowerBetter ? n2 <= n1 : n2 >= n1;
    return (
      <div className="metric-row">
        <span className="metric-value" style={{ flex: 1, textAlign: "center", color: n1 !== n2 ? (better1 ? "var(--accent-green)" : "var(--accent-red)") : "var(--text)" }}>{v1}{unit}</span>
        <span className="metric-label" style={{ flex: 1, textAlign: "center" }}>{label}</span>
        <span className="metric-value" style={{ flex: 1, textAlign: "center", color: n1 !== n2 ? (better2 ? "var(--accent-green)" : "var(--accent-red)") : "var(--text)" }}>{v2}{unit}</span>
      </div>
    );
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="section-label">Analysis</span>
          <h1>Compare Two Areas</h1>
          <p>See how climate vulnerability differs between neighborhoods. Expose environmental inequality with real numbers.</p>
        </div>

        <form onSubmit={handleCompare} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", maxWidth: 600, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>Area 1</label>
              <input className="input" style={{ textAlign: "center", fontSize: "1.2rem", letterSpacing: 4, fontWeight: 700 }} placeholder="ZIP" value={zip1}
                onChange={(e) => { setZip1(e.target.value.replace(/[^0-9]/g, "").slice(0, 5)); setError(""); }} maxLength={5} />
            </div>
            <span style={{ color: "var(--text-dim)", fontWeight: 900, padding: "14px 8px" }}>VS</span>
            <div style={{ flex: 1 }}>
              <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>Area 2</label>
              <input className="input" style={{ textAlign: "center", fontSize: "1.2rem", letterSpacing: 4, fontWeight: 700 }} placeholder="ZIP" value={zip2}
                onChange={(e) => { setZip2(e.target.value.replace(/[^0-9]/g, "").slice(0, 5)); setError(""); }} maxLength={5} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "..." : "Compare"}</button>
          </div>
          {error && <p className="error-msg">{error}</p>}
        </form>

        {!result && !loading && (
          <div>
            <h3 style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: 12 }}>Try these comparisons:</h3>
            {EXAMPLES.map(([z1, z2, label]) => (
              <div key={label} className="card card-hover" style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                onClick={() => { setZip1(z1); setZip2(z2); }}>
                <span>{label}</span>
                <span style={{ color: "var(--primary)", fontSize: "0.9rem" }}>{z1} vs {z2}</span>
              </div>
            ))}
            <div className="fact-card" style={{ marginTop: 24 }}>
              <div className="fact-main">Why compare?</div>
              <div className="fact-context">
                Environmental inequality is invisible until you measure it. Two neighborhoods just miles apart can have dramatically different air quality, tree canopy, and heat exposure — often tracing back to decades-old zoning and investment decisions. Comparing them with data makes the invisible visible.
              </div>
            </div>
          </div>
        )}

        {loading && <div className="loading"><div className="spinner" />Comparing areas...</div>}

        {result && (
          <>
            {/* Score comparison */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 40, margin: "32px 0" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "var(--text-muted)", marginBottom: 12 }}>{result.a.coords.city}, {result.a.coords.state}</p>
                <div className="score-circle" style={{ borderColor: result.a.score.color, margin: "0 auto" }}>
                  <span className="score-grade" style={{ color: result.a.score.color }}>{result.a.score.grade}</span>
                  <span className="score-number">{result.a.score.score}/100</span>
                </div>
              </div>
              <span style={{ color: "var(--text-dim)", fontSize: "1.5rem", fontWeight: 900 }}>VS</span>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "var(--text-muted)", marginBottom: 12 }}>{result.b.coords.city}, {result.b.coords.state}</p>
                <div className="score-circle" style={{ borderColor: result.b.score.color, margin: "0 auto" }}>
                  <span className="score-grade" style={{ color: result.b.score.color }}>{result.b.score.grade}</span>
                  <span className="score-number">{result.b.score.score}/100</span>
                </div>
              </div>
            </div>

            {/* Insight */}
            {(() => {
              const diff = Math.abs(result.a.score.score - result.b.score.score);
              const worse = result.a.score.score > result.b.score.score
                ? `${result.a.coords.city}, ${result.a.coords.state}`
                : `${result.b.coords.city}, ${result.b.coords.state}`;
              return (
                <div className="insight-banner" style={{ marginBottom: 24 }}>
                  {diff === 0
                    ? "Both areas have similar climate vulnerability."
                    : <><strong>{worse}</strong> is {diff} points more vulnerable to climate impacts than its neighbor.</>}
                </div>
              );
            })()}

            {/* Metric table */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="metric-row" style={{ borderBottom: "2px solid var(--border)" }}>
                <span style={{ flex: 1, textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600 }}>{result.a.coords.city}</span>
                <span style={{ flex: 1, textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600 }}>Metric</span>
                <span style={{ flex: 1, textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600 }}>{result.b.coords.city}</span>
              </div>
              <MetricRow label="AQI" v1={result.a.aqi.aqi} v2={result.b.aqi.aqi} />
              <MetricRow label="Temperature" v1={result.a.weather?.currentTemp} v2={result.b.weather?.currentTemp} unit="°F" />
              <MetricRow label="Feels Like" v1={result.a.weather?.feelsLike} v2={result.b.weather?.feelsLike} unit="°F" />
              <MetricRow label="UV Index" v1={result.a.weather?.uvIndex} v2={result.b.weather?.uvIndex} />
              <MetricRow label="Flood Risk" v1={result.a.weather?.floodRisk?.score || 0} v2={result.b.weather?.floodRisk?.score || 0} />
              <MetricRow label="Wind Risk" v1={result.a.weather?.windRisk?.score || 0} v2={result.b.weather?.windRisk?.score || 0} />
            </div>

            <div className="fact-card">
              <div className="fact-main">Why the difference?</div>
              <div className="fact-context">
                Climate vulnerability is shaped by tree canopy, industrial zoning, infrastructure age, income levels, and historical policy decisions. Low-income neighborhoods have 41% less tree canopy than wealthy ones — a disparity rooted in 1930s redlining. Conservatories and botanical gardens serve as critical green infrastructure that helps close this gap.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
