import { useEffect, useMemo, useState } from "react";
import api from "../apiClient";
import Layout from "../components/Layout";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => api.get("/users").then(res => setUsers(res.data));
  useEffect(() => { load(); }, []);

  const startEdit = user => setEditing({ ...user, areasText: (user.areas || []).join(",") });
  const save = async () => {
    const { _id, areasText, ...rest } = editing;
    await api.put(`/users/${_id}`, { ...rest, areas: areasText ? areasText.split(",").map(a => a.trim()).filter(Boolean) : [] });
    setEditing(null);
    load();
  };

  const sorted = useMemo(() => [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [users]);

  return (
    <Layout>
      <div className="topbar">
        <h2>Users (Admin)</h2>
        <button className="button secondary" onClick={load}>Refresh</button>
      </div>
      <div className="card" style={{ marginBottom: 14 }}>
        <h3>All Accounts (newest first)</h3>
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Dealer</th><th>Areas</th><th>Registered</th><th></th></tr></thead>
          <tbody>
            {sorted.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.dealer?.name || "-"}</td><td>{(u.areas || []).join(", ")}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td><button className="button secondary" onClick={() => startEdit(u)}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="card">
          <h3>Edit User</h3>
          <div className="row">
            <div><label>Name</label><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
            <div><label>Role</label><select value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })}>
              <option value="admin">Admin</option><option value="dealer">Dealer</option><option value="sales">Sales</option>
            </select></div>
            <div><label>Dealer Id</label><input value={editing.dealer || ""} onChange={e => setEditing({ ...editing, dealer: e.target.value })} /></div>
            <div><label>Areas</label><input value={editing.areasText} onChange={e => setEditing({ ...editing, areasText: e.target.value })} /></div>
            <div><label>Active</label><select value={editing.active} onChange={e => setEditing({ ...editing, active: e.target.value === "true" })}><option value="true">Active</option><option value="false">Inactive</option></select></div>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button className="button" onClick={save}>Save</button>
            <button className="button secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </Layout>
  );
}