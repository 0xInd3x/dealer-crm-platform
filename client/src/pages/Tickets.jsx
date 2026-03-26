import { useEffect, useState } from "react";
import api from "../apiClient";
import Layout from "../components/Layout";
import { useAuthStore } from "../store/auth";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", dealer: "", priority: "medium" });
  const [error, setError] = useState("");
  const { user } = useAuthStore();

  const load = () => api.get("/tickets").then(res => setTickets(res.data));
  useEffect(() => {
    load();
    api.get("/dealers").then(res => setDealers(res.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/tickets", form);
      setForm({ title: "", description: "", dealer: "", priority: "medium" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit ticket");
    }
  };

  const close = async (id) => {
    await api.put(`/tickets/${id}`, { status: "resolved" });
    load();
  };

  const dealerFieldVisible = user?.role !== "dealer";

  return (
    <Layout>
      <div className="topbar"><h2>Support / Complaints</h2></div>
      <div className="card" style={{ marginBottom: 14 }}>
        <h3>Log Ticket</h3>
        <form onSubmit={submit} className="row">
          <div><label>Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
          {dealerFieldVisible && (
            <div>
              <label>Dealer</label>
              <select value={form.dealer} onChange={e => setForm({ ...form, dealer: e.target.value })} required>
                <option value="">Select dealer</option>
                {dealers.map(d => (
                  <option key={d._id} value={d._id}>{d.name} | {d.area} | {d._id.slice(-6)}</option>
                ))}
              </select>
            </div>
          )}
          <div><label>Priority</label><select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
          <div className="row" style={{ gridTemplateColumns: "1fr" }}>
            <div><label>Description</label><textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          {error && <div style={{ color: "var(--danger)" }}>{error}</div>}
          <div style={{ display: "flex", alignItems: "end" }}><button className="button" type="submit">Submit</button></div>
        </form>
      </div>

      <div className="card">
        <h3>Tickets</h3>
        <table className="table">
          <thead><tr><th>Title</th><th>Dealer</th><th>Status</th><th>Priority</th><th></th></tr></thead>
          <tbody>
            {tickets?.map(t => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>{t.dealer?.name || t.dealer}</td>
                <td>{t.status}</td>
                <td><span className="badge yellow">{t.priority}</span></td>
                <td>{t.status !== "resolved" && (<button className="button secondary" onClick={() => close(t._id)}>Resolve</button>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}