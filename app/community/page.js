"use client";
import { useState, useEffect } from "react";
import { Camera, ThumbsUp, AlertTriangle, MapPin, FileText, Share2, Filter, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { zipToCoords, getAirQuality, getWeatherData, calcOverallScore } from "../../lib/climateApi";
import { submitReport, getReports, getZipStats, upvoteReport, isFirebaseConfigured } from "../../lib/firebase";

const CATEGORIES = [
  { id: "no-trees", label: "No tree canopy", desc: "Streets or blocks with little to no shade" },
  { id: "heat", label: "Extreme heat", desc: "No shade structures, dark pavement, no cooling centers nearby" },
  { id: "pollution", label: "Visible pollution", desc: "Smog, industrial emissions, truck routes, dust, odor" },
  { id: "flooding", label: "Flooding / drainage", desc: "Standing water, poor drainage, flood damage" },
  { id: "infrastructure", label: "Failing infrastructure", desc: "Cracked roads, no sidewalks, missing bus shelters" },
  { id: "health", label: "Health impact", desc: "Asthma clusters, heat illness, contaminated water" },
  { id: "positive", label: "Green space working", desc: "Parks, gardens, or trees making a visible difference" },
];

const URGENCY = [
  { id: "low", label: "Low", color: "#40916c", desc: "Worth noting" },
  { id: "moderate", label: "Moderate", color: "#bc6c25", desc: "Ongoing problem" },
  { id: "high", label: "High", color: "#e76f51", desc: "Affecting daily life" },
  { id: "critical", label: "Critical", color: "#c1121f", desc: "Immediate danger or health risk" },
];

function getLocalReports() {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("climate-lens-reports") || "[]"); } catch { return []; }
}

function saveLocalReport(report) {
  const reports = getLocalReports();
  reports.unshift(report);
  localStorage.setItem("climate-lens-reports", JSON.stringify(reports.slice(0, 200)));
}

function getLocalUpvotes() {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem("climate-lens-upvotes") || "{}"); } catch { return {}; }
}

function saveLocalUpvote(id) {
  const upvotes = getLocalUpvotes();
  upvotes[id] = true;
  localStorage.setItem("climate-lens-upvotes", JSON.stringify(upvotes));
}

function compressAndEncode(file) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.onload = () => {
      const maxW = 400;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.5));
    };
    img.onerror = () => resolve(null);
    img.src = URL.createObjectURL(file);
  });
}

export default function CommunityPage() {
  const [tab, setTab] = useState("browse");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterZip, setFilterZip] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedReport, setExpandedReport] = useState(null);
  const [localUpvotes, setLocalUpvotes] = useState({});
  const [zipStatsData, setZipStatsData] = useState(null);
  const [statsZip, setStatsZip] = useState("");
  const [statsLoading, setStatsLoading] = useState(false);

  // Submit form
  const [zip, setZip] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("moderate");
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    setLocalUpvotes(getLocalUpvotes());
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
    } catch { setReports(getLocalReports()); }
    setLoading(false);
  }

  const handleFilter = () => loadReports(filterZip.trim() || undefined, filterCat || undefined);

  const handleUpvote = async (reportId) => {
    if (localUpvotes[reportId]) return;
    try {
      if (firebaseReady) await upvoteReport(reportId);
      setReports((prev) => prev.map((r) => r.id === reportId ? { ...r, upvotes: (r.upvotes || 0) + 1 } : r));
      saveLocalUpvote(reportId);
      setLocalUpvotes((prev) => ({ ...prev, [reportId]: true }));
    } catch {}
  };

  const handleLoadStats = async () => {
    const z = statsZip.trim();
    if (!/^\d{5}$/.test(z)) return;
    setStatsLoading(true);
    try {
      if (firebaseReady) {
        const stats = await getZipStats(z);
        setZipStatsData(stats);
      } else {
        const local = getLocalReports().filter((r) => r.zip === z);
        if (local.length === 0) { setZipStatsData(null); } else {
          const cats = {};
          let totalUpvotes = 0, urgentCount = 0;
          local.forEach((r) => {
            cats[r.category] = (cats[r.category] || 0) + 1;
            totalUpvotes += r.upvotes || 0;
            if (r.urgency === "critical" || r.urgency === "high") urgentCount++;
          });
          setZipStatsData({ totalReports: local.length, categories: cats, totalUpvotes, urgentCount, topCategory: Object.entries(cats).sort((a, b) => b[1] - a[1])[0]?.[0], reports: local });
        }
      }
    } catch { setZipStatsData(null); }
    setStatsLoading(false);
  };

  const sortedReports = [...reports].sort((a, b) => {
    if (sortBy === "upvotes") return (b.upvotes || 0) - (a.upvotes || 0);
    if (sortBy === "urgent") {
      const order = { critical: 4, high: 3, moderate: 2, low: 1 };
      return (order[b.urgency] || 2) - (order[a.urgency] || 2);
    }
    return 0; // default: newest (already sorted by Firestore)
  });

  const generateAdvocacyText = (report) => {
    const climate = report.climateData;
    return `COMMUNITY REPORT: ${report.title}
Location: ${report.city}, ${report.state} (ZIP ${report.zip})
Category: ${catLabel(report.category)}
Urgency: ${report.urgency || "moderate"}
${climate ? `\nEnvironmental data at time of report:\n- Air Quality Index: ${climate.aqi} (${climate.aqiCategory})\n- Temperature: ${climate.temp}°F\n- Climate Vulnerability Score: ${climate.grade} (${climate.score}/100)` : ""}

Resident description:
"${report.description}"

${report.upvotes ? `${report.upvotes} community members have confirmed this issue.` : ""}

This report was submitted through Climate Lens (climatelens.org), a tool that pairs community observations with real-time EPA and NOAA data. We urge you to investigate and take action.`;
  };

  const copyAdvocacy = async (report) => {
    try { await navigator.clipboard.writeText(generateAdvocacyText(report)); } catch {}
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

      let climateData = null;
      try {
        const [aqi, weather] = await Promise.all([getAirQuality(coords.lat, coords.lon), getWeatherData(coords.lat, coords.lon)]);
        const score = calcOverallScore(aqi, weather);
        climateData = { aqi: aqi.aqi, aqiCategory: aqi.category, temp: weather?.currentTemp, feelsLike: weather?.feelsLike, humidity: weather?.humidity, score: score.score, grade: score.grade };
      } catch {}

      const photoDataUrls = [];
      for (const photo of photos.slice(0, 3)) {
        const dataUrl = await compressAndEncode(photo);
        if (dataUrl) photoDataUrls.push(dataUrl);
      }

      const report = {
        zip: cleanZip, city: coords.city, state: coords.state,
        lat: coords.lat, lon: coords.lon,
        title: title.trim(), description: description.trim(),
        category, urgency, climateData, photos: photoDataUrls,
        createdAt: new Date().toISOString(), upvotes: 0, status: "open",
      };

      if (firebaseReady) {
        await submitReport({ ...report, photos: [] });
      } else {
        report.id = Date.now().toString();
        saveLocalReport(report);
      }

      setSubmitted(true);
      setZip(""); setTitle(""); setDescription(""); setCategory(""); setUrgency("moderate"); setPhotos([]); setPreviews([]);
      loadReports();
    } catch { setError("Failed to submit. Try again."); }
    setSubmitting(false);
  };

  const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || id;
  const urgencyInfo = (id) => URGENCY.find((u) => u.id === id) || URGENCY[1];

  const timeSince = (dateStr) => {
    if (!dateStr) return "";
    const d = typeof dateStr === "string" ? dateStr : dateStr.toDate?.()?.toISOString() || new Date().toISOString();
    const seconds = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="section-label">Community</span>
          <h1>Community Evidence Board</h1>
          <p>
            Government sensors can't see a street with no shade, a flooded intersection, or the
            smell from a factory at 6am. You can. Document it here, and we'll attach the federal
            data automatically. Photos + numbers = evidence that's hard to ignore.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 28, borderBottom: "2px solid var(--border)" }}>
          {[
            { id: "browse", label: "Browse Reports" },
            { id: "submit", label: "Submit a Report" },
            { id: "stats", label: "ZIP Summary" },
          ].map((t) => (
            <button key={t.id} onClick={() => { setTab(t.id); if (t.id === "submit") setSubmitted(false); }}
              style={{
                padding: "10px 20px", background: "none", border: "none",
                color: tab === t.id ? "var(--primary)" : "var(--text-muted)",
                borderBottom: tab === t.id ? "2px solid var(--primary)" : "2px solid transparent",
                fontWeight: 600, cursor: "pointer", fontSize: "0.9rem", marginBottom: -2,
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== BROWSE ===== */}
        {tab === "browse" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <Filter size={16} style={{ color: "var(--text-dim)" }} />
              <input className="input" style={{ maxWidth: 140, padding: "8px 12px", fontSize: "0.85rem" }} placeholder="ZIP"
                value={filterZip} onChange={(e) => setFilterZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))} />
              <select className="input" style={{ maxWidth: 180, padding: "8px 12px", fontSize: "0.85rem" }} value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
                <option value="">All categories</option>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <select className="input" style={{ maxWidth: 150, padding: "8px 12px", fontSize: "0.85rem" }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest first</option>
                <option value="upvotes">Most confirmed</option>
                <option value="urgent">Most urgent</option>
              </select>
              <button onClick={handleFilter} className="btn btn-secondary" style={{ padding: "8px 14px", fontSize: "0.85rem" }}>Apply</button>
              {(filterZip || filterCat) && (
                <button onClick={() => { setFilterZip(""); setFilterCat(""); loadReports(); }} style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "0.85rem" }}>Clear</button>
              )}
            </div>

            {loading && <div className="loading"><div className="spinner" />Loading reports...</div>}

            {!loading && reports.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: 10 }}>No reports yet.</p>
                <p style={{ color: "var(--text-dim)", marginBottom: 16, fontSize: "0.9rem" }}>Be the first to document your neighborhood.</p>
                <button onClick={() => setTab("submit")} className="btn btn-primary">Submit a Report</button>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {sortedReports.map((report) => {
                const urg = urgencyInfo(report.urgency);
                const expanded = expandedReport === report.id;
                return (
                  <div key={report.id} className="card" style={{ borderLeft: `3px solid ${urg.color}` }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                        <span className="tag tag-green" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={11} /> {report.city}, {report.state}
                        </span>
                        <span className="tag tag-blue">{catLabel(report.category)}</span>
                        <span className="tag" style={{ background: `${urg.color}15`, color: urg.color }}>
                          {urg.label}
                        </span>
                      </div>
                      <span style={{ color: "var(--text-dim)", fontSize: "0.75rem", flexShrink: 0 }}>
                        {timeSince(report.createdAt)}
                      </span>
                    </div>

                    {/* Title + description */}
                    <h3 style={{ fontSize: "1.05rem", marginBottom: 5 }}>{report.title}</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: 10 }}>
                      {report.description}
                    </p>

                    {/* Photos */}
                    {report.photos && report.photos.length > 0 && (
                      <div style={{ display: "flex", gap: 8, marginBottom: 10, overflowX: "auto" }}>
                        {report.photos.map((url, i) => (
                          <img key={i} src={url} alt={`Report photo ${i + 1}`}
                            style={{ width: 160, height: 110, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }} />
                        ))}
                      </div>
                    )}

                    {/* Climate data */}
                    {report.climateData && (
                      <div style={{ display: "flex", gap: 14, padding: "8px 12px", background: "#f0f7f2", borderRadius: 6, fontSize: "0.78rem", marginBottom: 10, flexWrap: "wrap" }}>
                        <span style={{ color: "var(--text-muted)" }}>AQI: <strong style={{ color: report.climateData.aqi > 100 ? "var(--accent-red)" : "var(--text)" }}>{report.climateData.aqi}</strong> ({report.climateData.aqiCategory})</span>
                        <span style={{ color: "var(--text-muted)" }}>Temp: <strong>{report.climateData.temp}°F</strong></span>
                        {report.climateData.feelsLike && <span style={{ color: "var(--text-muted)" }}>Feels like: <strong>{report.climateData.feelsLike}°F</strong></span>}
                        <span style={{ color: "var(--text-muted)" }}>Vulnerability: <strong>{report.climateData.grade}</strong> ({report.climateData.score}/100)</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <button onClick={() => handleUpvote(report.id)} disabled={localUpvotes[report.id]}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "5px 10px", borderRadius: 6, fontSize: "0.8rem", fontWeight: 600,
                          border: "1px solid var(--border)", cursor: localUpvotes[report.id] ? "default" : "pointer",
                          background: localUpvotes[report.id] ? "#f0f7f2" : "var(--bg)",
                          color: localUpvotes[report.id] ? "var(--primary)" : "var(--text-muted)",
                        }}>
                        <ThumbsUp size={13} /> {report.upvotes || 0} {localUpvotes[report.id] ? "Confirmed" : "I see this too"}
                      </button>
                      <button onClick={() => setExpandedReport(expanded ? null : report.id)}
                        style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 6, fontSize: "0.8rem", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-muted)", cursor: "pointer" }}>
                        <FileText size={13} /> {expanded ? "Hide" : "Advocacy tools"}
                        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    </div>

                    {/* Expanded advocacy tools */}
                    {expanded && (
                      <div style={{ marginTop: 12, padding: 14, background: "#f8f6f3", borderRadius: 6, border: "1px solid var(--border)" }}>
                        <h4 style={{ fontSize: "0.85rem", marginBottom: 8 }}>Use this report for advocacy</h4>
                        <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 10, maxHeight: 200, overflow: "auto", background: "var(--bg)", padding: 10, borderRadius: 4 }}>
                          {generateAdvocacyText(report)}
                        </pre>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button onClick={() => copyAdvocacy(report)} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                            Copy for email/letter
                          </button>
                          <a href={`mailto:?subject=${encodeURIComponent(`Community Environmental Report: ${report.title}`)}&body=${encodeURIComponent(generateAdvocacyText(report))}`}
                            className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem", textDecoration: "none" }}>
                            Send via email
                          </a>
                          <button onClick={() => {
                            const text = `${report.title} — ${report.city}, ${report.state}. AQI: ${report.climateData?.aqi || "N/A"}. ${report.upvotes || 0} residents confirm this issue. See more at Climate Lens. #ClimateLens #EnvironmentalJustice`;
                            navigator.clipboard.writeText(text);
                          }} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                            Copy social post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ===== SUBMIT ===== */}
        {tab === "submit" && (
          <>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <h2 style={{ marginBottom: 8, fontSize: "1.4rem" }}>Report submitted.</h2>
                <p style={{ color: "var(--text-muted)", marginBottom: 16, maxWidth: 460, margin: "0 auto 16px" }}>
                  Your report is now paired with real-time EPA and NOAA data. When others confirm it,
                  it becomes harder to dismiss. Share the link to get more eyes on it.
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  <button onClick={() => setSubmitted(false)} className="btn btn-primary">Submit Another</button>
                  <button onClick={() => { setTab("browse"); loadReports(); }} className="btn btn-secondary">View Reports</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ maxWidth: 540 }}>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.83rem", display: "block", marginBottom: 5 }}>Your ZIP code</label>
                  <input className="input" placeholder="Where is this?" value={zip}
                    onChange={(e) => { setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5)); setError(""); }} maxLength={5} />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.83rem", display: "block", marginBottom: 5 }}>What are you reporting?</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {CATEGORIES.map((c) => (
                      <button key={c.id} type="button" onClick={() => setCategory(c.id)}
                        style={{
                          padding: "7px 12px", borderRadius: 6, border: "1px solid",
                          borderColor: category === c.id ? "var(--primary)" : "var(--border)",
                          background: category === c.id ? "#ecfdf5" : "var(--bg)",
                          color: category === c.id ? "var(--primary)" : "var(--text-muted)",
                          cursor: "pointer", fontSize: "0.83rem", fontWeight: 500,
                        }}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                  {category && <p style={{ color: "var(--text-dim)", fontSize: "0.78rem", marginTop: 5 }}>{CATEGORIES.find((c) => c.id === category)?.desc}</p>}
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.83rem", display: "block", marginBottom: 5 }}>How urgent is this?</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {URGENCY.map((u) => (
                      <button key={u.id} type="button" onClick={() => setUrgency(u.id)}
                        style={{
                          padding: "7px 12px", borderRadius: 6, border: "1px solid",
                          borderColor: urgency === u.id ? u.color : "var(--border)",
                          background: urgency === u.id ? `${u.color}10` : "var(--bg)",
                          color: urgency === u.id ? u.color : "var(--text-muted)",
                          cursor: "pointer", fontSize: "0.83rem", fontWeight: 500,
                        }}>
                        {u.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ color: "var(--text-dim)", fontSize: "0.78rem", marginTop: 5 }}>{urgencyInfo(urgency).desc}</p>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.83rem", display: "block", marginBottom: 5 }}>Brief title</label>
                  <input className="input" placeholder="e.g. No shade on Main Street for 6 blocks" value={title}
                    onChange={(e) => setTitle(e.target.value)} maxLength={100} />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.83rem", display: "block", marginBottom: 5 }}>Describe what you see</label>
                  <textarea className="input" rows={4} placeholder="What does it look like? How does it affect your daily life? How long has it been like this? Be specific — details make reports harder to dismiss."
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    style={{ resize: "vertical", minHeight: 100 }} />
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ color: "var(--text-muted)", fontSize: "0.83rem", display: "block", marginBottom: 5 }}>
                    Photos (up to 3 — optional but powerful)
                  </label>
                  <input type="file" accept="image/*" multiple onChange={handlePhotoChange}
                    style={{ color: "var(--text-muted)", fontSize: "0.83rem" }} />
                  {previews.length > 0 && (
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      {previews.map((src, i) => (
                        <img key={i} src={src} alt={`Preview ${i + 1}`}
                          style={{ width: 90, height: 65, objectFit: "cover", borderRadius: 5, border: "1px solid var(--border)" }} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="insight-banner" style={{ marginBottom: 18, fontSize: "0.83rem" }}>
                  When you submit, we fetch real-time AQI, temperature, and vulnerability data for
                  your ZIP and attach it to your report. Your observation + federal data = evidence
                  for city councils, journalists, and grant applications.
                </div>

                {error && <p className="error-msg" style={{ marginBottom: 10 }}>{error}</p>}

                <button type="submit" className="btn btn-primary btn-large" disabled={submitting} style={{ width: "100%" }}>
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>

                {!firebaseReady && (
                  <p style={{ color: "var(--text-dim)", fontSize: "0.73rem", marginTop: 8, textAlign: "center" }}>
                    Reports are saved locally in your browser. Cloud storage coming soon.
                  </p>
                )}
              </form>
            )}
          </>
        )}

        {/* ===== ZIP SUMMARY ===== */}
        {tab === "stats" && (
          <>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 16 }}>
              See aggregate community reports for any ZIP code. Use this to build a case for
              city council presentations, grant applications, or media pitches.
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 24, maxWidth: 400 }}>
              <input className="input" placeholder="Enter ZIP code" value={statsZip}
                onChange={(e) => setStatsZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))} maxLength={5} />
              <button onClick={handleLoadStats} className="btn btn-primary" disabled={statsLoading}>
                {statsLoading ? "..." : "Load"}
              </button>
            </div>

            {statsLoading && <div className="loading"><div className="spinner" />Loading...</div>}

            {!statsLoading && zipStatsData === null && statsZip.length === 5 && (
              <p style={{ color: "var(--text-dim)" }}>No reports found for this ZIP code.</p>
            )}

            {zipStatsData && (
              <div>
                <div className="grid-3" style={{ marginBottom: 20 }}>
                  <div className="card" style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 800 }}>{zipStatsData.totalReports}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.83rem" }}>Total reports</div>
                  </div>
                  <div className="card" style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-red)" }}>{zipStatsData.urgentCount}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.83rem" }}>High/critical urgency</div>
                  </div>
                  <div className="card" style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 800 }}>{zipStatsData.totalUpvotes}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.83rem" }}>Community confirmations</div>
                  </div>
                </div>

                {/* Category breakdown */}
                <div className="card" style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 10 }}>Reports by category</h4>
                  {Object.entries(zipStatsData.categories).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                    <div key={cat} className="metric-row">
                      <span className="metric-label">{catLabel(cat)}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 80, height: 6, borderRadius: 3, background: "var(--border)", overflow: "hidden" }}>
                          <div style={{ width: `${(count / zipStatsData.totalReports) * 100}%`, height: "100%", background: "var(--primary)", borderRadius: 3 }} />
                        </div>
                        <span className="metric-value">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Generate advocacy packet */}
                <div className="card" style={{ borderLeft: "3px solid var(--primary)" }}>
                  <h4 style={{ marginBottom: 6 }}>Generate advocacy packet for this ZIP</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 12 }}>
                    Copy a formatted summary of all reports in this ZIP code. Use it in emails to
                    city council, media pitches, or grant applications.
                  </p>
                  <button className="btn btn-primary" style={{ fontSize: "0.85rem" }} onClick={() => {
                    const text = `COMMUNITY ENVIRONMENTAL REPORT — ZIP ${statsZip}
${"=".repeat(50)}
Total community reports: ${zipStatsData.totalReports}
High/critical urgency issues: ${zipStatsData.urgentCount}
Community confirmations: ${zipStatsData.totalUpvotes}
Most reported issue: ${catLabel(zipStatsData.topCategory)}

INDIVIDUAL REPORTS:
${zipStatsData.reports.map((r, i) => `
${i + 1}. "${r.title}"
   Category: ${catLabel(r.category)} | Urgency: ${r.urgency || "moderate"} | Confirmed by: ${r.upvotes || 0} residents
   ${r.climateData ? `AQI: ${r.climateData.aqi} | Temp: ${r.climateData.temp}°F | Vulnerability: ${r.climateData.grade}` : ""}
   "${r.description}"
`).join("")}
${"=".repeat(50)}
Data collected through Climate Lens (climatelens.org).
Environmental data sourced from EPA AirNow and NOAA/ECMWF.
Community reports submitted by residents of ZIP ${statsZip}.`;
                    navigator.clipboard.writeText(text);
                  }}>
                    Copy full advocacy packet
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
