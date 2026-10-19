"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

function useCountUp(end, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return { count, ref };
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealDiv({ children, className = "", delay = 0, style }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${delay ? `reveal-delay-${delay}` : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

const EXAMPLE_ZIPS = [
  { zip: "10451", label: "Bronx, NY" },
  { zip: "90011", label: "South LA" },
  { zip: "60621", label: "Englewood, Chicago" },
  { zip: "94124", label: "Bayview, SF" },
];

const RETURNS = [
  ["Live Air Quality Index", "Open-Meteo Air Quality (Copernicus CAMS)"],
  ["Temperature and a 10-year trend", "NOAA / ECMWF via Open-Meteo"],
  ["Flood, heat and wind risk", "7-day forecast, NOAA / ECMWF"],
  ["Environmental-justice indicators", "EPA EJScreen"],
  ["Its 1930s redlining grade", "Mapping Inequality, Univ. of Richmond"],
];

const TOOLS = [
  { n: "01", cat: "Research", title: "Climate Lookup", desc: "Real-time AQI, temperature, risk scores, 10-year trends, EJScreen data and historical redlining for any US ZIP code.", href: "/lookup" },
  { n: "02", cat: "Research", title: "Compare Areas", desc: "Two ZIP codes side by side, with the difference on every indicator and pre-loaded disparity examples.", href: "/compare" },
  { n: "03", cat: "Grants", title: "Impact Report", desc: "A downloadable PDF comparing a green space with a nearby area, with an executive summary for funders.", href: "/impact" },
  { n: "04", cat: "Policy", title: "Health Cost Calculator", desc: "Estimated annual health costs from air pollution and heat per 1,000 residents, using EPA and CDC methodology.", href: "/health-cost" },
  { n: "05", cat: "Organizing", title: "Community Evidence Board", desc: "Resident reports paired with real-time EPA and NOAA data, with upvoting and exportable advocacy packets.", href: "/community" },
  { n: "06", cat: "Planning", title: "Tree Calculator", desc: "Trees needed, CO₂ absorption, costs and payback for a site, with grant-ready language.", href: "/tree-calculator" },
  { n: "07", cat: "Civic", title: "Take Action", desc: "Find your representatives and send a pre-written email filled in with your local data.", href: "/action" },
  { n: "08", cat: "Education", title: "Reference Library", desc: "A plain-language glossary and articles on AQI, PM2.5, heat islands, redlining and green infrastructure.", href: "/learn" },
  { n: "09", cat: "K-12", title: "Classroom Toolkit", desc: "Four NGSS-aligned lesson plans for grades 6–12 where students compare their own neighborhoods.", href: "/classroom" },
];

const WEIGHTS = [
  { label: "Air quality", pct: 30, bg: "#2E8B57", fg: "#FFFFFF" },
  { label: "Heat risk", pct: 25, bg: "#4FA06C", fg: "#FFFFFF" },
  { label: "Flood risk", pct: 20, bg: "#7DBB8F", fg: "#0F3D26" },
  { label: "Wind risk", pct: 12.5, bg: "#A9D3B2", fg: "#0F3D26" },
  { label: "EJ baseline", pct: 12.5, bg: "#D4EAD5", fg: "#0F3D26" },
];

const SOURCES = [
  ["Open-Meteo Air Quality", "Current AQI, PM2.5, PM10, NO\u2082 and ozone from the Copernicus CAMS model.", "https://open-meteo.com/en/docs/air-quality-api"],
  ["EPA EJScreen", "Environmental-justice indicators. The EPA took the public tool offline in February 2025.", "https://www.epa.gov/ejscreen"],
  ["NOAA / ECMWF via Open-Meteo", "Current weather, the 7-day forecast behind the flood and wind ratings, and 10-year archives.", "https://open-meteo.com/"],
  ["Mapping Inequality", "1930s HOLC redlining maps, digitized by the University of Richmond.", "https://dsl.richmond.edu/panorama/redlining/"],
  ["Zippopotam.us", "ZIP code to coordinate geocoding.", "https://www.zippopotam.us/"],
];

export default function Home() {
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const tools = useCountUp(9);
  const sources = useCountUp(5);
  const zips = useCountUp(41000);

  const handleSearch = (e) => {
    e.preventDefault();
    const cleaned = zip.trim();
    if (!/^\d{5}$/.test(cleaned)) {
      setError("Enter a 5-digit US ZIP code.");
      return;
    }
    setError("");
    router.push(`/lookup?zip=${cleaned}`);
  };

  return (
    <div className="page">
      {/* Hero: the ZIP search is the main action */}
      <section className="band band-forest" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div className="wrap split">
          <div>
            <span className="eyebrow">An open-source climate research tool</span>
            <h1 className="display">The last mile between government data and community action.</h1>
            <p className="lede" style={{ color: "rgba(252,251,240,0.88)", maxWidth: 600 }}>
              Type a ZIP code to see its air quality, heat, flood risk, environmental-justice
              indicators and redlining history, pulled live from public air-quality, weather and EPA sources.
            </p>
            <form onSubmit={handleSearch} className="zip-form">
              <input
                className="input"
                placeholder="Enter a ZIP code"
                inputMode="numeric"
                aria-label="ZIP code"
                value={zip}
                onChange={(e) => { setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5)); setError(""); }}
                maxLength={5}
              />
              <button type="submit" className="btn btn-gold btn-large" style={{ flexShrink: 0 }}>
                <Search size={16} /> Look it up
              </button>
            </form>
            {error && <p className="zip-error">{error}</p>}
            <p className="zip-examples">
              Or try:{" "}
              {EXAMPLE_ZIPS.map((z) => (
                <Link key={z.zip} href={`/lookup?zip=${z.zip}`}>{z.label} ({z.zip})</Link>
              ))}
            </p>
            <p className="muted-mint" style={{ marginTop: 18 }}>Free and open source. No account, no paywall, no ads.</p>
          </div>
          <div>
            <span className="eyebrow">One ZIP code returns</span>
            <ul className="returns" style={{ marginTop: 14 }}>
              {RETURNS.map(([what, src]) => (
                <li key={what}><strong>{what}</strong><span>{src}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="band band-cream" style={{ paddingTop: 44, paddingBottom: 44 }}>
        <div className="wrap stats-row">
          <div ref={tools.ref}><div className="n">{tools.count}</div><div className="eyebrow l">free tools</div></div>
          <div ref={sources.ref}><div className="n">{sources.count}</div><div className="eyebrow l">public data sources</div></div>
          <div ref={zips.ref}><div className="n">{zips.count.toLocaleString()}+</div><div className="eyebrow l">ZIP codes covered</div></div>
          <div><div className="n">0</div><div className="eyebrow l">accounts required</div></div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="band band-sage">
        <RevealDiv className="wrap">
          <h2 className="h2">Built for the people who need the data most.</h2>
          <div className="vignettes">
            <div><span className="eyebrow">The grant writer</span><p>A botanical garden director applying for a grant shouldn&rsquo;t need to navigate three federal databases to prove her green space improves local air quality.</p></div>
            <div><span className="eyebrow">The teacher</span><p>A teacher planning an environmental justice lesson shouldn&rsquo;t need a data science background to show students that some neighborhoods breathe worse air than others.</p></div>
            <div><span className="eyebrow">The resident</span><p>A resident going to a city council meeting shouldn&rsquo;t need to write a research paper to argue that their block needs more trees.</p></div>
          </div>
        </RevealDiv>
      </section>

      {/* Toolkit */}
      <section className="band band-cream">
        <div className="wrap">
          <div className="split-bottom">
            <div>
              <span className="eyebrow">The toolkit</span>
              <h2 className="h2" style={{ marginTop: 10 }}>Nine tools.<br />One ZIP code.</h2>
            </div>
            <p className="lede" style={{ color: "var(--gray-700)" }}>
              Each tool takes the same public data and shapes it for a different job: a funder,
              a classroom, a council meeting or a block association.
            </p>
          </div>
          <div className="toolgrid">
            {TOOLS.map((t, i) => (
              <RevealDiv key={t.title} delay={i % 3}>
                <Link href={t.href} className="tool">
                  <span className="num">{t.n}</span>
                  <span className="cat">{t.cat}</span>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                  <span className="go">Open tool &rarr;</span>
                </Link>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="band band-forest">
        <RevealDiv className="wrap">
          <div className="split-bottom" style={{ marginBottom: 0 }}>
            <div>
              <span className="eyebrow">Methodology</span>
              <h2 className="h2" style={{ marginTop: 10, color: "var(--cream)" }}>How the Climate Vulnerability Score is built.</h2>
            </div>
            <p className="lede" style={{ color: "rgba(252,251,240,0.88)" }}>
              A composite index from 0 to 100, computed from data pulled at the moment you search.
              Nothing is pre-cached or modeled. Higher scores mean greater vulnerability.
            </p>
          </div>
          <div className="weights" role="img" aria-label="Score weights: air quality 30%, heat risk 25%, flood risk 20%, wind risk 12.5%, environmental-justice baseline 12.5%">
            {WEIGHTS.map((w) => (
              <div key={w.label} style={{ flexBasis: `${w.pct}%`, background: w.bg, color: w.fg }}>
                <b>{w.pct}%</b><span>{w.label}</span>
              </div>
            ))}
          </div>
          <p className="muted-mint" style={{ marginTop: 24, maxWidth: 820 }}>
            Climate Lens supplements established tools such as{" "}
            <a href="https://www.epa.gov/ejscreen" target="_blank" rel="noopener noreferrer">EPA EJScreen</a>,
            the <a href="https://climatevulnerabilityindex.org/" target="_blank" rel="noopener noreferrer">U.S. Climate Vulnerability Index</a> and{" "}
            <a href="https://screeningtool.geoplatform.gov/" target="_blank" rel="noopener noreferrer">CEJST</a>.
            Its contribution is translating the same underlying data into formats those tools don&rsquo;t provide.
          </p>
        </RevealDiv>
      </section>

      {/* Data sources */}
      <section className="band band-sage">
        <RevealDiv className="wrap split" style={{ alignItems: "start" }}>
          <div>
            <span className="eyebrow">Powered by</span>
            <h2 className="h2" style={{ marginTop: 10 }}>Public data, made usable.</h2>
            <p className="lede" style={{ color: "var(--gray-700)", marginTop: 16 }}>
              Every number comes from a free, public source. Nothing is stored except the community
              reports people choose to submit.
            </p>
          </div>
          <div className="sources">
            {SOURCES.map(([name, desc, url]) => (
              <div key={name}>
                <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </RevealDiv>
      </section>

      {/* CTA */}
      <section className="band band-leaf" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <div className="wrap cta-row">
          <div>
            <h2 className="h2" style={{ color: "var(--cream)" }}>Start with your own ZIP code.</h2>
            <p style={{ color: "rgba(252,251,240,0.85)", marginTop: 8 }}>Free, open source and built for organizations making a difference.</p>
          </div>
          <div className="cta-buttons-row">
            <Link href="/lookup" className="btn btn-gold btn-large"><Search size={16} /> Open Climate Lookup</Link>
            <a href="https://github.com/Tony100109/climate-lens-web" target="_blank" rel="noopener noreferrer" className="btn btn-line btn-large">Code on GitHub</a>
          </div>
        </div>
      </section>
    </div>
  );
}
