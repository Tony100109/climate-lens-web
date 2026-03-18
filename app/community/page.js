"use client";
import { useState, useEffect } from "react";
import { zipToCoords, getAirQuality, getWeatherData, calcOverallScore } from "../../lib/climateApi";
import { submitReport, getReports, isFirebaseConfigured } from "../../lib/firebase";

const CATEGORIES = [
  { id: "no-trees", label: "No tree canopy", desc: "Streets or blocks with little to no shade" },
  { id: "heat", label: "Extreme heat exposure", desc: "Areas with no shade structures, dark pavement, no cooling" },
  { id: "pollution", label: "Visible pollution", desc: "Smog, industrial emissions, truck routes, dust" },
  { id: "flooding", label: "Flooding or drainage", desc: "Standing water, poor drainage, flood damage" },
  { id: "infrastructure", label: "Failing infrastructure", desc: "Cracked roads, no sidewalks, missing bus shelters" },
  { id: "positive", label: "Green space working", desc: "Parks, gardens, or trees making a visible difference" },
];

// Local storage fallback when Firebase isn't configured
function getLocalReports() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("climate-lens-reports") || "[]");
  } catch { return []; }
}

function saveLocalReport(report) {
  const reports = getLocalReports();
  reports.unshift(report);
  localStorage.setItem("climate-lens-reports", JSON.stringify(reports.slice(0, 200)));
}

export default function CommunityPage() {
  const [tab, setTab] = useState("browse");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterZip, setFilterZip] = useState("");
  const [filterCat, setFilterCat] = useState("");

  // Submit form state
  const [zip, setZip] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports(zipF, catF) {
    setLoading(true);
    try {
      if (firebaseReady) {
        const data = await getReports({ zipFilter: zipF, categoryFilter: catF });
        setReports(data);
      } else {
        let local = getLocalReports();
        if (zipF) local = local.filter((r) => r.zip === zipF);
        if (catF) local = local.filter((r) => r.category === catF);
        setReports(local);
      }
    } catch {
      setReports(getLocalReports());
    }
    setLoading(false);
  }

  const handleFilter = () => {
    loadReports(filterZip.trim() || undefined, filterCat || undefined);
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setPhotos(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanZip = zip.trim();
    if (!/^\d{5}$/.test(cleanZip)) { setError("Enter a valid ZIP code"); return; }
    if (!title.trim()) { setError("Add a brief title"); return; }
    if (!category) { setError("Select a category"); return; }
    if (!description.trim()) { setError("Describe what you're seeing"); return; }

    setError(""); setSubmitting(true);
    try {
      const coords = await zipToCoords(cleanZip);
      if (!coords) throw new Error("Invalid ZIP");

      // Fetch climate data for context
      let climateData = null;
      try {
        const [aqi, weather] = await Promise.all([
          getAirQuality(coords.lat, coords.lon),
          getWeatherData(coords.lat, coords.lon),
        ]);
        const score = calcOverallScore(aqi, weather);
        climateData = { aqi: aqi.aqi, aqiCategory: aqi.category, temp: weather?.currentTemp, score: score.score, grade: score.grade };
      } catch {}

      const report = {
        zip: cleanZip,
        city: coords.city,
        state: coords.state,
        lat: coords.lat,
        lon: coords.lon,
        title: title.trim(),
        description: description.trim(),
        category,
        climateData,
        createdAt: new Date().toISOString(),
        photos: [],
      };

      if (firebaseReady) {
        await submitReport({ ...report, photos });
      } else {
        // Store locally with photo data URLs
        const photoDataUrls = [];
        for (const photo of photos) {
          const reader = new FileReader();
          const dataUrl = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(photo);
          });
          photoDataUrls.push(dataUrl);
        }
        report.photos = photoDataUrls;
        report.id = Date.now().toString();
        saveLocalReport(report);
      }

      setSubmitted(true);
      setZip(""); setTitle(""); setDescription(""); setCategory(""); setPhotos([]); setPreviews([]);
      loadReports();
    } catch (err) {
      setError("Failed to submit. Try again.");
    }
    setSubmitting(false);
  };

  const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || id;

  const timeSince = (dateStr) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Community Evidence Board</h1>
          <p>
            Government data tells part of the story. You tell the rest. Document what your
            neighborhood actually looks like — no trees, flooding, pollution, heat — and pair
            it with real environmental data. Journalists, advocates, and city councils can't
            ignore photos paired with numbers.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "2px solid var(--border)" }}>
          <button
            onClick={() => setTab("browse")}
            style={{
              padding: "12px 24px", background: "none", border: "none",
              color: tab === "browse" ? "var(--primary)" : "var(--text-muted)",
              borderBottom: tab === "browse" ? "2px solid var(--primary)" : "2px solid transparent",
              fontWeight: 600, cursor: "pointer", fontSize: "0.95rem", marginBottom: -2,
            }}
          >Browse Reports</button>
          <button
            onClick={() => { setTab("submit"); setSubmitted(false); }}
            style={{
              padding: "12px 24px", background: "none", border: "none",
              color: tab === "submit" ? "var(--primary)" : "var(--text-muted)",
              borderBottom: tab === "submit" ? "2px solid var(--primary)" : "2px solid transparent",
              fontWeight: 600, cursor: "pointer", fontSize: "0.95rem", marginBottom: -2,
            }}
          >Submit a Report</button>
        </div>

        {/* Browse */}
        {tab === "browse" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              <input className="input" style={{ maxWidth: 160 }} placeholder="Filter by ZIP"
                value={filterZip} onChange={(e) => setFilterZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))} />
              <select className="input" style={{ maxWidth: 200 }} value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
                <option value="">All categories</option>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <button onClick={handleFilter} className="btn btn-secondary">Filter</button>
              {(filterZip || filterCat) && (
                <button onClick={() => { setFilterZip(""); setFilterCat(""); loadReports(); }} className="btn btn-secondary">Clear</button>
              )}
            </div>

            {loading && <div className="loading"><div className="spinner" />Loading reports...</div>}

            {!loading && reports.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginBottom: 12 }}>No reports yet.</p>
                <p style={{ color: "var(--text-dim)", marginBottom: 20 }}>Be the first to document your neighborhood.</p>
                <button onClick={() => setTab("submit")} className="btn btn-primary">Submit a Report</button>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {reports.map((report) => (
                <div key={report.id} className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <span className="tag tag-green" style={{ marginRight: 8 }}>{report.city}, {report.state}</span>
                      <span className="tag tag-blue">{catLabel(report.category)}</span>
                    </div>
                    <span style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>
                      {report.createdAt ? timeSince(typeof report.createdAt === "string" ? report.createdAt : report.createdAt.toDate?.().toISOString() || new Date().toISOString()) : ""}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.1rem", marginBottom: 6 }}>{report.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 12 }}>{report.description}</p>

                  {/* Photos */}
                  {report.photos && report.photos.length > 0 && (
                    <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto" }}>
                      {report.photos.map((url, i) => (
                        <img key={i} src={url} alt={`Report photo ${i + 1}`}
                          style={{ width: 180, height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)" }} />
                      ))}
                    </div>
                  )}

                  {/* Climate data paired with the report */}
                  {report.climateData && (
                    <div style={{ display: "flex", gap: 16, padding: "10px 14px", background: "var(--bg-input)", borderRadius: 8, fontSize: "0.8rem" }}>
                      <span style={{ color: "var(--text-muted)" }}>AQI: <strong style={{ color: "var(--text)" }}>{report.climateData.aqi}</strong></span>
                      <span style={{ color: "var(--text-muted)" }}>Temp: <strong style={{ color: "var(--text)" }}>{report.climateData.temp}°F</strong></span>
                      <span style={{ color: "var(--text-muted)" }}>Score: <strong style={{ color: "var(--text)" }}>{report.climateData.grade} ({report.climateData.score}/100)</strong></span>
                      <span style={{ color: "var(--text-dim)" }}>ZIP {report.zip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Submit */}
        {tab === "submit" && (
          <>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <h2 style={{ marginBottom: 8 }}>Report submitted.</h2>
                <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
                  Your neighborhood's story is now paired with real climate data.
                  The more reports people submit, the harder this evidence is to ignore.
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  <button onClick={() => setSubmitted(false)} className="btn btn-primary">Submit Another</button>
                  <button onClick={() => { setTab("browse"); loadReports(); }} className="btn btn-secondary">View Reports</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>Your ZIP code</label>
                  <input className="input" placeholder="Where is this?" value={zip}
                    onChange={(e) => { setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5)); setError(""); }} maxLength={5} />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>What are you reporting?</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {CATEGORIES.map((c) => (
                      <button key={c.id} type="button"
                        onClick={() => setCategory(c.id)}
                        style={{
                          padding: "8px 14px", borderRadius: 8, border: "1px solid",
                          borderColor: category === c.id ? "var(--primary)" : "var(--border)",
                          background: category === c.id ? "rgba(46,204,113,0.1)" : "var(--bg-input)",
                          color: category === c.id ? "var(--primary)" : "var(--text-muted)",
                          cursor: "pointer", fontSize: "0.85rem", fontWeight: 500,
                        }}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  {category && (
                    <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", marginTop: 6 }}>
                      {CATEGORIES.find((c) => c.id === category)?.desc}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>Brief title</label>
                  <input className="input" placeholder="e.g. No shade on Main Street for 6 blocks" value={title}
                    onChange={(e) => setTitle(e.target.value)} maxLength={100} />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>Describe what you see</label>
                  <textarea className="input" rows={4} placeholder="What does it look like? How does it affect your daily life? How long has it been like this?"
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    style={{ resize: "vertical", minHeight: 100 }} />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block", marginBottom: 6 }}>
                    Photos (up to 3, optional but powerful)
                  </label>
                  <input type="file" accept="image/*" multiple onChange={handlePhotoChange}
                    style={{ color: "var(--text-muted)", fontSize: "0.85rem" }} />
                  {previews.length > 0 && (
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      {previews.map((src, i) => (
                        <img key={i} src={src} alt={`Preview ${i + 1}`}
                          style={{ width: 100, height: 70, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="insight-banner" style={{ marginBottom: 20, fontSize: "0.85rem" }}>
                  When you submit, we automatically fetch real-time climate data for your ZIP code and
                  attach it to your report. Your photo + the EPA/NOAA data together = evidence that's
                  hard for decision-makers to dismiss.
                </div>

                {error && <p className="error-msg" style={{ marginBottom: 12 }}>{error}</p>}

                <button type="submit" className="btn btn-primary btn-large" disabled={submitting} style={{ width: "100%" }}>
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>

                {!firebaseReady && (
                  <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", marginTop: 8, textAlign: "center" }}>
                    Reports are saved locally in your browser. To enable cloud storage for all users, connect Firebase.
                  </p>
                )}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
