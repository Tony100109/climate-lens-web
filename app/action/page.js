"use client";
import { useState } from "react";
import { Landmark, MapPin, Building2, TreePine, FileText, Newspaper } from "lucide-react";
import { zipToCoords, getAirQuality, getWeatherData, calcOverallScore } from "../../lib/climateApi";

export default function ActionPage() {
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSocial, setCopiedSocial] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleaned = zip.trim();
    if (!/^\d{5}$/.test(cleaned)) { setError("Enter a valid ZIP code"); return; }
    setError(""); setLoading(true); setData(null);
    try {
      const coords = await zipToCoords(cleaned);
      if (!coords) throw new Error("Invalid");
      const [aqi, weather] = await Promise.all([getAirQuality(coords.lat, coords.lon), getWeatherData(coords.lat, coords.lon)]);
      const score = calcOverallScore(aqi, weather);
      setData({ coords, aqi, weather, score, zip: cleaned });
    } catch { setError("Could not fetch data."); }
    setLoading(false);
  };

  const area = data ? `${data.coords.city}, ${data.coords.state}` : "";

  const emailBody = data ? `Dear Representative,

I am writing as a concerned resident of ${area} to bring your attention to the climate vulnerabilities facing our community.

According to real-time environmental data from EPA and NOAA sources, our area currently has:

- An Air Quality Index of ${data.aqi.aqi} (${data.aqi.category})
- A temperature that feels like ${data.weather?.feelsLike}°F
- An overall climate vulnerability score of ${data.score.score}/100 (Grade: ${data.score.grade})

This data shows that our community faces ${data.score.desc.toLowerCase()}.

I urge you to:
1. Support investments in urban tree canopy and green infrastructure
2. Advocate for stricter air quality standards
3. Ensure our community has adequate cooling centers and heat action plans
4. Prioritize environmental justice in infrastructure planning

Climate change is affecting our neighborhood right now. I hope you will take action to protect our community.

Sincerely,
A Concerned Resident of ${area}

Data provided by Climate Lens (climatelens.org)` : "";

  const socialPost = data
    ? `My neighborhood (${area}) has a climate vulnerability score of ${data.score.grade} (${data.score.score}/100). Air quality is ${data.aqi.aqi} AQI right now. Check your area at Climate Lens. #ClimateLens #ClimateJustice #EnvironmentalJustice`
    : "";

  const copyText = async (text, setter) => {
    try { await navigator.clipboard.writeText(text); setter(true); setTimeout(() => setter(false), 2000); } catch {}
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Take Action</h1>
          <p>Your data is powerful. Use it to demand change in your community.</p>
        </div>

        <form onSubmit={handleSearch} className="search-box" style={{ maxWidth: 500, margin: "0 0 32px" }}>
          <input className="input input-large" placeholder="ZIP code" value={zip}
            onChange={(e) => { setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5)); setError(""); }} maxLength={5} />
          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            {loading ? "..." : "Go"}
          </button>
        </form>
        {error && <p className="error-msg">{error}</p>}
        {loading && <div className="loading"><div className="spinner" />Loading...</div>}

        {!data && !loading && (
          <div>
            <h3 className="section-title">Even without data, you can act now:</h3>
            <div className="grid-2">
              {[
                { icon: Landmark, title: "Find Your U.S. Representative", url: "https://www.house.gov/representatives/find-your-representative" },
                { icon: Landmark, title: "Find Your U.S. Senators", url: "https://www.senate.gov/senators/senators-contact.htm" },
                { icon: MapPin, title: "Find State Legislators", url: "https://openstates.org/find_your_legislator/" },
                { icon: Building2, title: "Find Local Officials", url: "https://www.usa.gov/elected-officials" },
              ].map((link) => (
                <a key={link.title} href={link.url} target="_blank" rel="noopener noreferrer" className="card card-hover" style={{ textDecoration: "none" }}>
                  <span style={{ marginRight: 12 }}><link.icon size={24} /></span>
                  <span style={{ color: "var(--text)" }}>{link.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {data && (
          <>
            {/* Summary */}
            <div className="card" style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32 }}>
              <div className="score-circle" style={{ borderColor: data.score.color, flexShrink: 0, width: 100, height: 100 }}>
                <span className="score-grade" style={{ color: data.score.color, fontSize: "2rem" }}>{data.score.grade}</span>
                <span className="score-number" style={{ fontSize: "0.75rem" }}>{data.score.score}/100</span>
              </div>
              <div>
                <h3>{area}</h3>
                <p style={{ color: data.score.color, fontWeight: 600 }}>{data.score.desc}</p>
              </div>
            </div>

            {/* Step 1: Find reps */}
            <div className="step-row"><div className="step-number">1</div><h3>Find Your Representatives</h3></div>
            <div className="grid-2" style={{ marginBottom: 24 }}>
              {[
                { title: "U.S. Representative", url: "https://www.house.gov/representatives/find-your-representative" },
                { title: "U.S. Senators", url: "https://www.senate.gov/senators/senators-contact.htm" },
                { title: "State Legislators", url: `https://openstates.org/find_your_legislator/?address=${data.zip}` },
                { title: "Local Officials", url: "https://www.usa.gov/elected-officials" },
              ].map((link) => (
                <a key={link.title} href={link.url} target="_blank" rel="noopener noreferrer" className="card card-hover" style={{ textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text)" }}>{link.title}</span>
                  <span style={{ color: "var(--primary)" }}>Find →</span>
                </a>
              ))}
            </div>

            {/* Step 2: Email */}
            <div className="step-row"><div className="step-number">2</div><h3>Send a Data-Backed Email</h3></div>
            <div className="card" style={{ marginBottom: 24 }}>
              <pre style={{ whiteSpace: "pre-wrap", color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.7, maxHeight: 300, overflow: "auto" }}>
                {emailBody}
              </pre>
              <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
                <button onClick={() => copyText(emailBody, setCopiedEmail)} className="btn btn-secondary">
                  {copiedEmail ? "Copied!" : "Copy Email"}
                </button>
                <a href={`mailto:?subject=${encodeURIComponent(`Climate Vulnerability Concerns in ${area}`)}&body=${encodeURIComponent(emailBody)}`}
                  className="btn btn-primary">Open in Email App</a>
              </div>
            </div>

            {/* Step 3: Share */}
            <div className="step-row"><div className="step-number">3</div><h3>Share on Social Media</h3></div>
            <div className="card" style={{ marginBottom: 24 }}>
              <p style={{ color: "var(--text-muted)", fontStyle: "italic", marginBottom: 12 }}>{socialPost}</p>
              <button onClick={() => copyText(socialPost, setCopiedSocial)} className="btn btn-secondary">
                {copiedSocial ? "Copied!" : "Copy Post"}
              </button>
            </div>

            {/* Step 4: More */}
            <div className="step-row"><div className="step-number">4</div><h3>Go Further</h3></div>
            <div className="grid-2">
              {[
                { icon: Landmark, title: "Attend a City Council Meeting", desc: "Bring your Climate Lens data. Public comment periods are your right." },
                { icon: TreePine, title: "Join a Tree Planting Event", desc: "Trees reduce heat islands by up to 10°F and filter pollutants." },
                { icon: FileText, title: "Start a Petition", desc: "Use your data to petition for green infrastructure in underserved areas." },
                { icon: Newspaper, title: "Contact Local Media", desc: "Pitch your findings to local news. Data-driven stories get covered." },
              ].map((item) => (
                <div key={item.title} className="card">
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span><item.icon size={24} /></span>
                    <div>
                      <h4 style={{ marginBottom: 4 }}>{item.title}</h4>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
