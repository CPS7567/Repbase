import { useState } from "react";
import { C, SANS } from '../utils/theme';
import { CHART_DATA } from '../utils/constants'; 
import { StatPill } from "../components/shared/StatPill";
import { fmtShortDate, fmtDuration } from "../utils/formatters";

export default function ProfilePage({ sessions }) {
  const [chartMode, setChartMode] = useState("Duration");
  const maxHrs = Math.max(...CHART_DATA.map(d => d.hrs));

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Profile header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},#0e7fb3)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 10 }}>cps009</div>
          <div style={{ display: "flex", gap: 28 }}>
            {[{ label: "Workouts", value: 108 }, { label: "Followers", value: 7 }, { label: "Following", value: 7 }].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: SANS, fontSize: 11, color: C.textSub }}>{s.label}</div>
                <div style={{ fontFamily: SANS, fontSize: 17, fontWeight: 700, color: C.text }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textSub }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textSub }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" /></svg></button>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: C.textSub }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg></button>
        </div>
      </div>

      {/* Chart */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div>
            <span style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, color: C.text }}>5 hours</span>
            <span style={{ fontFamily: SANS, fontSize: 14, color: C.textSub, marginLeft: 6 }}>this week</span>
          </div>
          <button style={{ background: "none", border: "none", color: C.accentBright, fontFamily: SANS, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            Last 3 months
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
        {/* Bar chart */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 100, marginBottom: 8, marginTop: 16, paddingLeft: 32, position: "relative" }}>
          {/* Y axis */}
          {[0, 3, 6, 9].map(v => (
            <div key={v} style={{ position: "absolute", left: 0, bottom: `${(v / 10) * 100}%`, fontFamily: SANS, fontSize: 10, color: C.textDim, lineHeight: 1 }}>{v} hrs</div>
          ))}
          {CHART_DATA.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", background: C.accent, borderRadius: "3px 3px 0 0", height: `${(d.hrs / maxHrs) * 90}px`, minHeight: 2, transition: "height 0.3s" }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 3, paddingLeft: 32 }}>
          {CHART_DATA.map((d, i) => (
            <div key={i} style={{ flex: 1, fontFamily: SANS, fontSize: 9, color: C.textDim, textAlign: "center", overflow: "hidden", whiteSpace: "nowrap" }}>{i % 2 === 0 ? d.label : ""}</div>
          ))}
        </div>
        {/* Mode tabs */}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {["Duration", "Volume", "Reps"].map(m => (
            <button key={m} onClick={() => setChartMode(m)} style={{
              background: chartMode === m ? C.accent : "transparent",
              border: `1px solid ${chartMode === m ? C.accent : C.border}`,
              color: chartMode === m ? "#fff" : C.textSub,
              borderRadius: 20, padding: "5px 16px", fontSize: 12, fontFamily: SANS, cursor: "pointer", transition: "all 0.15s",
            }}>{m}</button>
          ))}
        </div>
      </div>

      {/* Dashboard grid */}
      <div>
        <div style={{ fontFamily: SANS, fontSize: 12, color: C.textSub, marginBottom: 12 }}>Dashboard</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.textSub} strokeWidth="1.8" strokeLinecap="round"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>, label: "Statistics" },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.textSub} strokeWidth="1.8" strokeLinecap="round"><path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" /></svg>, label: "Exercises" },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.textSub} strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>, label: "Measures" },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.textSub} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>, label: "Calendar" },
          ].map(item => (
            <button key={item.label} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.borderMid}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              {item.icon}
              <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: C.text }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent workouts */}
      <div>
        <div style={{ fontFamily: SANS, fontSize: 12, color: C.textSub, marginBottom: 12 }}>Workouts</div>
        {sessions.slice(0, 2).map(s => (
          <div key={s.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 22px", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},#0e7fb3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.text }}>cps009</div>
                <div style={{ fontFamily: SANS, fontSize: 11, color: C.textSub }}>{fmtShortDate(s.date)}</div>
              </div>
              <button style={{ marginLeft: "auto", background: "none", border: "none", color: C.textSub, cursor: "pointer", fontSize: 16 }}>⋯</button>
            </div>
            <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 8 }}>{s.name}</div>
            <div style={{ display: "flex", gap: 24 }}>
              <StatPill label="Time" value={fmtDuration(s.duration)} />
              <StatPill label="Volume" value={`${s.volume.toLocaleString()} kg`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}