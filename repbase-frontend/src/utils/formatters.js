export function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
}

export function fmtShortDate(d) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function fmtDuration(m) {
  return `${Math.floor(m / 60)}h ${m % 60}min`;
}

export function muscleSplit(session, EXERCISES_DB) {
  const counts = {};
  session.exercises.forEach(ex => {
    const dbEx = EXERCISES_DB.find(e => e.id === ex.id);
    (dbEx?.muscles || []).forEach(m => { counts[m] = (counts[m] || 0) + ex.sets.length; });
  });
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(counts).map(([m, c]) => ({ muscle: m, pct: Math.round(c / total * 100) })).sort((a, b) => b.pct - a.pct);
}