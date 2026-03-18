"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Camera, MapPin, Scale, FileText, DollarSign, TreePine, BookOpen, GraduationCap, Megaphone } from "lucide-react";

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

        <div style={{ padding: "64px 0 40px", maxWidth: 620 }}>
          <h1 style={{ fontSize: "2.6rem", fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
            Your neighborhood's climate data,<br />
            in a format you can actually use.
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: 28 }}>
            The EPA, NOAA, and FEMA collect incredible environmental data. But try using it
            to write a grant, plan a lesson, or email your city council — you can't. It's
            buried in databases built for researchers. Climate Lens pulls it out and turns it
            into something useful.
          </p>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, maxWidth: 400 }}>
            <input
              className="input"
              style={{ fontSize: "1.1rem", letterSpacing: 3, fontWeight: 600, textAlign: "center" }}
              placeholder="Enter ZIP"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
              maxLength={5}
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: "nowrap", gap: 6, display: "inline-flex", alignItems: "center" }}>
              <Search size={16} /> Look up
            </button>
          </form>
        </div>

        <div style={{ marginTop: 56 }}>
          <h2 style={{ fontSize: "1.1rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 24 }}>Tools</h2>

          {/* Community — the differentiator */}
          <Link href="/community" className="card card-hover" style={{ textDecoration: "none", marginBottom: 16, display: "flex", gap: 16, alignItems: "flex-start", borderColor: "var(--primary)" }}>
            <Camera size={24} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
            <div>
              <h3 style={{ marginBottom: 6, color: "var(--text)" }}>Community Evidence Board</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Document what your neighborhood actually looks like — no trees, flooding, pollution,
                cracked infrastructure. Your photos get paired with real-time EPA and NOAA data
                automatically. Government data tells part of the story. You tell the rest.
              </p>
            </div>
          </Link>

          {/* Primary tools */}
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <Link href="/lookup" className="card card-hover" style={{ textDecoration: "none", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <MapPin size={20} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <h3 style={{ marginBottom: 6, color: "var(--text)" }}>Climate Lookup</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Real-time air quality, heat risk, 10-year temperature trends, EPA environmental justice
                  data, and 1930s redlining history — all from one ZIP code search.
                </p>
              </div>
            </Link>
            <Link href="/compare" className="card card-hover" style={{ textDecoration: "none", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <Scale size={20} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <h3 style={{ marginBottom: 6, color: "var(--text)" }}>Compare Two Areas</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Beverly Hills vs South LA. Lincoln Park vs Englewood. See exactly how environmental
                  quality differs between neighborhoods — and why.
                </p>
              </div>
            </Link>
          </div>

          {/* Grant tools */}
          <div className="grid-3" style={{ marginBottom: 16 }}>
            <Link href="/impact" className="card card-hover" style={{ textDecoration: "none", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <FileText size={18} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <h3 style={{ marginBottom: 6, fontSize: "1rem", color: "var(--text)" }}>Impact Report</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Generate a PDF comparing your site's environmental data to surrounding areas. Built for grant applications.
                </p>
              </div>
            </Link>
            <Link href="/health-cost" className="card card-hover" style={{ textDecoration: "none", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <DollarSign size={18} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <h3 style={{ marginBottom: 6, fontSize: "1rem", color: "var(--text)" }}>Health Cost Calculator</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Estimated annual health costs from local pollution and heat. Shows what trees would save in dollars.
                </p>
              </div>
            </Link>
            <Link href="/tree-calculator" className="card card-hover" style={{ textDecoration: "none", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <TreePine size={18} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <h3 style={{ marginBottom: 6, fontSize: "1rem", color: "var(--text)" }}>Tree Calculator</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  How many trees, how much CO2, what ROI. Generates copy-paste grant language with your numbers.
                </p>
              </div>
            </Link>
          </div>

          {/* Education + Action */}
          <div className="grid-3">
            <Link href="/learn" className="card card-hover" style={{ textDecoration: "none", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <BookOpen size={18} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <h3 style={{ marginBottom: 6, fontSize: "1rem", color: "var(--text)" }}>Learn</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  What is AQI? What's a heat island? Why does redlining still matter? Plain-English explainers.
                </p>
              </div>
            </Link>
            <Link href="/classroom" className="card card-hover" style={{ textDecoration: "none", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <GraduationCap size={18} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <h3 style={{ marginBottom: 6, fontSize: "1rem", color: "var(--text)" }}>Classroom Toolkit</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Lesson plans for grades 6-12. Students compare their own neighborhoods. No prep needed.
                </p>
              </div>
            </Link>
            <Link href="/action" className="card card-hover" style={{ textDecoration: "none", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Megaphone size={18} style={{ color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <h3 style={{ marginBottom: 6, fontSize: "1rem", color: "var(--text)" }}>Take Action</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  Find your reps. Get a pre-written email with your area's data. Share on social media.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Why this exists */}
        <div style={{ marginTop: 64, maxWidth: 640 }}>
          <h2 style={{ fontSize: "1.1rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>Why this exists</h2>

          <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 20 }}>
            There are already good climate data tools. The EPA's <a href="https://www.epa.gov/ejscreen" target="_blank" rel="noopener noreferrer">EJScreen</a> has
            detailed environmental justice data. The <a href="https://climatevulnerabilityindex.org/" target="_blank" rel="noopener noreferrer">Climate Vulnerability Index</a> combines
            184 datasets. The White House's <a href="https://screeningtool.geoplatform.gov/" target="_blank" rel="noopener noreferrer">CEJST</a> determines where federal funding goes.
          </p>

          <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 20 }}>
            But none of them generate a report a garden director can attach to a grant application.
            None of them have lesson plans a teacher can use tomorrow. None of them write an email
            a resident can send to city council tonight. They have the data — they just don't have
            the last mile.
          </p>

          <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
            That's what Climate Lens does. Same public data, different output. Grant reports, classroom
            activities, advocacy templates, tree ROI calculations. The stuff people actually need when
            they're trying to protect their community's environment.
          </p>
        </div>

        {/* Who it's for */}
        <div style={{ marginTop: 48, maxWidth: 640 }}>
          <h2 style={{ fontSize: "1.1rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 20 }}>Who this is for</h2>
          <div style={{ color: "var(--text-muted)", lineHeight: 2, fontSize: "0.95rem" }}>
            <p><strong style={{ color: "var(--text)" }}>Conservatories and botanical gardens</strong> — prove your environmental value to funders with real data instead of anecdotes.</p>
            <p style={{ marginTop: 8 }}><strong style={{ color: "var(--text)" }}>Small environmental nonprofits</strong> — back up your advocacy with EPA and NOAA numbers, not just passion.</p>
            <p style={{ marginTop: 8 }}><strong style={{ color: "var(--text)" }}>Teachers</strong> — teach climate justice using your students' own neighborhoods. Open the site and go.</p>
            <p style={{ marginTop: 8 }}><strong style={{ color: "var(--text)" }}>Anyone going to a city council meeting</strong> — show up with data, a comparison, and a specific ask.</p>
          </div>
        </div>

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)", maxWidth: 640 }}>
          <p style={{ color: "var(--text-dim)", fontSize: "0.8rem", lineHeight: 1.8 }}>
            All data comes from free public APIs: EPA AirNow, EPA EJScreen, NOAA/ECMWF weather data via Open-Meteo,
            Open-Meteo Air Quality, FEMA National Risk Index, and the University of Richmond's Mapping Inequality
            project for historical redlining data. Climate Lens is open source and free to use.
          </p>
        </div>

      </div>
    </div>
  );
}
