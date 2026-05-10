import { useState } from "react";

// ─── DESIGN TOKENS (matches RepBase.jsx exactly) ──────────────────────────────
const C = {
  bg:          "#0d0f10",
  surface:     "#141618",
  card:        "#1a1d1f",
  cardHover:   "#1f2224",
  border:      "#252829",
  borderMid:   "#2e3235",
  accent:      "#1e9bcc",
  accentBright:"#2db8ef",
  accentDim:   "rgba(30,155,204,0.12)",
  accentText:  "#4fc3f7",
  red:         "#ef5350",
  redDim:      "rgba(239,83,80,0.12)",
  green:       "#66bb6a",
  greenDim:    "rgba(102,187,106,0.12)",
  amber:       "#ffa726",
  amberDim:    "rgba(255,167,38,0.12)",
  text:        "#f0f2f4",
  textSub:     "#8a9099",
  textDim:     "#4a5058",
};

// Inter for UI chrome (nav, labels, numbers) — matches RepBase.jsx
const SANS = "'Inter', 'Helvetica Neue', Arial, sans-serif";
// Inria Sans for descriptive / body copy — matches LoginPage.jsx
const BODY = "'Inria Sans', Georgia, serif";

// ─── SEED DATA (mirrors reping.sql) ───────────────────────────────────────────
export const SEED_MEMBERS = [
  { member_id:1, name:"second",      date_of_birth:"1999-01-01", gender:"Male",   email:"q@gmail.com",      phone:"9876543210", gym_id:1, user_id:2, status:"Active",    plan_name:"Monthly Basic",  expiry_date:"2026-04-16" },
  { member_id:2, name:"Arjun Roy",   date_of_birth:"2001-05-14", gender:"Male",   email:"arjun@gmail.com",  phone:"9123456780", gym_id:1, user_id:5, status:"Active",    plan_name:"Quarterly Pro",  expiry_date:"2026-06-01" },
  { member_id:3, name:"Priya Sen",   date_of_birth:"1998-11-22", gender:"Female", email:"priya@gmail.com",  phone:"9988776655", gym_id:1, user_id:6, status:"Expired",   plan_name:"Monthly Basic",  expiry_date:"2026-02-28" },
  { member_id:4, name:"Karan Das",   date_of_birth:"2000-03-09", gender:"Male",   email:"karan@gmail.com",  phone:"9012345678", gym_id:1, user_id:7, status:"Active",    plan_name:"Monthly Basic",  expiry_date:"2026-04-05" },
  { member_id:5, name:"Meera Iyer",  date_of_birth:"1995-07-30", gender:"Female", email:"meera@gmail.com",  phone:"8765432109", gym_id:1, user_id:8, status:"Suspended", plan_name:"Quarterly Pro",  expiry_date:"2026-05-15" },
];

export const SEED_TRAINERS = [
  { trainer_id:1, name:"Rohit Sharma",  specialization:"Strength & Conditioning", phone:"9876501234", schedule:"Mon–Fri 6am–2pm",  gym_id:1, user_id:null },
  { trainer_id:2, name:"Anjali Mehta",  specialization:"Yoga & Flexibility",       phone:"9123409876", schedule:"Mon–Sat 8am–4pm",  gym_id:1, user_id:null },
  { trainer_id:3, name:"Dev Kapoor",    specialization:"Cardio & Weight Loss",     phone:"9988001122", schedule:"Tue–Sun 10am–6pm", gym_id:1, user_id:null },
];

export const SEED_PAYMENTS = [
  { payment_id:1, payment_date:"2026-01-05", amount:1500, payment_method:"UPI",  payment_status:"Completed", member_id:1 },
  { payment_id:2, payment_date:"2026-01-18", amount:4000, payment_method:"Card", payment_status:"Completed", member_id:2 },
  { payment_id:3, payment_date:"2026-02-03", amount:1500, payment_method:"UPI",  payment_status:"Completed", member_id:3 },
  { payment_id:4, payment_date:"2026-02-20", amount:1500, payment_method:"Cash", payment_status:"Completed", member_id:4 },
  { payment_id:5, payment_date:"2026-03-01", amount:1500, payment_method:"UPI",  payment_status:"Completed", member_id:1 },
  { payment_id:6, payment_date:"2026-03-10", amount:4000, payment_method:"Card", payment_status:"Completed", member_id:5 },
  { payment_id:7, payment_date:"2026-03-15", amount:1500, payment_method:"UPI",  payment_status:"Completed", member_id:4 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function monthlyRevenue(payments) {
  const map = {};
  payments.forEach(p => {
    if (p.payment_status !== "Completed") return;
    const d   = new Date(p.payment_date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!map[key]) map[key] = { label: MONTHS[d.getMonth()], total: 0 };
    map[key].total += p.amount;
  });
  return Object.values(map).slice(-6);
}

export function initials(name) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export function Avatar({ name, size = 36 }) {
  const palette = ["#1e9bcc","#66bb6a","#ffa726","#ef5350","#ab47bc","#26c6da"];
  const color   = palette[name.charCodeAt(0) % palette.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `${color}20`, border: `1.5px solid ${color}40`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: SANS, fontSize: Math.round(size * 0.34), fontWeight: 600, color,
    }}>
      {initials(name)}
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
      <div style={{ fontFamily: SANS, fontSize: 11, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: SANS, fontSize: 26, fontWeight: 700, color: color || C.accentBright, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: BODY, fontSize: 12, color: C.textDim, marginTop: 6, fontWeight: 300 }}>{sub}</div>}
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
// Props:
//   sessions   – workout sessions array (from RepBase state)
//   members    – state array
//   trainers   – state array
//   onManageMembers  – () => void  navigate to ManageMembers
//   onManageTrainers – () => void  navigate to ManageTrainers
export default function AdminDashboard({ sessions = [], members = SEED_MEMBERS, trainers = SEED_TRAINERS, onManageMembers, onManageTrainers }) {
  const today         = new Date();
  const thisMonth     = today.getMonth();
  const activeCount   = members.filter(m => m.status === "Active").length;
  const expiredCount  = members.filter(m => m.status === "Expired").length;
  const suspCount     = members.filter(m => m.status === "Suspended").length;
  const totalRevenue  = SEED_PAYMENTS.filter(p => p.payment_status === "Completed").reduce((a, p) => a + p.amount, 0);
  const monthRevenue  = SEED_PAYMENTS.filter(p => new Date(p.payment_date).getMonth() === thisMonth && p.payment_status === "Completed").reduce((a, p) => a + p.amount, 0);
  const revenueChart  = monthlyRevenue(SEED_PAYMENTS);
  const maxRev        = Math.max(...revenueChart.map(r => r.total), 1);

  const expiringSoon = members.filter(m => {
    if (m.status !== "Active") return false;
    const diff = (new Date(m.expiry_date) - today) / 864e5;
    return diff >= 0 && diff <= 14;
  });

  const exFreq = {};
  sessions.forEach(s => s.exercises?.forEach(ex => { exFreq[ex.name] = (exFreq[ex.name] || 0) + 1; }));
  const topEx = Object.entries(exFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "36px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inria+Sans:wght@300;400;700&family=Inter:wght@400;500;600;700&display=swap');
        select option { background: ${C.surface}; color: ${C.text}; }
      `}</style>

      {/* ── Page header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontFamily: SANS, fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>Admin Dashboard</h2>
          <p style={{ fontFamily: BODY, fontSize: 13, color: C.textSub, margin: "5px 0 0", fontWeight: 300 }}>Iron Gym · New Delhi</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onManageMembers} style={{
            background: C.accent, border: "none", borderRadius: 9, padding: "9px 18px",
            color: "#fff", fontFamily: SANS, fontSize: 13, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7, transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = C.accentBright}
            onMouseLeave={e => e.currentTarget.style.background = C.accent}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Manage Members
          </button>
          <button onClick={onManageTrainers} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 18px",
            color: C.text, fontFamily: SANS, fontSize: 13, fontWeight: 500, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7, transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accentBright; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12"/>
            </svg>
            Manage Trainers
          </button>
        </div>
      </div>

      {/* ── KPI row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        <StatCard label="Total Members"   value={members.length}                              sub={`${activeCount} active`} />
        <StatCard label="Trainers"        value={trainers.length}                             sub="on staff"   color={C.green} />
        <StatCard label="Monthly Revenue" value={`₹${monthRevenue.toLocaleString("en-IN")}`} sub="this month"  color={C.amber} />
        <StatCard label="Total Revenue"   value={`₹${(totalRevenue/1000).toFixed(1)}k`}      sub="all time"    color={C.amber} />
        <StatCard label="Expiring Soon"   value={expiringSoon.length}                        sub="within 14 days" color={expiringSoon.length > 0 ? C.red : C.textSub} />
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 12 }}>

        {/* Revenue bar chart */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 3 }}>Monthly Revenue</div>
          <div style={{ fontFamily: BODY, fontSize: 12, color: C.textSub, marginBottom: 20, fontWeight: 300 }}>Last 6 months · Completed payments only</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 110 }}>
            {revenueChart.map((r, i) => {
              const isLatest = i === revenueChart.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <span style={{ fontFamily: SANS, fontSize: 9, color: isLatest ? C.accentBright : C.textDim }}>
                    ₹{(r.total / 1000).toFixed(1)}k
                  </span>
                  <div style={{
                    width: "100%", borderRadius: "4px 4px 0 0",
                    background: isLatest ? C.accent : "rgba(30,155,204,0.28)",
                    height: `${Math.max((r.total / maxRev) * 84, 4)}px`,
                    transition: "height 0.4s",
                  }}/>
                  <span style={{ fontFamily: SANS, fontSize: 10, color: C.textDim }}>{r.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Membership status */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 3 }}>Membership Status</div>
          <div style={{ fontFamily: BODY, fontSize: 12, color: C.textSub, marginBottom: 20, fontWeight: 300 }}>Across all enrolled members</div>
          {[
            { label: "Active",    count: activeCount,  color: C.green },
            { label: "Expired",   count: expiredCount, color: C.red },
            { label: "Suspended", count: suspCount,    color: C.amber },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }} />
                  <span style={{ fontFamily: SANS, fontSize: 12, color: C.text }}>{s.label}</span>
                </div>
                <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: C.text }}>{s.count}</span>
              </div>
              <div style={{ height: 5, background: C.surface, borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 3, background: s.color,
                  width: `${members.length ? (s.count / members.length) * 100 : 0}%`,
                  transition: "width 0.4s",
                }}/>
              </div>
            </div>
          ))}
          <div style={{ height: 1, background: C.border, margin: "14px 0 12px" }}/>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: BODY, fontSize: 12, color: C.textSub, fontWeight: 300 }}>Total members</span>
            <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.text }}>{members.length}</span>
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>

        {/* Expiring soon */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
            <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text }}>Expiring Soon</span>
          </div>
          {expiringSoon.length === 0 ? (
            <div style={{ fontFamily: BODY, fontSize: 13, color: C.textDim, fontWeight: 300 }}>No memberships expiring in the next 14 days.</div>
          ) : expiringSoon.slice(0, 4).map(m => {
            const days = Math.ceil((new Date(m.expiry_date) - today) / 864e5);
            return (
              <div key={m.member_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar name={m.name} size={28} />
                  <span style={{ fontFamily: SANS, fontSize: 12, color: C.text }}>{m.name}</span>
                </div>
                <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color: days <= 3 ? C.red : C.amber }}>{days}d</span>
              </div>
            );
          })}
        </div>

        {/* Top exercises */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px" }}>
          <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>Top Exercises</div>
          {topEx.length === 0 ? (
            <div style={{ fontFamily: BODY, fontSize: 13, color: C.textDim, fontWeight: 300 }}>No workout session data yet.</div>
          ) : topEx.map(([name, count]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontFamily: SANS, fontSize: 12, color: C.text, flex: 1 }}>{name}</span>
              <div style={{ width: 60, height: 4, background: C.surface, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(count / topEx[0][1]) * 100}%`, background: C.accent, borderRadius: 2 }}/>
              </div>
              <span style={{ fontFamily: SANS, fontSize: 11, color: C.textSub, minWidth: 14, textAlign: "right" }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Recent payments */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px" }}>
          <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>Recent Payments</div>
          {[...SEED_PAYMENTS].reverse().slice(0, 4).map(p => {
            const m = members.find(x => x.member_id === p.member_id);
            return (
              <div key={p.payment_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 12, color: C.text }}>{m?.name || `Member #${p.member_id}`}</div>
                  <div style={{ fontFamily: BODY, fontSize: 11, color: C.textDim, marginTop: 1, fontWeight: 300 }}>{p.payment_date} · {p.payment_method}</div>
                </div>
                <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, color: C.green }}>+₹{p.amount.toLocaleString("en-IN")}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
