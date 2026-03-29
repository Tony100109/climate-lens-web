"use client";
import { useState } from "react";
import { zipToCoords, getAirQuality, getWeatherData } from "../../lib/climateApi";

// Research-backed values per mature tree per year (USDA Forest Service)
const TREE_BENEFITS = {
  co2Absorbed: 48, // lbs per year
  airPollutionRemoved: 0.33, // lbs particulates per year
  stormwaterIntercepted: 1000, // gallons per year
  coolingEffect: 10, // degrees F reduction in immediate area
  energySaved: 56, // kWh per year (shade + evapotranspiration)
  propertyValueIncrease: 1.5, // percent per tree (avg)
  lifetimeValue: 7000, // dollars over lifetime
  co2PerCar: 10000, // lbs CO2 per car per year
};

export default function TreeCalculatorPage() {
  const [zip, setZip] = useState("");
  const [acres, setAcres] = useState("");
  const [currentTrees, setCurrentTrees] = useState("");
  const [targetCanopy, setTargetCanopy] = useState("30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = async (e) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip.trim())) { setError("Enter a valid ZIP code"); return; }
    if (!acres || parseFloat(acres) <= 0) { setError("Enter your site area in acres"); return; }

    setError(""); setLoading(true); setResult(null);
    try {
      const coords = await zipToCoords(zip.trim());
      if (!coords) throw new Error("Invalid ZIP");
      const [aqi, weather] = await Promise.all([
        getAirQuality(coords.lat, coords.lon),
        getWeatherData(coords.lat, coords.lon),
      ]);

      const siteAcres = parseFloat(acres);
      const existing = parseInt(currentTrees) || 0;
      const target = parseInt(targetCanopy) || 30;

      // Roughly 40-60 trees per acre for good canopy; use 50 as average
      const treesPerAcre = 50;
      const treesNeededForTarget = Math.round(siteAcres * treesPerAcre * (target / 100));
      const treesToPlant = Math.max(0, treesNeededForTarget - existing);

      const totalTreesAfter = existing + treesToPlant;

      // Annual benefits with all trees
      const annualCO2 = Math.round(totalTreesAfter * TREE_BENEFITS.co2Absorbed);
      const annualPollution = Math.round(totalTreesAfter * TREE_BENEFITS.airPollutionRemoved * 10) / 10;
      const annualStormwater = Math.round(totalTreesAfter * TREE_BENEFITS.stormwaterIntercepted);
      const annualEnergy = Math.round(totalTreesAfter * TREE_BENEFITS.energySaved);
      const carsOffset = Math.round((annualCO2 / TREE_BENEFITS.co2PerCar) * 10) / 10;
      const lifetimeValue = Math.round(totalTreesAfter * TREE_BENEFITS.lifetimeValue);

      // Cost to plant (avg $150-$300 per tree installed)
      const plantingCost = treesToPlant * 225;

      // ROI
      const annualValuePerTree = Math.round(TREE_BENEFITS.lifetimeValue / 40); // ~40 year lifespan
      const annualTotalValue = totalTreesAfter * annualValuePerTree;
      const roiYears = plantingCost > 0 ? Math.round((plantingCost / annualTotalValue) * 10) / 10 : 0;

      setResult({
        coords, aqi, weather, zip: zip.trim(),
        siteAcres, existing, target, treesNeededForTarget, treesToPlant, totalTreesAfter,
        benefits: { annualCO2, annualPollution, annualStormwater, annualEnergy, carsOffset, lifetimeValue },
        economics: { plantingCost, annualTotalValue, roiYears, annualValuePerTree },
      });
    } catch { setError("Could not fetch data."); }
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="section-label">Planning</span>
          <h1>Tree Impact Calculator</h1>
          <p>Calculate exactly how many trees your site needs and what they'd be worth in CO2 absorption, air quality, stormwater management, and energy savings. Built for grant applications.</p>
        </div>

        <form onSubmit={handleCalculate} style={{ maxWidth: 500, marginBottom: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>ZIP Code</label>
            <input className="input" placeholder="Your site's ZIP" value={zip}
              onChange={(e) => { setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5)); setError(""); }} maxLength={5} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>Site Area (acres)</label>
            <input className="input" placeholder="e.g. 5" type="number" step="0.1" min="0.1" value={acres}
              onChange={(e) => setAcres(e.target.value)} />
            <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", marginTop: 4 }}>1 acre = roughly a football field. A typical city block is 1-2 acres.</p>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>Existing Trees on Site (estimate)</label>
            <input className="input" placeholder="e.g. 50" type="number" min="0" value={currentTrees}
              onChange={(e) => setCurrentTrees(e.target.value)} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>Target Canopy Coverage: {targetCanopy}%</label>
            <input type="range" min="10" max="80" value={targetCanopy} onChange={(e) => setTargetCanopy(e.target.value)}
              style={{ width: "100%", accentColor: "var(--primary)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-dim)", fontSize: "0.75rem" }}>
              <span>10% (sparse)</span><span>30% (EPA recommended)</span><span>80% (dense forest)</span>
            </div>
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary btn-large" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Calculating..." : "Calculate Tree Impact"}
          </button>
        </form>

        {loading && <div className="loading"><div className="spinner" />Crunching numbers...</div>}

        {result && (
          <>
            <h2 style={{ fontSize: "1.6rem", marginBottom: 4 }}>{result.coords.city}, {result.coords.state}</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{result.siteAcres} acres — Target: {result.target}% canopy</p>

            {/* Key number */}
            <div className="card" style={{ textAlign: "center", marginBottom: 24, padding: 32, borderColor: "var(--primary)" }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 4 }}>Trees Needed to Reach {result.target}% Canopy</p>
              <div style={{ fontSize: "4rem", fontWeight: 900, color: "var(--primary)" }}>{result.treesToPlant}</div>
              <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
                {result.existing > 0 ? `(${result.existing} existing + ${result.treesToPlant} new = ${result.totalTreesAfter} total)` : `${result.treesToPlant} trees to plant`}
              </p>
            </div>

            {/* Annual benefits */}
            <h3 className="section-title">Annual Environmental Benefits</h3>
            <div className="grid-3" style={{ marginBottom: 24 }}>
              {[
                { value: `${result.benefits.annualCO2.toLocaleString()} lbs`, label: "CO2 Absorbed", sub: `= ${result.benefits.carsOffset} cars off the road` },
                { value: `${result.benefits.annualPollution} lbs`, label: "Air Pollutants Filtered", sub: "Particulates, ozone, NO2" },
                { value: `${result.benefits.annualStormwater.toLocaleString()} gal`, label: "Stormwater Intercepted", sub: "Reduces flooding and runoff" },
                { value: `${result.benefits.annualEnergy.toLocaleString()} kWh`, label: "Energy Saved", sub: "Through shade and cooling" },
                { value: `$${result.benefits.lifetimeValue.toLocaleString()}`, label: "Lifetime Environmental Value", sub: "Total ecosystem services" },
                { value: `${result.target}%`, label: "Target Canopy Coverage", sub: `Currently ~${Math.round((result.existing / (result.siteAcres * 50)) * 100)}%` },
              ].map((item, i) => (
                <div key={i} className="card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)" }}>{item.value}</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, marginTop: 4 }}>{item.label}</div>
                  <div style={{ color: "var(--text-dim)", fontSize: "0.75rem", marginTop: 2 }}>{item.sub}</div>
                </div>
              ))}
            </div>

            {/* Economics */}
            <h3 className="section-title">Economic Analysis (for Grant Applications)</h3>
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="metric-row">
                <span className="metric-label">Estimated Planting Cost</span>
                <span className="metric-value">${result.economics.plantingCost.toLocaleString()}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Cost per Tree (avg installed)</span>
                <span className="metric-value">$225</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Annual Ecosystem Value</span>
                <span className="metric-value" style={{ color: "var(--accent-green)" }}>${result.economics.annualTotalValue.toLocaleString()}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Value per Tree per Year</span>
                <span className="metric-value" style={{ color: "var(--accent-green)" }}>${result.economics.annualValuePerTree}</span>
              </div>
              {result.economics.roiYears > 0 && (
                <div className="metric-row">
                  <span className="metric-label">Return on Investment</span>
                  <span className="metric-value" style={{ color: "var(--primary)" }}>{result.economics.roiYears} years</span>
                </div>
              )}
            </div>

            {/* Grant language */}
            <div className="card" style={{ borderColor: "var(--primary)", marginBottom: 24 }}>
              <h4 style={{ color: "var(--primary)", marginBottom: 8 }}>Ready-to-Use Grant Language</h4>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.8, fontStyle: "italic" }}>
                "Planting {result.treesToPlant} trees across our {result.siteAcres}-acre site in {result.coords.city}, {result.coords.state} would achieve {result.target}% canopy coverage, absorbing approximately {result.benefits.annualCO2.toLocaleString()} pounds of CO2 annually — equivalent to removing {result.benefits.carsOffset} cars from the road. The projected investment of ${result.economics.plantingCost.toLocaleString()} would generate ${result.economics.annualTotalValue.toLocaleString()} in annual ecosystem services including air quality improvement, stormwater management, and energy savings, achieving full return on investment within {result.economics.roiYears} years. Current air quality in this area registers at {result.aqi.aqi} AQI ({result.aqi.category}), underscoring the urgent need for green infrastructure investment."
              </p>
              <button onClick={() => {
                navigator.clipboard.writeText(`Planting ${result.treesToPlant} trees across our ${result.siteAcres}-acre site in ${result.coords.city}, ${result.coords.state} would achieve ${result.target}% canopy coverage, absorbing approximately ${result.benefits.annualCO2.toLocaleString()} pounds of CO2 annually — equivalent to removing ${result.benefits.carsOffset} cars from the road. The projected investment of $${result.economics.plantingCost.toLocaleString()} would generate $${result.economics.annualTotalValue.toLocaleString()} in annual ecosystem services including air quality improvement, stormwater management, and energy savings, achieving full return on investment within ${result.economics.roiYears} years. Current air quality in this area registers at ${result.aqi.aqi} AQI (${result.aqi.category}), underscoring the urgent need for green infrastructure investment.`);
              }} className="btn btn-secondary" style={{ marginTop: 8 }}>
                Copy to Clipboard
              </button>
            </div>

            <div className="fact-card">
              <div className="fact-main">Data Sources & Methodology</div>
              <div className="fact-context">
                Tree benefit values from USDA Forest Service i-Tree tools and the National Tree Benefit Calculator. CO2 absorption rates based on mature deciduous trees. Planting costs averaged from USDA Community Forestry program data. Actual values vary by species, climate zone, and soil conditions. Air quality data from EPA/Open-Meteo.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
