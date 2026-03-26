import { useEffect, useMemo, useState } from "react";
import api from "../apiClient";
import Layout from "../components/Layout";

const statusOptions = ["new", "contacted", "converted", "lost"];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", area: "", requirement: "", dealer: "" });

  const load = () => api.get("/leads").then(res => setLeads(res.data));
  useEffect(() => {
    load();
    api.get("/dealers").then(res => setDealers(res.data));
  }, []);

  const submit = async e => {
    e.preventDefault();
    await api.post("/leads", { ...form, dealer: form.dealer || undefined });
    setForm({ name: "", phone: "", area: "", requirement: "", dealer: "" });
    load();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/leads/${id}`, { status });
    load();
  };

  const grouped = useMemo(() => {
    const g = { new: [], contacted: [], converted: [], lost: [] };
    leads.forEach(l => { g[l.status || "new"]?.push(l); });
    return g;
  }, [leads]);

  return (
    <Layout>
      <div className="topbar">
        <h2>Lead Panel</h2>
      </div>
      <div className="card" style={{ marginBottom: 14 }}>
        <h3>Capture Lead</h3>
        <form onSubmit={submit} className="row">
          <div>
            <label>Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label>Phone</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div>
            <label>Area</label>
            <input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} required />
          </div>
          <div>
            <label>Requirement</label>
            <input value={form.requirement} onChange={e => setForm({ ...form, requirement: e.target.value })} />
          </div>
          <div>
            <label>Assign Dealer (optional)</label>
            <select value={form.dealer} onChange={e => setForm({ ...form, dealer: e.target.value })}>
              <option value="">Auto by area</option>
              {dealers.map(d => (
                <option key={d._id} value={d._id}>{d.name} | {d.area} | {d._id.slice(-6)}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "end" }}>
            <button className="button">Save</button>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <h3>Status Board</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          {statusOptions.map(status => (
            <div key={status} className="card" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{status.toUpperCase()} ({grouped[status].length})</div>
              {grouped[status].map(l => (
                <div key={l._id} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div>{l.name}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12 }}>{l.area} | {l.phone} | {l.dealer ? l.dealer.toString().slice(-6) : "no dealer"}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    {statusOptions.filter(s => s !== status).map(s => (
                      <button key={s} className="button secondary" onClick={() => updateStatus(l._id, s)}>{s}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Lead List</h3>
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Area</th><th>Status</th><th>Dealer</th><th>Dealer ID</th><th></th></tr>
          </thead>
          <tbody>
            {leads.map(l => (
              <tr key={l._id}>
                <td>{l.name}<div style={{ color: "var(--muted)", fontSize: 12 }}>{l.phone}</div></td>
                <td>{l.area}</td>
                <td><span className="badge" style={{ background: "rgba(255,255,255,0.08)" }}>{l.status}</span></td>
                <td>{l.dealer?.name || "Unassigned"}</td>
                <td>{l.dealer ? (l.dealer._id ? l.dealer._id.slice(-6) : l.dealer.toString().slice(-6)) : "-"}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  {statusOptions.map(s => (
                    <button key={s} className="button secondary" onClick={() => updateStatus(l._id, s)}>{s}</button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}