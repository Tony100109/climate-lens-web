"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Leaf, ChevronDown } from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Data Tools",
    items: [
      { href: "/lookup", text: "Climate Lookup" },
      { href: "/compare", text: "Compare Areas" },
      { href: "/health-cost", text: "Health Costs" },
      { href: "/tree-calculator", text: "Tree Calculator" },
    ],
  },
  {
    label: "Reports",
    items: [
      { href: "/impact", text: "Impact Report" },
      { href: "/community", text: "Community Board" },
    ],
  },
  {
    label: "Learn",
    items: [
      { href: "/learn", text: "Reference Library" },
      { href: "/classroom", text: "Classroom Toolkit" },
    ],
  },
];

const STANDALONE = [
  { href: "/action", text: "Take Action" },
  { href: "/about", text: "About" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="nav" ref={navRef}>
      <Link href="/" className="nav-logo">
        <span className="nav-logo-icon"><Leaf size={16} /></span>
        Climate Lens
      </Link>

      <button className="nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop nav */}
      <ul className="nav-links nav-desktop">
        {NAV_GROUPS.map((group) => (
          <li key={group.label} className="nav-group">
            <button
              className="nav-group-label"
              onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
            >
              {group.label} <ChevronDown size={12} style={{ opacity: 0.5, transition: "transform 0.2s", transform: openGroup === group.label ? "rotate(180deg)" : "none" }} />
            </button>
            <div className={`nav-dropdown${openGroup === group.label ? " nav-dropdown-open" : ""}`}>
              {group.items.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpenGroup(null)}>
                  {item.text}
                </Link>
              ))}
            </div>
          </li>
        ))}
        {STANDALONE.map((item) => (
          <li key={item.href}><Link href={item.href}>{item.text}</Link></li>
        ))}
        <li><Link href="/lookup" className="nav-cta">Get Started</Link></li>
      </ul>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="nav-mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div className="nav-mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="nav-mobile-header">
              <span className="nav-logo" style={{ pointerEvents: "none" }}>
                <span className="nav-logo-icon"><Leaf size={16} /></span>
                Climate Lens
              </span>
              <button className="nav-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="nav-mobile-group">
                <div className="nav-mobile-group-label">{group.label}</div>
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href} className="nav-mobile-link" onClick={() => setMobileOpen(false)}>
                    {item.text}
                  </Link>
                ))}
              </div>
            ))}
            <div className="nav-mobile-group">
              {STANDALONE.map((item) => (
                <Link key={item.href} href={item.href} className="nav-mobile-link" onClick={() => setMobileOpen(false)}>
                  {item.text}
                </Link>
              ))}
            </div>
            <Link href="/lookup" className="btn btn-primary" style={{ margin: "16px 20px", textAlign: "center" }} onClick={() => setMobileOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
