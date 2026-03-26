export function StatCard({ label, value, hint }) {
  return (
    <div className="card">
      <h3>{label}</h3>
      <div className="value">{value}</div>
      {hint && <div style={{ color: "var(--muted)", fontSize: 12 }}>{hint}</div>}
    </div>
  );
}