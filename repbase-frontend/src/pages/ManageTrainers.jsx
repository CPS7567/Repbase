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
  text:        "#f0f2f4",
  textSub:     "#8a9099",
  textDim:     "#4a5058",
};
const SANS = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const BODY = "'Inria Sans', Georgia, serif";

const INPUT = {
  width: "100%", background: C.surface, border: `1px solid ${C.border}`,
  borderRadius: 9, padding: "10px 13px", color: C.text,
  fontFamily: BODY, fontSize: 14, outline: "none",
  boxSizing: "border-box", transition: "border-color 0.15s",
};

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontFamily: SANS, fontSize: 11, color: C.textSub, display: "block", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</label>
      {children}
    </div>
  );
}

// ─── TRAINER FORM MODAL ───────────────────────────────────────────────────────
function TrainerModal({ trainer, onSave, onClose, onDelete }) {
  const isNew = !trainer;
  const [form, setForm] = useState(trainer ? { ...trainer } : {
    name:"", specialization:"", phone:"", schedule:"", gym_id:1,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: C.surface, border: `1px solid ${C.borderMid}`, borderRadius: 16, width: 480, padding: "28px 28px 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 16, color: C.text }}>{isNew ? "Add New Trainer" : "Edit Trainer"}</div>
            {!isNew && <div style={{ fontFamily: BODY, fontSize: 12, color: C.textDim, marginTop: 2, fontWeight: 300 }}>Trainer #{trainer.trainer_id}</div>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textSub, cursor: "pointer", fontSize: 22, lineHeight: 1, padding: 0 }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <Field label="Full Name">
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Rohit Sharma" style={INPUT} />
          </Field>

          <Field label="Specialization">
            <input value={form.specialization} onChange={e => set("specialization", e.target.value)} placeholder="e.g. Strength & Conditioning" style={INPUT} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Phone">
              <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="10-digit number" style={INPUT} />
            </Field>
            <Field label="Schedule">
              <input value={form.schedule} onChange={e => set("schedule", e.target.value)} placeholder="e.g. Mon–Fri 6am–2pm" style={INPUT} />
            </Field>
          </div>

          {/* Info callout — new trainer only */}
          {isNew && (
            <div style={{ background: C.accentDim, border: "1px solid rgba(30,155,204,0.2)", borderRadius: 9, padding: "11px 14px", display: "flex", gap: 9 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accentBright} strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              <p style={{ fontFamily: BODY, fontSize: 12, color: C.textSub, lineHeight: 1.55, margin: 0, fontWeight: 300 }}>
                A default password will be generated for this trainer. They can change it after first login.
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
            >{isNew ? "Add Trainer" : "Save Changes"}</button>
            {!isNew && (
              <button onClick={() => onDelete(form.trainer_id)} style={{
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

// ─── MANAGE TRAINERS PAGE ─────────────────────────────────────────────────────
// Props:
//   trainers, setTrainers  – state from parent
//   onBack                 – () => void navigate back to AdminDashboard
export default function ManageTrainers({ trainers, setTrainers, onBack }) {
  const [search,  setSearch]  = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | trainer object
  const [toast,   setToast]   = useState("");

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 2500); }

  function handleSave(form) {
    if (!form.name.trim()) { showToast("Trainer name is required."); return; }
    if (editing === "new") {
      setTrainers(prev => [...prev, { ...form, trainer_id: Date.now() }]);
      showToast("Trainer added successfully.");
    } else {
      setTrainers(prev => prev.map(t => t.trainer_id === form.trainer_id ? form : t));
      showToast("Trainer details updated.");
    }
    setEditing(null);
  }

  function handleDelete(id) {
    setTrainers(prev => prev.filter(t => t.trainer_id !== id));
    setEditing(null);
    showToast("Trainer removed.");
  }

  const filtered = trainers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.specialization || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 28px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inria+Sans:wght@300;400;700&family=Inter:wght@400;500;600;700&display=swap');
        input:focus, select:focus { border-color: ${C.borderFocus} !important; outline: none; }
        ::placeholder { color: ${C.textDim}; font-family: 'Inria Sans', Georgia, serif; font-size: 13px; }
      `}</style>

      {editing && (
        <TrainerModal
          trainer={editing === "new" ? null : editing}
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
          <h2 style={{ fontFamily: SANS, fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>Trainers</h2>
          <p style={{ fontFamily: BODY, fontSize: 13, color: C.textSub, margin: "5px 0 0", fontWeight: 300 }}>{trainers.length} trainers on staff · Iron Gym</p>
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
          Add Trainer
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20, maxWidth: 360 }}>
        <input
          placeholder="Search by name or specialization…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...INPUT, paddingLeft: 36 }}
        />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2" strokeLinecap="round"
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>

      {/* Cards grid */}
      {filtered.length === 0 && (
        <div style={{ padding: "52px 0", textAlign: "center", fontFamily: BODY, fontSize: 14, color: C.textDim, fontWeight: 300 }}>No trainers found.</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 12 }}>
        {filtered.map(t => (
          <div key={t.trainer_id}
            onClick={() => setEditing(t)}
            style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
              padding: "20px", display: "flex", flexDirection: "column", gap: 14,
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.background = C.cardHover; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;    e.currentTarget.style.background = C.card; }}
          >
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name={t.name} size={44} />
              <div>
                <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.text }}>{t.name}</div>
                <div style={{ fontFamily: BODY, fontSize: 11, color: C.textDim, marginTop: 2, fontWeight: 300 }}>Trainer #{t.trainer_id}</div>
              </div>
              {/* Edit hint */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="1.8" strokeLinecap="round" style={{ marginLeft: "auto", flexShrink: 0 }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>

            <div style={{ height: 1, background: C.border }} />

            {/* Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <DetailRow icon={
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.accentBright} strokeWidth="2" strokeLinecap="round">
                  <path d="M6 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12"/>
                </svg>
              } text={t.specialization || "—"} />
              <DetailRow icon={
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6A16 16 0 0 0 15.4 16.09l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              } text={t.phone || "—"} />
              <DetailRow icon={
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              } text={t.schedule || "—"} />
            </div>
          </div>
        ))}

        {/* Add trainer card */}
        <div
          onClick={() => setEditing("new")}
          style={{
            background: "transparent", border: `2px dashed ${C.border}`, borderRadius: 14,
            padding: "20px", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 10,
            cursor: "pointer", transition: "all 0.15s", minHeight: 160,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: C.accentDim,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accentBright} strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <span style={{ fontFamily: SANS, fontSize: 13, color: C.textSub }}>Add Trainer</span>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flexShrink: 0, width: 16, display: "flex", justifyContent: "center" }}>{icon}</div>
      <span style={{ fontFamily: BODY, fontSize: 12, color: C.textSub, fontWeight: 300 }}>{text}</span>
    </div>
  );
}
