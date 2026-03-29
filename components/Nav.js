"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Leaf } from "lucide-react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        <span className="nav-logo-icon"><Leaf size={16} /></span>
        Climate Lens
      </Link>
      <button className="nav-mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <ul className={`nav-links${open ? " open" : ""}`} onClick={(e) => { if (e.target.tagName === "A") setOpen(false); }}>
        <li><Link href="/lookup">Lookup</Link></li>
        <li><Link href="/compare">Compare</Link></li>
        <li><Link href="/community">Community</Link></li>
        <li><Link href="/impact">Impact Report</Link></li>
        <li><Link href="/health-cost">Health Costs</Link></li>
        <li><Link href="/tree-calculator">Trees</Link></li>
        <li><Link href="/learn">Learn</Link></li>
        <li><Link href="/classroom">Classroom</Link></li>
        <li><Link href="/action">Action</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/lookup" className="nav-cta">Get Started</Link></li>
      </ul>
    </nav>
  );
}
