"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

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

        <div style={{ padding: "48px 0 36px", maxWidth: 580 }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.9rem", fontWeight: 700, lineHeight: 1.3, marginBottom: 14 }}>
            Climate Lens
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.8, marginBottom: 6 }}>
            An open-source research tool that aggregates environmental data from the EPA, NOAA, and
            FEMA into actionable formats for community organizations, educators, and advocates.
          </p>
          <p style={{ color: "var(--text-dim)", fontSize: "0.82rem", lineHeight: 1.7, marginBottom: 24 }}>
            Data sources include EPA AirNow, EPA EJScreen, NOAA/ECMWF weather archives via Open-Meteo,
            and the University of Richmond Mapping Inequality project. All data is retrieved in real time
            from public APIs at no cost.
          </p>
          <form onSubmit={handleSearch} className="search-box">
            <input
              className="input"
              style={{ fontSize: "0.95rem", letterSpacing: 2, fontWeight: 500, textAlign: "center" }}
              placeholder="ZIP code"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
              maxLength={5}
            />
            <button type="submit" className="btn btn-primary" style={{ gap: 5 }}>
              <Search size={14} /> Query
            </button>
          </form>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 28 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "0.92rem", color: "var(--text-dim)", fontWeight: 400, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1.5 }}>
            Available Tools
          </h2>

          <table className="data-table">
            <thead>
              <tr>
                <th>Tool</th>
                <th>Description</th>
                <th>Primary Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr onClick={() => router.push("/lookup")} style={{ cursor: "pointer" }}>
                <td><Link href="/lookup" style={{ fontWeight: 600 }}>Climate Lookup</Link></td>
                <td>Real-time AQI, temperature, heat/flood/wind risk, 10-year trends, EPA EJScreen data, and historical redlining grades for any US ZIP code.</td>
                <td style={{ color: "var(--text-dim)" }}>Research, baseline assessment</td>
              </tr>
              <tr onClick={() => router.push("/compare")} style={{ cursor: "pointer" }}>
                <td><Link href="/compare" style={{ fontWeight: 600 }}>Compare</Link></td>
                <td>Side-by-side environmental comparison of two ZIP codes with differential analysis. Includes pre-loaded examples of known environmental justice disparities.</td>
                <td style={{ color: "var(--text-dim)" }}>Advocacy, presentations</td>
              </tr>
              <tr onClick={() => router.push("/community")} style={{ cursor: "pointer" }}>
                <td><Link href="/community" style={{ fontWeight: 600 }}>Community Evidence Board</Link></td>
                <td>Citizen-submitted environmental observations automatically paired with real-time EPA/NOAA data. Includes upvoting, urgency classification, and exportable advocacy packets.</td>
                <td style={{ color: "var(--text-dim)" }}>Community organizing, city council</td>
              </tr>
              <tr onClick={() => router.push("/impact")} style={{ cursor: "pointer" }}>
                <td><Link href="/impact" style={{ fontWeight: 600 }}>Impact Report</Link></td>
                <td>Generates a downloadable PDF comparing a green space's environmental metrics against a nearby non-green area. Includes executive summary and funder-facing narrative.</td>
                <td style={{ color: "var(--text-dim)" }}>Grant applications</td>
              </tr>
              <tr onClick={() => router.push("/health-cost")} style={{ cursor: "pointer" }}>
                <td><Link href="/health-cost" style={{ fontWeight: 600 }}>Health Cost Calculator</Link></td>
                <td>Estimates annual health costs attributable to local air quality and heat exposure per 1,000 residents, based on EPA and CDC methodology.</td>
                <td style={{ color: "var(--text-dim)" }}>Budget justification, policy</td>
              </tr>
              <tr onClick={() => router.push("/tree-calculator")} style={{ cursor: "pointer" }}>
                <td><Link href="/tree-calculator" style={{ fontWeight: 600 }}>Tree ROI Calculator</Link></td>
                <td>Calculates CO2 absorption, cost, and payback period for tree planting initiatives. Generates copy-paste grant language with computed values.</td>
                <td style={{ color: "var(--text-dim)" }}>Grant writing, planning</td>
              </tr>
              <tr onClick={() => router.push("/learn")} style={{ cursor: "pointer" }}>
                <td><Link href="/learn" style={{ fontWeight: 600 }}>Reference</Link></td>
                <td>Glossary of environmental terms and explanatory articles on AQI, PM2.5, urban heat islands, environmental justice, and green infrastructure economics.</td>
                <td style={{ color: "var(--text-dim)" }}>Education, onboarding</td>
              </tr>
              <tr onClick={() => router.push("/classroom")} style={{ cursor: "pointer" }}>
                <td><Link href="/classroom" style={{ fontWeight: 600 }}>Classroom Toolkit</Link></td>
                <td>Lesson plans for grades 6-12 that use live Climate Lens data. Students compare their own neighborhoods in real time. Aligned to NGSS standards.</td>
                <td style={{ color: "var(--text-dim)" }}>K-12 education</td>
              </tr>
              <tr onClick={() => router.push("/action")} style={{ cursor: "pointer" }}>
                <td><Link href="/action" style={{ fontWeight: 600 }}>Take Action</Link></td>
                <td>Representative lookup, pre-written advocacy emails populated with local data, and shareable social media content.</td>
                <td style={{ color: "var(--text-dim)" }}>Civic engagement</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 40, borderTop: "1px solid var(--border)", paddingTop: 24 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "0.92rem", color: "var(--text-dim)", fontWeight: 400, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>
            Methodology
          </h2>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.85 }}>
            <p style={{ marginBottom: 12 }}>
              Climate Lens retrieves data from public APIs in real time. No data is pre-cached or
              modeled. The Climate Vulnerability Score is a composite index (0-100) weighted as follows:
              air quality (30%), heat risk (25%), flood risk (20%), wind risk (12.5%), and an estimated
              environmental justice baseline (12.5%). Higher scores indicate greater vulnerability.
            </p>
            <p style={{ marginBottom: 12 }}>
              Temperature trends are computed from 10 years of daily high/low records via the Open-Meteo
              historical archive (NOAA/ECMWF ERA5 reanalysis). EJScreen data is sourced from the EPA's
              environmental justice screening tool. Redlining grades are from the HOLC maps digitized
              by the University of Richmond's Mapping Inequality project.
            </p>
            <p>
              This tool is intended to supplement, not replace, established environmental assessment
              tools such as <a href="https://www.epa.gov/ejscreen" target="_blank" rel="noopener noreferrer">EPA EJScreen</a>,
              the <a href="https://climatevulnerabilityindex.org/" target="_blank" rel="noopener noreferrer">U.S. Climate Vulnerability Index</a>,
              and the <a href="https://screeningtool.geoplatform.gov/" target="_blank" rel="noopener noreferrer">CEJST</a>.
              Its contribution is translating the same underlying data into output formats
              (PDF reports, lesson plans, advocacy templates, community evidence) that existing
              tools do not provide.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 36, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "0.92rem", color: "var(--text-dim)", fontWeight: 400, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>
            Intended Users
          </h2>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.85 }}>
            <p style={{ marginBottom: 8 }}>
              <strong style={{ color: "var(--text)" }}>Community gardens and small conservatories</strong> that
              lack dedicated data staff and need environmental impact documentation for grant applications.
            </p>
            <p style={{ marginBottom: 8 }}>
              <strong style={{ color: "var(--text)" }}>Environmental advocates</strong> preparing for city council
              meetings, media outreach, or community organizing who need locally specific, source-cited data.
            </p>
            <p style={{ marginBottom: 8 }}>
              <strong style={{ color: "var(--text)" }}>Educators</strong> teaching environmental science or
              civic engagement who need free, no-prep activities using real-time data.
            </p>
            <p>
              <strong style={{ color: "var(--text)" }}>Residents</strong> documenting environmental conditions
              in their neighborhoods and building community evidence for policy change.
            </p>
          </div>
        </div>

        <div className="footnote" style={{ marginTop: 36 }}>
          <p>
            Data sources: EPA AirNow API, EPA EJScreen, NOAA/ECMWF via Open-Meteo, Open-Meteo Air Quality API,
            FEMA National Risk Index, University of Richmond Mapping Inequality Project.
            Climate Lens is open source and available at <a href="https://github.com/Tony100109/climate-lens-web" target="_blank" rel="noopener noreferrer">github.com/Tony100109/climate-lens-web</a>.
            This project does not claim affiliation with the EPA, NOAA, FEMA, or any government agency.
          </p>
        </div>

      </div>
    </div>
  );
}
