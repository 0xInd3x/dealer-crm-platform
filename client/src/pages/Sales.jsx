import { useEffect, useState } from "react";
import api from "../apiClient";
import Layout from "../components/Layout";

export default function SalesPage() {
  const [team, setTeam] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", areas: "" });

  const load = () => api.get("/sales").then(res => setTeam(res.data));
  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault();
    await api.post("/sales", { ...form, areas: form.areas.split(",").map(a => a.trim()).filter(Boolean) });
    setForm({ name: "", email: "", phone: "", areas: "" });
    load();
  };

  return (
    <Layout>
      <div className="topbar"><h2>Sales Team</h2></div>
      <div className="card" style={{ marginBottom: 14 }}>
        <h3>Add Sales Member</h3>
        <form onSubmit={submit} className="row">
          <div><label>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
          <div><label>Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label>Areas (comma separated)</label><input value={form.areas} onChange={e => setForm({ ...form, areas: e.target.value })} /></div>
          <div style={{ display: "flex", alignItems: "end" }}><button className="button">Save</button></div>
        </form>
      </div>

      <div className="card">
        <h3>Team</h3>
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Areas</th></tr></thead>
          <tbody>
            {team.map(m => (
              <tr key={m._id}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.phone}</td>
                <td>{(m.areas || []).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}