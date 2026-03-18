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
            Prove Your <span>Green Impact</span> With Real Data
          </h1>
          <p>
            Climate Lens helps conservatories, botanical gardens, and environmental nonprofits
            demonstrate their measurable climate impact — backed by EPA, NOAA, and FEMA data.
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

        <div className="section" style={{ maxWidth: 700 }}>
          <h2 className="section-title">Why this exists</h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 16 }}>
            Government agencies collect enormous amounts of environmental data — air quality from the EPA,
            weather from NOAA, disaster risk from FEMA. But this data is buried in databases that
            require technical expertise to access.
          </p>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 16 }}>
            The organizations that need this data most — conservatories applying for grants,
            nonprofits advocating for underserved communities, teachers making climate change tangible —
            don't have the resources to extract and analyze it.
          </p>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
            Climate Lens bridges that gap. Real-time and historical data from free public APIs,
            presented as impact reports for funders, comparison tools for advocates, and educational
            resources for classrooms. Free forever. Open source.
          </p>
        </div>
      </div>
    </div>
  );
}
