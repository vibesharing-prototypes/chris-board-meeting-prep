"use client";
import { useState } from "react";

// --- Data ---
const meetings = [
  {
    id: 1,
    title: "Q1 2026 Board Meeting",
    date: "Apr 8, 2026",
    time: "9:00 AM – 12:00 PM ET",
    location: "Boardroom A / Zoom",
    status: "ready",
    docsComplete: 12,
    docsTotal: 12,
  },
  {
    id: 2,
    title: "Audit Committee Review",
    date: "Apr 15, 2026",
    time: "2:00 PM – 4:00 PM ET",
    location: "Virtual",
    status: "in-progress",
    docsComplete: 7,
    docsTotal: 10,
  },
  {
    id: 3,
    title: "Compensation Committee",
    date: "Apr 22, 2026",
    time: "10:00 AM – 11:30 AM ET",
    location: "Boardroom B",
    status: "not-started",
    docsComplete: 2,
    docsTotal: 9,
  },
  {
    id: 4,
    title: "Special Strategy Session",
    date: "May 6, 2026",
    time: "1:00 PM – 5:00 PM ET",
    location: "Off-site / TBD",
    status: "not-started",
    docsComplete: 0,
    docsTotal: 8,
  },
];

const documents = [
  { id: 1, name: "Board Deck – Q1 Results", category: "Financials", status: "approved", owner: "CFO Office" },
  { id: 2, name: "CEO Strategic Update", category: "Strategy", status: "approved", owner: "CEO Office" },
  { id: 3, name: "Risk Assessment Summary", category: "Risk", status: "approved", owner: "CRO" },
  { id: 4, name: "Audit Committee Report", category: "Compliance", status: "in-review", owner: "Internal Audit" },
  { id: 5, name: "ESG Progress Report", category: "ESG", status: "in-review", owner: "Sustainability" },
  { id: 6, name: "Executive Compensation Proposal", category: "Compensation", status: "draft", owner: "CHRO" },
  { id: 7, name: "M&A Pipeline Overview", category: "Strategy", status: "in-review", owner: "Corp Dev" },
  { id: 8, name: "Cybersecurity Posture Report", category: "Risk", status: "approved", owner: "CISO" },
  { id: 9, name: "Board Minutes – Previous Meeting", category: "Governance", status: "approved", owner: "Corporate Secretary" },
  { id: 10, name: "Shareholder Engagement Summary", category: "Governance", status: "draft", owner: "Investor Relations" },
];

const attendees = [
  { name: "Margaret Chen", role: "Board Chair", status: "confirmed", initials: "MC" },
  { name: "David Okoro", role: "Lead Independent Director", status: "confirmed", initials: "DO" },
  { name: "Sarah Lindqvist", role: "Audit Committee Chair", status: "confirmed", initials: "SL" },
  { name: "James Whitfield", role: "Director", status: "tentative", initials: "JW" },
  { name: "Priya Sharma", role: "Director", status: "confirmed", initials: "PS" },
  { name: "Robert Tanaka", role: "Director", status: "declined", initials: "RT" },
  { name: "Elena Vasquez", role: "Compensation Committee Chair", status: "confirmed", initials: "EV" },
  { name: "Michael O’Brien", role: "CEO", status: "confirmed", initials: "MO" },
  { name: "Lisa Chang", role: "CFO", status: "confirmed", initials: "LC" },
  { name: "Thomas Reed", role: "Corporate Secretary", status: "confirmed", initials: "TR" },
];

// --- Helpers ---
function statusBadge(status: string) {
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    ready: { label: "Ready", bg: "var(--status-success-muted)", fg: "var(--status-success)" },
    "in-progress": { label: "In Progress", bg: "var(--status-warning-muted)", fg: "var(--status-warning)" },
    "not-started": { label: "Not Started", bg: "var(--bg-elevated)", fg: "var(--text-muted)" },
    approved: { label: "Approved", bg: "var(--status-success-muted)", fg: "var(--status-success)" },
    "in-review": { label: "In Review", bg: "var(--status-warning-muted)", fg: "var(--status-warning)" },
    draft: { label: "Draft", bg: "var(--bg-elevated)", fg: "var(--text-muted)" },
    confirmed: { label: "Confirmed", bg: "var(--status-success-muted)", fg: "var(--status-success)" },
    tentative: { label: "Tentative", bg: "var(--status-warning-muted)", fg: "var(--status-warning)" },
    declined: { label: "Declined", bg: "var(--status-error-muted)", fg: "var(--status-error)" },
  };
  const s = map[status] || { label: status, bg: "var(--bg-elevated)", fg: "var(--text-muted)" };
  return (
    <span
      style={{
        backgroundColor: s.bg,
        color: s.fg,
        padding: "2px 10px",
        borderRadius: "var(--radius-full)",
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

function ProgressBar({ complete, total }: { complete: number; total: number }) {
  const pct = total > 0 ? (complete / total) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          borderRadius: "var(--radius-full)",
          backgroundColor: "var(--bg-elevated)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: "var(--radius-full)",
            backgroundColor: pct === 100 ? "var(--status-success)" : "var(--action-default)",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500, minWidth: 36 }}>
        {complete}/{total}
      </span>
    </div>
  );
}

// --- Components ---
function TopNav() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid var(--border-default)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--brand-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>D</span>
        </div>
        <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
          Diligent Boards
        </span>
        <span
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            padding: "2px 8px",
            backgroundColor: "var(--bg-elevated)",
            borderRadius: "var(--radius-full)",
          }}
        >
          Board Meeting Prep
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Next meeting in 17 days</span>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--action-default)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-inverse)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          CA
        </div>
      </div>
    </header>
  );
}

function MeetingsList() {
  const [selectedId, setSelectedId] = useState(1);
  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid var(--border-default)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
          Upcoming Meetings
        </h2>
        <span
          style={{
            fontSize: 12,
            color: "var(--action-default)",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          View Calendar
        </span>
      </div>
      <div>
        {meetings.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelectedId(m.id)}
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--border-muted)",
              cursor: "pointer",
              backgroundColor: selectedId === m.id ? "var(--action-muted)" : "transparent",
              transition: "background-color 0.15s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                {m.title}
              </span>
              {statusBadge(m.status)}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 12,
                color: "var(--text-secondary)",
                marginBottom: 8,
              }}
            >
              <span>{m.date}</span>
              <span>{m.time}</span>
              <span>{m.location}</span>
            </div>
            <ProgressBar complete={m.docsComplete} total={m.docsTotal} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentChecklist() {
  const [filter, setFilter] = useState<string>("all");
  const filtered =
    filter === "all" ? documents : documents.filter((d) => d.status === filter);
  const counts = {
    all: documents.length,
    approved: documents.filter((d) => d.status === "approved").length,
    "in-review": documents.filter((d) => d.status === "in-review").length,
    draft: documents.filter((d) => d.status === "draft").length,
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
            Document Checklist
          </h2>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {counts.approved}/{counts.all} approved
          </span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["all", "approved", "in-review", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "4px 12px",
                fontSize: 12,
                fontWeight: 500,
                borderRadius: "var(--radius-full)",
                border: "1px solid",
                borderColor: filter === f ? "var(--action-default)" : "var(--border-default)",
                backgroundColor: filter === f ? "var(--action-muted)" : "transparent",
                color: filter === f ? "var(--action-default)" : "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              {f === "all" ? "All" : f === "in-review" ? "In Review" : f.charAt(0).toUpperCase() + f.slice(1)}{" "}
              ({counts[f]})
            </button>
          ))}
        </div>
      </div>
      <div>
        {filtered.map((doc) => (
          <div
            key={doc.id}
            style={{
              padding: "12px 20px",
              borderBottom: "1px solid var(--border-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "var(--radius-sm)",
                    border:
                      doc.status === "approved"
                        ? "none"
                        : "1.5px solid var(--border-emphasis)",
                    backgroundColor:
                      doc.status === "approved" ? "var(--status-success)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 11,
                    color: "#fff",
                  }}
                >
                  {doc.status === "approved" && "✓"}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {doc.name}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 26 }}>
                {doc.category} · {doc.owner}
              </div>
            </div>
            {statusBadge(doc.status)}
          </div>
        ))}
      </div>
    </div>
  );
}

function AttendeePanel() {
  const confirmed = attendees.filter((a) => a.status === "confirmed").length;
  const avatarColors = [
    "#455D82", "#6B5D4D", "#5E4B7A", "#3D6B4F", "#8B6914", "#943B3B",
    "#2C4A6E", "#804200", "#41005D", "#19519d",
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid var(--border-default)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
          Attendees
        </h2>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {confirmed}/{attendees.length} confirmed
        </span>
      </div>
      <div style={{ padding: "8px 0" }}>
        {attendees.map((a, i) => (
          <div
            key={a.name}
            style={{
              padding: "10px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--radius-full)",
                backgroundColor: avatarColors[i % avatarColors.length],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {a.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                {a.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{a.role}</div>
            </div>
            {statusBadge(a.status)}
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryCards() {
  const cards = [
    {
      label: "Meetings This Quarter",
      value: "4",
      sub: "Next: Apr 8",
      color: "var(--action-default)",
    },
    {
      label: "Documents Ready",
      value: "5/10",
      sub: "5 approved, 3 in review",
      color: "var(--status-success)",
    },
    {
      label: "Attendance Rate",
      value: "90%",
      sub: "9 of 10 confirmed",
      color: "var(--status-info)",
    },
    {
      label: "Action Items",
      value: "3",
      sub: "Due before Apr 8",
      color: "var(--status-warning)",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-lg)",
            padding: "16px 20px",
          }}
        >
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{c.label}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: c.color, marginBottom: 2 }}>
            {c.value}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}

// --- Page ---
export default function BoardMeetingPrep() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-base)" }}>
      <TopNav />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 48px" }}>
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: "0 0 4px",
            }}
          >
            Board Meeting Prep
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
            Track upcoming meetings, document readiness, and attendee confirmations.
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <SummaryCards />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <MeetingsList />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <DocumentChecklist />
            <AttendeePanel />
          </div>
        </div>
      </main>
    </div>
  );
}