"use client";
import Link from "next/link";
import { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Leaf size={18} /> Climate Lens
      </Link>
      <button className="nav-mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <ul className={`nav-links${open ? " open" : ""}`} onClick={() => setOpen(false)}>
        <li><Link href="/lookup">Lookup</Link></li>
        <li><Link href="/compare">Compare</Link></li>
        <li><Link href="/community">Community</Link></li>
        <li><Link href="/impact">Impact Report</Link></li>
        <li><Link href="/health-cost">Health Costs</Link></li>
        <li><Link href="/tree-calculator">Trees</Link></li>
        <li><Link href="/learn">Learn</Link></li>
        <li><Link href="/classroom">Classroom</Link></li>
        <li><Link href="/action">Act</Link></li>
        <li><Link href="/about">About</Link></li>
      </ul>
    </nav>
  );
}
