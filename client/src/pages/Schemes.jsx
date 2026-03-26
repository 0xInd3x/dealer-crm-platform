import { useEffect, useState } from "react";
import api from "../apiClient";
import Layout from "../components/Layout";

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [form, setForm] = useState({ name: "", type: "lead", reward: "", criteria: "", active: true });
  const [editing, setEditing] = useState(null);

  const load = () => api.get("/schemes").then(res => setSchemes(res.data));
  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault();
    await api.post("/schemes", form);
    setForm({ name: "", type: "lead", reward: "", criteria: "", active: true });
    load();
  };

  const saveEdit = async () => {
    const { _id, ...rest } = editing;
    await api.put(`/schemes/${_id}`, rest);
    setEditing(null);
    load();
  };

  return (
    <Layout>
      <div className="topbar"><h2>Schemes & Incentives</h2></div>
      <div className="card" style={{ marginBottom: 14 }}>
        <h3>Create Scheme</h3>
        <form onSubmit={submit} className="row">
          <div><label>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
          <div><label>Type</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="lead">Lead</option><option value="sales">Sales</option></select></div>
          <div><label>Reward</label><input value={form.reward} onChange={e => setForm({ ...form, reward: e.target.value })} /></div>
          <div><label>Criteria</label><input value={form.criteria} onChange={e => setForm({ ...form, criteria: e.target.value })} /></div>
          <div><label>Active</label><select value={form.active} onChange={e => setForm({ ...form, active: e.target.value === "true" })}><option value="true">Active</option><option value="false">Inactive</option></select></div>
          <div style={{ display: "flex", alignItems: "end" }}><button className="button">Save</button></div>
        </form>
      </div>

      <div className="card">
        <h3>All Schemes</h3>
        <table className="table">
          <thead><tr><th>Name</th><th>Type</th><th>Reward</th><th>Criteria</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {schemes.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.type}</td>
                <td>{s.reward}</td>
                <td>{s.criteria}</td>
                <td>{s.active ? "Active" : "Inactive"}</td>
                <td><button className="button secondary" onClick={() => setEditing({ ...s })}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3>Edit Scheme</h3>
          <div className="row">
            <div><label>Name</label><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><label>Type</label><select value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value })}><option value="lead">Lead</option><option value="sales">Sales</option></select></div>
            <div><label>Reward</label><input value={editing.reward} onChange={e => setEditing({ ...editing, reward: e.target.value })} /></div>
            <div><label>Criteria</label><input value={editing.criteria} onChange={e => setEditing({ ...editing, criteria: e.target.value })} /></div>
            <div><label>Status</label><select value={editing.active} onChange={e => setEditing({ ...editing, active: e.target.value === "true" })}><option value="true">Active</option><option value="false">Inactive</option></select></div>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button className="button" onClick={saveEdit}>Save</button>
            <button className="button secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </Layout>
  );
}