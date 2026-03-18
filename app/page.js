"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [zip, setZip] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const cleaned = zip.trim();
    if (/^\d{5}$/.test(cleaned)) {
      router.push(`/lookup?zip=${cleaned}`);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="hero">
          <h1>
            The Climate Data <span>Already Exists.</span><br />
            Nobody Can Use It.
          </h1>
          <p>
            Government tools like EJScreen and the Climate Vulnerability Index have the data.
            Climate Lens makes it usable — turning it into grant reports for conservatories,
            lesson plans for teachers, and advocacy tools for nonprofits. For free.
          </p>
          <form onSubmit={handleSearch} className="search-box">
            <input
              className="input input-large"
              placeholder="ZIP code"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
              maxLength={5}
            />
            <button type="submit" className="btn btn-primary btn-large">
              Search
            </button>
          </form>
        </div>

        <div className="section">
          <h2 className="section-title" style={{ textAlign: "center" }}>Built for organizations doing the work</h2>
          <div className="feature-grid">
            <div className="card feature-card">
              <div className="feature-icon">🌿</div>
              <h3>Botanical Gardens & Conservatories</h3>
              <p>Show funders that your green space measurably reduces surrounding temperatures and improves air quality. Generate impact reports for grants.</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">🏛️</div>
              <h3>Environmental Nonprofits</h3>
              <p>Access hyperlocal climate data to support your advocacy. Compare underserved neighborhoods to wealthy ones with real numbers.</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">📚</div>
              <h3>Educators & Schools</h3>
              <p>Use our classroom toolkit to teach environmental justice with your students' own neighborhoods as the textbook.</p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title" style={{ textAlign: "center" }}>What you can do</h2>
          <div className="grid-3">
            <Link href="/lookup" className="card card-hover" style={{ textDecoration: "none" }}>
              <h3 style={{ marginBottom: 8 }}>🔍 Climate Lookup</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Search any ZIP code for real-time air quality, temperature, heat risk, and vulnerability score.</p>
            </Link>
            <Link href="/compare" className="card card-hover" style={{ textDecoration: "none" }}>
              <h3 style={{ marginBottom: 8 }}>⚖️ Compare Areas</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Put two neighborhoods side by side. Expose environmental inequality with data.</p>
            </Link>
            <Link href="/impact" className="card card-hover" style={{ textDecoration: "none" }}>
              <h3 style={{ marginBottom: 8 }}>📊 Green Impact Report</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Generate a data-backed report showing your garden or park's measurable climate impact.</p>
            </Link>
            <Link href="/health-cost" className="card card-hover" style={{ textDecoration: "none" }}>
              <h3 style={{ marginBottom: 8 }}>💰 Health Cost Calculator</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Estimate the annual health and energy costs from pollution and heat — and what trees would save.</p>
            </Link>
            <Link href="/tree-calculator" className="card card-hover" style={{ textDecoration: "none" }}>
              <h3 style={{ marginBottom: 8 }}>🌳 Tree Impact Calculator</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Calculate how many trees you need, their CO2 impact, and get ready-to-use grant language.</p>
            </Link>
            <Link href="/learn" className="card card-hover" style={{ textDecoration: "none" }}>
              <h3 style={{ marginBottom: 8 }}>📖 Learn</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Educational articles explaining AQI, heat islands, environmental justice, and what the data means.</p>
            </Link>
            <Link href="/classroom" className="card card-hover" style={{ textDecoration: "none" }}>
              <h3 style={{ marginBottom: 8 }}>🎓 Classroom Toolkit</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Lesson plans and activities that use local climate data to teach environmental justice.</p>
            </Link>
            <Link href="/action" className="card card-hover" style={{ textDecoration: "none" }}>
              <h3 style={{ marginBottom: 8 }}>📢 Take Action</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Find elected officials, send data-backed letters, get talking points for city council.</p>
            </Link>
          </div>
        </div>

        {/* How we're different */}
        <div className="section">
          <h2 className="section-title" style={{ textAlign: "center" }}>The data exists. The tools don't.</h2>
          <p style={{ color: "var(--text-muted)", textAlign: "center", maxWidth: 650, margin: "0 auto 24px" }}>
            Government agencies have built powerful climate databases. But they're designed for researchers, not for the people who need them most.
          </p>
          <div className="grid-2">
            <div className="card">
              <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 12 }}>What already exists</h4>
              <div className="metric-row"><span className="metric-label">EPA EJScreen</span><span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>Raw data, complex interface</span></div>
              <div className="metric-row"><span className="metric-label">Climate Vulnerability Index</span><span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>184 datasets, research-focused</span></div>
              <div className="metric-row"><span className="metric-label">CEJST (White House)</span><span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>Federal funding decisions</span></div>
              <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", marginTop: 12 }}>These tools are powerful but built for policy analysts and researchers — not for a garden director writing a grant, a teacher planning a lesson, or a resident going to city council.</p>
            </div>
            <div className="card" style={{ borderColor: "var(--primary)" }}>
              <h4 style={{ color: "var(--primary)", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 12 }}>What Climate Lens adds</h4>
              <div className="metric-row"><span className="metric-label">Impact Reports</span><span style={{ color: "var(--accent-green)", fontSize: "0.85rem" }}>Print-ready for grant applications</span></div>
              <div className="metric-row"><span className="metric-label">Classroom Toolkit</span><span style={{ color: "var(--accent-green)", fontSize: "0.85rem" }}>Ready-to-use lesson plans</span></div>
              <div className="metric-row"><span className="metric-label">Advocacy Tools</span><span style={{ color: "var(--accent-green)", fontSize: "0.85rem" }}>Pre-written emails with local data</span></div>
              <div className="metric-row"><span className="metric-label">Neighborhood Compare</span><span style={{ color: "var(--accent-green)", fontSize: "0.85rem" }}>Side-by-side inequality evidence</span></div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 12 }}>We take the same public data and turn it into something a conservatory can attach to a grant, a teacher can use tomorrow, and a resident can bring to city hall.</p>
            </div>
          </div>
        </div>

        {/* Why this exists */}
        <div className="section" style={{ maxWidth: 700 }}>
          <h2 className="section-title">Why this exists</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 16 }}>
            The U.S. government spends millions collecting environmental data through the EPA, NOAA, and FEMA.
            Tools like EJScreen, the Climate Vulnerability Index, and CEJST make that data publicly available.
            But there's a gap between having data and being able to use it.
          </p>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 16 }}>
            A botanical garden director shouldn't need a data science degree to prove their green space
            reduces surrounding temperatures. A teacher shouldn't need to navigate federal databases to
            show students that their neighborhood has worse air quality than one 3 miles away. A resident
            shouldn't need to write a research paper to tell their city council that their block needs more trees.
          </p>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
            Climate Lens is the translator. We pull real-time data from the same sources the government uses
            and package it into the formats people actually need: grant reports, lesson plans, comparison charts,
            and advocacy letters. The data already exists — we just make it work for the people doing the work.
          </p>
        </div>
      </div>
    </div>
  );
}
