import Link from "next/link";
import { Github, Mail, Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Leaf size={18} /> Climate Lens
          </h3>
          <p>
            An open-source research tool aggregating EPA, NOAA, and FEMA data
            into actionable formats for community organizations, educators, and advocates.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <a href="https://github.com/Tony100109/climate-lens-web" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Github size={16} /> GitHub
            </a>
            <a href="mailto:Tony.ScienceHumanitarian@outlook.com"
              style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Mail size={16} /> Contact
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Research</h4>
          <Link href="/lookup">Climate Lookup</Link>
          <Link href="/compare">Compare Areas</Link>
          <Link href="/impact">Impact Report</Link>
          <Link href="/health-cost">Health Costs</Link>
        </div>

        <div className="footer-col">
          <h4>Community</h4>
          <Link href="/community">Evidence Board</Link>
          <Link href="/tree-calculator">Tree Calculator</Link>
          <Link href="/action">Take Action</Link>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <Link href="/learn">Reference</Link>
          <Link href="/classroom">Classroom Toolkit</Link>
          <Link href="/about">About</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          Climate Lens is open source and not affiliated with any government agency.
        </span>
        <span>
          Data: EPA AirNow, EPA EJScreen, NOAA/ECMWF via Open-Meteo, FEMA NRI, UofR Mapping Inequality
        </span>
      </div>
    </footer>
  );
}
