"use client";
import { Leaf, Github, Mail } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="page-header">
          <h1>About Climate Lens</h1>
        </div>

        <div style={{ color: "var(--text-muted)", lineHeight: 1.9, fontSize: "0.95rem" }}>
          <p style={{ marginBottom: 20 }}>
            Climate Lens started with a simple frustration: the U.S. government collects
            incredible environmental data through the EPA, NOAA, and FEMA — but the people
            who need it most can't access it in a useful format.
          </p>

          <p style={{ marginBottom: 20 }}>
            A botanical garden director applying for a grant shouldn't need to navigate
            three different federal databases to prove her green space improves local air quality.
            A teacher planning an environmental justice lesson shouldn't need a data science
            background to show students that some neighborhoods breathe worse air than others.
            A resident attending a city council meeting shouldn't need to write a research paper
            to argue that their block needs more trees.
          </p>

          <p style={{ marginBottom: 20 }}>
            So I built Climate Lens. It pulls real-time data from the same public APIs the
            government uses — EPA AirNow, EJScreen, NOAA weather data, the Mapping Inequality
            redlining archive — and packages it into formats people actually need: grant reports,
            classroom activities, neighborhood comparisons, advocacy emails, and community
            evidence documentation.
          </p>

          <p style={{ marginBottom: 20 }}>
            This isn't a replacement for tools like EJScreen or the Climate Vulnerability Index.
            Those tools are more comprehensive and more precise. Climate Lens is the last mile —
            the step between "the data exists" and "I can use it right now."
          </p>

          <h2 style={{ color: "var(--text)", fontSize: "1.2rem", marginTop: 32, marginBottom: 12 }}>How it works</h2>

          <p style={{ marginBottom: 20 }}>
            Every tool on this site pulls data from free, public APIs in real time. When you
            search a ZIP code, Climate Lens fetches current air quality, weather conditions,
            historical temperature trends, and environmental justice indicators. Nothing is
            stored except community reports (submitted voluntarily by users). The site is
            open source and free to use — no accounts, no paywalls, no ads.
          </p>

          <h2 style={{ color: "var(--text)", fontSize: "1.2rem", marginTop: 32, marginBottom: 12 }}>Data sources</h2>

          <div className="card" style={{ marginBottom: 20 }}>
            <div className="metric-row">
              <span className="metric-label">Air quality (real-time)</span>
              <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>EPA AirNow via Open-Meteo</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Weather & temperature</span>
              <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>NOAA/ECMWF via Open-Meteo</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Historical temperature</span>
              <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>Open-Meteo Archive (10 years)</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Environmental justice</span>
              <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>EPA EJScreen</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Redlining maps</span>
              <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>Mapping Inequality, University of Richmond</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">ZIP code geocoding</span>
              <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>Zippopotam.us</span>
            </div>
          </div>

          <h2 style={{ color: "var(--text)", fontSize: "1.2rem", marginTop: 32, marginBottom: 12 }}>Open source</h2>

          <p style={{ marginBottom: 20 }}>
            Climate Lens is fully open source. Anyone can view the code, suggest improvements,
            or fork it for their own community.
          </p>

          <a href="https://github.com/Tony100109/climate-lens-web" target="_blank" rel="noopener noreferrer"
            className="btn btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Github size={16} /> View on GitHub
          </a>

          <h2 style={{ color: "var(--text)", fontSize: "1.2rem", marginTop: 32, marginBottom: 12 }}>Contact</h2>

          <p>
            If you're an organization that wants to use Climate Lens, a teacher who tried
            the classroom toolkit, or anyone with feedback — I'd like to hear from you.
          </p>
        </div>
      </div>
    </div>
  );
}
