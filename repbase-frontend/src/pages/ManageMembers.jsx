import { useState } from "react";
import { Avatar } from "./AdminDashboard";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:          "#0d0f10",
  surface:     "#141618",
  card:        "#1a1d1f",
  cardHover:   "#1f2224",
  border:      "#252829",
  borderMid:   "#2e3235",
  borderFocus: "#1e9bcc",
  accent:      "#1e9bcc",
  accentBright:"#2db8ef",
  accentDim:   "rgba(30,155,204,0.12)",
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
const SANS = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const BODY = "'Inria Sans', Georgia, serif";

const MEMBERSHIP_PLANS = [
  { plan_id:1, plan_name:"Monthly Basic",  duration:30,  price:1500, gym_id:1 },
  { plan_id:2, plan_name:"Quarterly Pro",  duration:90,  price:4000, gym_id:1 },
];

function statusMeta(s) {
  if (s === "Active")    return { bg: "rgba(102,187,106,0.12)", text: "#66bb6a", border: "rgba(102,187,106,0.3)" };
  if (s === "Expired")   return { bg: "rgba(239,83,80,0.12)",  text: "#ef5350", border: "rgba(239,83,80,0.3)" };
  if (s === "Suspended") return { bg: "rgba(255,167,38,0.12)", text: "#ffa726", border: "rgba(255,167,38,0.3)" };
  return { bg: C.accentDim, text: C.accentBright, border: "rgba(30,155,204,0.3)" };
}

const INPUT = {
  width: "100%", background: C.surface, border: `1px solid ${C.border}`,
  borderRadius: 9, padding: "10px 13px", color: C.text,
  fontFamily: BODY, fontSize: 14, outline: "none",
  boxSizing: "border-box", transition: "border-color 0.15s",
};

// ─── MEMBER FORM MODAL ────────────────────────────────────────────────────────
function MemberModal({ member, onSave, onClose, onDelete }) {
  const isNew = !member;
  const [form, setForm] = useState(member ? { ...member } : {
    name:"", date_of_birth:"", gender:"", email:"", phone:"",
    gym_id:1, status:"Active", plan_name:"Monthly Basic", expiry_date:"",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: C.surface, border: `1px solid ${C.borderMid}`, borderRadius: 16, width: 520, maxHeight: "88vh", overflowY: "auto", padding: "28px 28px 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 16, color: C.text }}>{isNew ? "Add New Member" : "Edit Member"}</div>
            {!isNew && <div style={{ fontFamily: BODY, fontSize: 12, color: C.textDim, marginTop: 2, fontWeight: 300 }}>ID #{member.member_id}</div>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textSub, cursor: "pointer", fontSize: 22, lineHeight: 1, padding: 0 }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Name */}
          <Field label="Full Name">
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Arjun Roy" style={INPUT} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Date of Birth">
              <input type="date" value={form.date_of_birth} onChange={e => set("date_of_birth", e.target.value)} style={INPUT} />
            </Field>
            <Field label="Gender">
              <select value={form.gender} onChange={e => set("gender", e.target.value)} style={INPUT}>
                <option value="">Select…</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </Field>
          </div>

          <Field label="Email">
            <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="member@example.com" style={INPUT} />
          </Field>

          <Field label="Phone">
            <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="10-digit number" style={INPUT} />
          </Field>

          {/* Divider */}
          <div style={{ height: 1, background: C.border }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Membership Plan">
              <select value={form.plan_name} onChange={e => set("plan_name", e.target.value)} style={INPUT}>
                {MEMBERSHIP_PLANS.map(p => <option key={p.plan_id}>{p.plan_name}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => set("status", e.target.value)} style={INPUT}>
                <option>Active</option><option>Expired</option><option>Suspended</option>
              </select>
            </Field>
          </div>

          <Field label="Expiry Date">
            <input type="date" value={form.expiry_date} onChange={e => set("expiry_date", e.target.value)} style={INPUT} />
          </Field>

          {/* Info callout */}
          {isNew && (
            <div style={{ background: C.accentDim, border: "1px solid rgba(30,155,204,0.2)", borderRadius: 9, padding: "11px 14px", display: "flex", gap: 9 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accentBright} strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              <p style={{ fontFamily: BODY, fontSize: 12, color: C.textSub, lineHeight: 1.55, margin: 0, fontWeight: 300 }}>
                A default password will be generated and assigned. The member can update it after first login.
              </p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
            <button onClick={() => onSave(form)} style={{
              flex: 2, background: C.accent, border: "none", borderRadius: 9, padding: "11px",
              color: "#fff", fontFamily: SANS, fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = C.accentBright}
              onMouseLeave={e => e.currentTarget.style.background = C.accent}
            >{isNew ? "Add Member" : "Save Changes"}</button>
            {!isNew && (
              <button onClick={() => onDelete(form.member_id)} style={{
                flex: 1, background: C.redDim, border: "1px solid rgba(239,83,80,0.3)", borderRadius: 9,
                padding: "11px", color: C.red, fontFamily: SANS, fontSize: 13, cursor: "pointer",
              }}>Remove</button>
            )}
            <button onClick={onClose} style={{
              flex: 1, background: "none", border: `1px solid ${C.border}`, borderRadius: 9,
              padding: "11px", color: C.textSub, fontFamily: SANS, fontSize: 13, cursor: "pointer",
            }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontFamily: SANS, fontSize: 11, color: C.textSub, display: "block", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</label>
      {children}
    </div>
  );
}

// ─── MANAGE MEMBERS PAGE ──────────────────────────────────────────────────────
// Props:
//   members, setMembers  – state from parent
//   onBack               – () => void  navigate back to AdminDashboard
export default function ManageMembers({ members, setMembers, onBack }) {
  const [search,       setSearch]  = useState("");
  const [filterStatus, setFilter]  = useState("All");
  const [editing,      setEditing] = useState(null); // null | "new" | member object
  const [toast,        setToast]   = useState("");

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  function handleSave(form) {
    if (!form.name.trim() || !form.email.trim()) { showToast("Name and email are required."); return; }
    if (editing === "new") {
      setMembers(prev => [...prev, { ...form, member_id: Date.now() }]);
      showToast("Member added successfully.");
    } else {
      setMembers(prev => prev.map(m => m.member_id === form.member_id ? form : m));
      showToast("Member details updated.");
    }
    setEditing(null);
  }

  function handleDelete(id) {
    setMembers(prev => prev.filter(m => m.member_id !== id));
    setEditing(null);
    showToast("Member removed.");
  }

  const filtered = members.filter(m =>
    (filterStatus === "All" || m.status === filterStatus) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) ||
     m.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 28px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inria+Sans:wght@300;400;700&family=Inter:wght@400;500;600;700&display=swap');
        input:focus, select:focus { border-color: ${C.borderFocus} !important; outline: none; }
        select option { background: ${C.surface}; color: ${C.text}; }
        ::placeholder { color: ${C.textDim}; font-family: 'Inria Sans', Georgia, serif; font-size: 13px; }
      `}</style>

      {editing && (
        <MemberModal
          member={editing === "new" ? null : editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
          onDelete={handleDelete}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 400,
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
          padding: "11px 20px", fontFamily: SANS, fontSize: 13, color: C.text,
          display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          {toast}
        </div>
      )}

      {/* Back */}
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textSub, fontFamily: SANS, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 24, padding: 0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        Admin Dashboard
      </button>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h2 style={{ fontFamily: SANS, fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>Members</h2>
          <p style={{ fontFamily: BODY, fontSize: 13, color: C.textSub, margin: "5px 0 0", fontWeight: 300 }}>{members.length} members enrolled · Iron Gym</p>
        </div>
        <button onClick={() => setEditing("new")} style={{
          background: C.accent, border: "none", borderRadius: 9, padding: "9px 18px",
          color: "#fff", fontFamily: SANS, fontSize: 13, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = C.accentBright}
          onMouseLeave={e => e.currentTarget.style.background = C.accent}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Add Member
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <input
            placeholder="Search by name or email…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...INPUT, paddingLeft: 36 }}
          />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2" strokeLinecap="round"
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        {["All","Active","Expired","Suspended"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            background: filterStatus === s ? C.accentDim : C.card,
            border: `1px solid ${filterStatus === s ? C.accent : C.border}`,
            color: filterStatus === s ? C.accentBright : C.textSub,
            borderRadius: 8, padding: "8px 15px", fontFamily: SANS, fontSize: 12,
            fontWeight: filterStatus === s ? 600 : 400, cursor: "pointer", transition: "all 0.15s",
          }}>{s}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
        {/* Col headers */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.6fr 1.1fr 1.2fr 70px", padding: "10px 20px", borderBottom: `1px solid ${C.border}` }}>
          {["Member","Contact","Plan","Status",""].map(h => (
            <div key={h} style={{ fontFamily: SANS, fontSize: 10, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: "52px 20px", textAlign: "center", fontFamily: BODY, fontSize: 14, color: C.textDim, fontWeight: 300 }}>No members match your search.</div>
        )}

        {filtered.map((m, i) => {
          const sc = statusMeta(m.status);
          return (
            <div key={m.member_id}
              style={{
                display: "grid", gridTemplateColumns: "2fr 1.6fr 1.1fr 1.2fr 70px",
                padding: "14px 20px", alignItems: "center",
                borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none",
                transition: "background 0.12s", cursor: "default",
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.cardHover}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <Avatar name={m.name} size={34} />
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.text }}>{m.name}</div>
                  <div style={{ fontFamily: BODY, fontSize: 11, color: C.textDim, marginTop: 1, fontWeight: 300 }}>ID #{m.member_id}</div>
                </div>
              </div>
              <div>
                <div style={{ fontFamily: BODY, fontSize: 12, color: C.textSub }}>{m.email}</div>
                <div style={{ fontFamily: BODY, fontSize: 11, color: C.textDim, marginTop: 1, fontWeight: 300 }}>{m.phone}</div>
              </div>
              <div>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.text }}>{m.plan_name}</div>
                <div style={{ fontFamily: BODY, fontSize: 11, color: C.textDim, marginTop: 1, fontWeight: 300 }}>Exp: {m.expiry_date}</div>
              </div>
              <span style={{
                display: "inline-block", background: sc.bg, color: sc.text,
                border: `1px solid ${sc.border}`, borderRadius: 20,
                padding: "3px 11px", fontFamily: SANS, fontSize: 11, fontWeight: 600,
              }}>{m.status}</span>
              <button onClick={() => setEditing(m)} style={{
                background: "none", border: `1px solid ${C.border}`, borderRadius: 7,
                padding: "5px 12px", color: C.textSub, fontFamily: SANS, fontSize: 11,
                cursor: "pointer", transition: "all 0.12s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accentBright; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.textSub; }}
              >Edit</button>
            </div>
          );
        })}
      </div>

      {filtered.length > 0 && (
        <div style={{ fontFamily: BODY, fontSize: 12, color: C.textDim, marginTop: 10, textAlign: "right", fontWeight: 300 }}>
          Showing {filtered.length} of {members.length} members
        </div>
      )}
    </div>
  );
}
