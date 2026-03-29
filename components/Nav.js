"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Leaf, ChevronDown } from "lucide-react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        <span className="nav-logo-icon"><Leaf size={18} /></span>
        Climate Lens
      </Link>
      <button className="nav-mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <ul className={`nav-links${open ? " open" : ""}`} onClick={(e) => { if (e.target.tagName === "A") setOpen(false); }}>
        <li><Link href="/lookup">Lookup</Link></li>
        <li><Link href="/compare">Compare</Link></li>
        <li className="nav-group">
          <button className="nav-group-label">
            Tools <ChevronDown size={14} />
          </button>
          <div className="nav-dropdown">
            <Link href="/community">Community Board</Link>
            <Link href="/impact">Impact Report</Link>
            <Link href="/health-cost">Health Costs</Link>
            <Link href="/tree-calculator">Tree Calculator</Link>
          </div>
        </li>
        <li className="nav-group">
          <button className="nav-group-label">
            Learn <ChevronDown size={14} />
          </button>
          <div className="nav-dropdown">
            <Link href="/learn">Reference</Link>
            <Link href="/classroom">Classroom</Link>
          </div>
        </li>
        <li><Link href="/action">Action</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/lookup" className="nav-cta">Get Started</Link></li>
      </ul>
    </nav>
  );
}
