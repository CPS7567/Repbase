import { C, SANS } from '../utils/theme';

export default function NavBar({ page, setPage, role, setRole, onLogout }) {
  const tabs = [
    { id: "home", label: "Home" },
    { id: "membership", label: "Membership" },
    { id: "workout", label: "Workout" },
    { id: "history", label: "History" },
    { id: "profile", label: "Profile" },
    ...(role === "Admin" || role === "Dev" ? [{ id: "admin", label: "Admin" }] : []),
  ];

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: C.surface, borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center", padding: "0 28px", height: 52, gap: 32,
    }}>
      {/* Logo Section */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: 4, background: C.accent, display: "flex", alignItems: "center", justifyCenter: "center" }}>
          <span style={{ color: "#fff", fontWeight: 900 }}>R</span>
        </div>
        <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: "0.05em" }}>REPBASE</span>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: 2, flex: 1 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setPage(t.id)} style={{
            background: page === t.id ? C.accentDim : "transparent",
            border: "none",
            color: page === t.id ? C.accentBright : C.textSub,
            borderRadius: 7, padding: "5px 14px", fontSize: 13, cursor: "pointer",
            fontFamily: SANS, fontWeight: page === t.id ? 600 : 400, transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Role Selector & Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: C.textDim, fontFamily: SANS, textTransform: "uppercase" }}>Role</span>
          <select value={role} onChange={e => setRole(e.target.value)} style={{
            background: C.card, color: C.text, border: `1px solid ${C.border}`,
            borderRadius: 6, padding: "3px 8px", fontSize: 11, fontFamily: SANS, cursor: "pointer",
          }}>
            {["Member", "Admin", "Dev"].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        {onLogout && (
          <button onClick={onLogout} style={{
            background: "transparent",
            border: "none",
            color: C.textSub,
            fontSize: 12,
            fontFamily: SANS,
            cursor: "pointer",
            padding: "5px 0",
          }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}