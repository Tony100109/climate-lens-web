"use client";
import Link from "next/link";
import { BookOpen, Scale } from "lucide-react";

const LESSONS = [
  {
    grade: "6-8",
    title: "My Neighborhood's Climate Score",
    duration: "45 min",
    description: "Students look up their own ZIP codes and compare results. Discussion: why are some neighborhoods more vulnerable than others?",
    objectives: ["Understand what AQI and climate vulnerability mean", "Compare environmental data across neighborhoods", "Discuss why environmental inequality exists"],
    activity: [
      "Have each student go to Climate Lens and search their home ZIP code.",
      "Record their AQI, temperature, and overall score on the board.",
      "Ask: Do you notice any patterns? Are some areas scored worse than others?",
      "Have students pair up and use the Compare tool with a partner's ZIP code.",
      "Discussion: What factors might explain the differences? (Trees, highways, factories, income levels)",
      "Exit ticket: Write one thing you learned about your neighborhood's environment today.",
    ],
  },
  {
    grade: "9-12",
    title: "Redlining and Environmental Justice",
    duration: "60 min",
    description: "Students connect historical redlining maps to modern climate data. Discover how 1930s policies still affect environmental quality today.",
    objectives: ["Understand the connection between redlining and environmental inequality", "Analyze real environmental data critically", "Propose solutions based on evidence"],
    activity: [
      "Brief lecture: What was redlining? Show historical HOLC maps (available at Mapping Inequality project).",
      "Students use Climate Lens Compare tool to look up a formerly redlined neighborhood vs. a formerly 'A-graded' neighborhood in your city.",
      "Record the differences in AQI, temperature, and vulnerability score.",
      "Small group discussion: Is this a coincidence? What's the connection between 1930s investment decisions and today's environmental data?",
      "Each group proposes one policy change that could address the disparity.",
      "Groups present their findings and proposals to the class.",
    ],
  },
  {
    grade: "6-12",
    title: "Trees as Climate Infrastructure",
    duration: "45 min",
    description: "Students calculate the environmental value of trees in their school's neighborhood and present a case for more green space.",
    objectives: ["Quantify the environmental benefits of trees with data", "Build an evidence-based argument", "Practice civic advocacy skills"],
    activity: [
      "Look up your school's ZIP code on Climate Lens. Record the current AQI and temperature.",
      "Use the Green Impact Report tool: enter your school's ZIP and a nearby area with more trees (park, garden).",
      "Calculate: If one tree absorbs 48 lbs of CO2/year, how many trees would it take to offset your school's estimated emissions?",
      "Research: How much tree canopy does your neighborhood have? (Use Google Earth or local data)",
      "Write a one-page proposal to your school board or city council arguing for more trees near your school, using Climate Lens data as evidence.",
      "Optional: Actually send the proposal to your local representatives using the Take Action page.",
    ],
  },
  {
    grade: "9-12",
    title: "Data-Driven Climate Advocacy",
    duration: "90 min (2 sessions)",
    description: "Students use Climate Lens data to write a real letter to their city council member advocating for environmental improvements in their community.",
    objectives: ["Use real environmental data to support an argument", "Understand how local government works", "Practice persuasive writing with evidence"],
    activity: [
      "Session 1: Research (45 min)",
      "Use Climate Lens to gather data on your neighborhood: AQI, vulnerability score, temperature trends.",
      "Use the Compare tool to find a nearby area with better environmental metrics.",
      "Identify your city council member using the Take Action page.",
      "Research what environmental policies your city currently has.",
      "Session 2: Write & Send (45 min)",
      "Draft a letter to your council member using the data you collected.",
      "Include: specific metrics from Climate Lens, what you're asking for, and why it matters to your community.",
      "Peer review: exchange letters with a partner for feedback.",
      "Send the letter (email or physical mail) to your representative.",
    ],
  },
];

export default function ClassroomPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Classroom Toolkit</h1>
          <p>Ready-to-use lesson plans that turn local climate data into hands-on environmental justice education. No prep needed — just open Climate Lens with your students.</p>
        </div>

        <div className="insight-banner" style={{ marginBottom: 32 }}>
          <strong>For teachers:</strong> These lessons use Climate Lens as a live tool in the classroom. Students search their own neighborhoods, compare data, and discover environmental inequality through their own experience — not from a textbook. All you need is internet access and a projector.
        </div>

        {LESSONS.map((lesson, i) => (
          <div key={i} className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <span className="tag tag-blue">Grades {lesson.grade}</span>
                  <span className="tag tag-green">{lesson.duration}</span>
                </div>
                <h3 style={{ fontSize: "1.2rem" }}>{lesson.title}</h3>
              </div>
            </div>
            <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>{lesson.description}</p>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 8 }}>Learning Objectives</h4>
              <ul style={{ color: "var(--text-muted)", paddingLeft: 20, fontSize: "0.9rem" }}>
                {lesson.objectives.map((obj, j) => <li key={j} style={{ marginBottom: 4 }}>{obj}</li>)}
              </ul>
            </div>

            <div>
              <h4 style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", marginBottom: 8 }}>Step-by-Step Activity</h4>
              <ol style={{ color: "var(--text-muted)", paddingLeft: 20, fontSize: "0.9rem" }}>
                {lesson.activity.map((step, j) => (
                  <li key={j} style={{ marginBottom: 6, fontWeight: step.startsWith("Session") ? 700 : 400, color: step.startsWith("Session") ? "var(--text)" : "var(--text-muted)" }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}

        <div className="section">
          <h2 className="section-title">Pair with these resources</h2>
          <div className="grid-2">
            <Link href="/learn" className="card card-hover" style={{ textDecoration: "none" }}>
              <h3 style={{ marginBottom: 8, color: "var(--text)" }}><BookOpen size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} /> Educational Articles</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Assign as background reading before lessons. Covers AQI, heat islands, EJ, and PM2.5.</p>
            </Link>
            <Link href="/compare" className="card card-hover" style={{ textDecoration: "none" }}>
              <h3 style={{ marginBottom: 8, color: "var(--text)" }}><Scale size={18} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} /> Compare Tool</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Core tool for classroom activities. Pre-loaded with example comparisons to get students started.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
