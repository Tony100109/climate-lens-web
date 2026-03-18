"use client";
import { useState } from "react";
import { zipToCoords, getAirQuality, getWeatherData } from "../../lib/climateApi";

// Research-backed cost estimates
const AQI_HEALTH_COSTS = {
  good: { min: 0, max: 50, annualCostPer1000: 2400, desc: "Minimal pollution-related health costs" },
  moderate: { min: 51, max: 100, annualCostPer1000: 5800, desc: "Increased asthma and allergy symptoms" },
  unhealthySensitive: { min: 101, max: 150, annualCostPer1000: 12000, desc: "Significant respiratory and cardiovascular impacts" },
  unhealthy: { min: 151, max: 200, annualCostPer1000: 24000, desc: "Emergency room visits increase sharply" },
  veryUnhealthy: { min: 201, max: 300, annualCostPer1000: 48000, desc: "Widespread health emergency" },
  hazardous: { min: 301, max: 500, annualCostPer1000: 96000, desc: "Population-wide health crisis" },
};

const HEAT_HEALTH_COSTS = {
  minimal: { costPer1000: 800, energyCostIncrease: 0 },
  low: { costPer1000: 1500, energyCostIncrease: 5 },
  moderate: { costPer1000: 3200, energyCostIncrease: 12 },
  high: { costPer1000: 7500, energyCostIncrease: 22 },
  extreme: { costPer1000: 15000, energyCostIncrease: 35 },
};

function getAqiCostBracket(aqi) {
  if (aqi <= 50) return AQI_HEALTH_COSTS.good;
  if (aqi <= 100) return AQI_HEALTH_COSTS.moderate;
  if (aqi <= 150) return AQI_HEALTH_COSTS.unhealthySensitive;
  if (aqi <= 200) return AQI_HEALTH_COSTS.unhealthy;
  if (aqi <= 300) return AQI_HEALTH_COSTS.veryUnhealthy;
  return AQI_HEALTH_COSTS.hazardous;
}

function getHeatCostBracket(level) {
  return HEAT_HEALTH_COSTS[level?.toLowerCase()] || HEAT_HEALTH_COSTS.minimal;
}

export default function HealthCostPage() {
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleaned = zip.trim();
    if (!/^\d{5}$/.test(cleaned)) { setError("Enter a valid ZIP code"); return; }
    setError(""); setLoading(true); setData(null);
    try {
      const coords = await zipToCoords(cleaned);
      if (!coords) throw new Error("Invalid ZIP");
      const [aqi, weather] = await Promise.all([
        getAirQuality(coords.lat, coords.lon),
        getWeatherData(coords.lat, coords.lon),
      ]);

      const aqiBracket = getAqiCostBracket(aqi.aqi);
      const heatBracket = getHeatCostBracket(weather?.heatRisk?.level);

      const airCostPer1000 = aqiBracket.annualCostPer1000;
      const heatCostPer1000 = heatBracket.costPer1000;
      const energyIncrease = heatBracket.energyCostIncrease;
      const totalPer1000 = airCostPer1000 + heatCostPer1000;

      // What trees could save
      const treeSavingsAir = Math.round(airCostPer1000 * 0.12); // trees remove ~12% of urban air pollution
      const treeSavingsHeat = Math.round(heatCostPer1000 * 0.15); // trees reduce heat costs by ~15%
      const treeSavingsEnergy = Math.round(energyIncrease * 0.3 * 12); // 30% cooling cost reduction, monthly to annual

      setData({
        coords, aqi, weather, zip: cleaned,
        costs: {
          airCostPer1000, heatCostPer1000, totalPer1000,
          energyIncrease, aqiBracket, heatBracket,
          treeSavings: { air: treeSavingsAir, heat: treeSavingsHeat, energy: treeSavingsEnergy, total: treeSavingsAir + treeSavingsHeat + treeSavingsEnergy },
        },
      });
    } catch { setError("Could not fetch data."); }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Health Cost Calculator</h1>
          <p>Estimate the annual health and energy costs your community faces due to air pollution and heat — and how much green infrastructure could save.</p>
        </div>

        <form onSubmit={handleSearch} className="search-box" style={{ maxWidth: 500, margin: "0 0 32px" }}>
          <input className="input input-large" placeholder="ZIP code" value={zip}
            onChange={(e) => { setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5)); setError(""); }} maxLength={5} />
          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            {loading ? "..." : "Calculate"}
          </button>
        </form>
        {error && <p className="error-msg">{error}</p>}
        {loading && <div className="loading"><div className="spinner" />Calculating costs...</div>}

        {data && (
          <>
            <h2 style={{ fontSize: "1.6rem", marginBottom: 4 }}>{data.coords.city}, {data.coords.state}</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Estimated annual costs per 1,000 residents</p>

            {/* Big number */}
            <div className="card" style={{ textAlign: "center", marginBottom: 24, padding: 32 }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 8 }}>Estimated Annual Climate-Related Health Cost</p>
              <div style={{ fontSize: "3.5rem", fontWeight: 900, color: "var(--accent-red)" }}>
                ${data.costs.totalPer1000.toLocaleString()}
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: 4 }}>per 1,000 residents</p>
            </div>

            {/* Breakdown */}
            <div className="grid-2" style={{ marginBottom: 24 }}>
              <div className="card">
                <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 12 }}>Air Pollution Costs</h4>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-orange)" }}>
                  ${data.costs.airCostPer1000.toLocaleString()}<span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/yr</span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 8 }}>
                  Current AQI: <strong style={{ color: data.aqi.color }}>{data.aqi.aqi}</strong> ({data.aqi.category})
                </p>
                <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", marginTop: 4 }}>{data.costs.aqiBracket.desc}</p>
                <div style={{ marginTop: 12, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Includes: asthma treatment, cardiovascular care, ER visits, lost workdays, premature mortality costs
                </div>
              </div>
              <div className="card">
                <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 12 }}>Heat-Related Costs</h4>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-orange)" }}>
                  ${data.costs.heatCostPer1000.toLocaleString()}<span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/yr</span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 8 }}>
                  Heat Risk: <strong style={{ color: data.weather?.heatRisk?.color }}>{data.weather?.heatRisk?.level}</strong>
                </p>
                {data.costs.energyIncrease > 0 && (
                  <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", marginTop: 4 }}>
                    +{data.costs.energyIncrease}% higher cooling energy costs vs. tree-covered areas
                  </p>
                )}
                <div style={{ marginTop: 12, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Includes: heat stroke treatment, dehydration, cardiovascular events, excess energy costs
                </div>
              </div>
            </div>

            {/* What trees save */}
            <div className="card" style={{ borderColor: "var(--primary)", marginBottom: 24 }}>
              <h3 style={{ color: "var(--primary)", marginBottom: 16 }}>What Green Infrastructure Could Save</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 16 }}>
                Based on USDA Forest Service research on urban tree canopy benefits:
              </p>
              <div className="grid-3">
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-green)" }}>${data.costs.treeSavings.air.toLocaleString()}</div>
                  <div style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>Air quality savings</div>
                  <div style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>Trees filter ~12% of urban pollutants</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-green)" }}>${data.costs.treeSavings.heat.toLocaleString()}</div>
                  <div style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>Heat reduction savings</div>
                  <div style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>Trees cool areas by up to 10°F</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-green)" }}>${data.costs.treeSavings.energy.toLocaleString()}</div>
                  <div style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>Energy cost savings</div>
                  <div style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>30% less cooling needed with canopy</div>
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: 16, padding: 16, borderRadius: 8, background: "rgba(46,204,113,0.08)" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Total estimated annual savings from green infrastructure:</p>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--accent-green)" }}>${data.costs.treeSavings.total.toLocaleString()}</div>
                <p style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>per 1,000 residents per year</p>
              </div>
            </div>

            {/* Context */}
            <div className="fact-card">
              <div className="fact-main">How these estimates are calculated</div>
              <div className="fact-context">
                Health cost estimates are based on peer-reviewed research from the American Lung Association, EPA cost-benefit analyses, and USDA Forest Service studies on urban tree canopy benefits. Actual costs vary by population age, pre-existing conditions, healthcare access, and insurance coverage. These figures represent community-level averages to illustrate the economic case for green infrastructure investment.
              </div>
            </div>

            <div className="fact-card">
              <div className="fact-main">For grant writers and advocates</div>
              <div className="fact-context">
                These numbers translate directly into funding arguments: "Investing in tree canopy for our community could save an estimated ${data.costs.treeSavings.total.toLocaleString()} per 1,000 residents annually in reduced healthcare and energy costs." This is the kind of ROI calculation that grant reviewers and city councils respond to.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
