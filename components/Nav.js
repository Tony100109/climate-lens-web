"use client";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">Climate Lens</Link>
      <ul className="nav-links">
        <li><Link href="/lookup">Lookup</Link></li>
        <li><Link href="/compare">Compare</Link></li>
        <li><Link href="/impact">Impact Report</Link></li>
        <li><Link href="/learn">Learn</Link></li>
        <li><Link href="/classroom">Classroom</Link></li>
        <li><Link href="/action">Take Action</Link></li>
      </ul>
    </nav>
  );
}
