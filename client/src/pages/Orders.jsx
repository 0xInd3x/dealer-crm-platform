import { useEffect, useMemo, useState } from "react";
import api from "../apiClient";
import Layout from "../components/Layout";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ dealer: "", lead: "", items: [{ name: "Machine", qty: 1, price: 100000 }] });

  const load = () => api.get("/orders").then(res => setOrders(res.data));
  useEffect(() => {
    load();
    api.get("/dealers").then(res => setDealers(res.data));
    api.get("/leads").then(res => setLeads(res.data));
  }, []);

  const total = useMemo(() => (form.items || []).reduce((sum, i) => sum + (i.qty || 0) * (i.price || 0), 0), [form]);

  const addOrder = async e => {
    e.preventDefault();
    await api.post("/orders", { ...form, lead: form.lead || undefined });
    setForm({ dealer: "", lead: "", items: [{ name: "Machine", qty: 1, price: 100000 }] });
    load();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}`, { status });
    load();
  };

  return (
    <Layout>
      <div className="topbar"><h2>Orders</h2></div>
      <div className="card" style={{ marginBottom: 14 }}>
        <h3>Create Order</h3>
        <form onSubmit={addOrder} className="row">
          <div>
            <label>Dealer</label>
            <select value={form.dealer} onChange={e => setForm({ ...form, dealer: e.target.value })} required>
              <option value="">Select dealer</option>
              {dealers.map(d => <option key={d._id} value={d._id}>{d.name} | {d.area} | {d._id.slice(-6)}</option>)}
            </select>
          </div>
          <div>
            <label>Lead (optional)</label>
            <select value={form.lead} onChange={e => setForm({ ...form, lead: e.target.value })}>
              <option value="">None</option>
              {leads.map(l => <option key={l._id} value={l._id}>{l.name} | {l.area}</option>)}
            </select>
          </div>
          <div>
            <label>Item</label>
            <input value={form.items[0].name} onChange={e => setForm({ ...form, items: [{ ...form.items[0], name: e.target.value }] })} />
          </div>
          <div>
            <label>Qty</label>
            <input type="number" value={form.items[0].qty} onChange={e => setForm({ ...form, items: [{ ...form.items[0], qty: (e.target.value) }] })} />
          </div>
          <div>
            <label>Price</label>
            <input type="number" value={form.items[0].price} onChange={e => setForm({ ...form, items: [{ ...form.items[0], price: (e.target.value) }] })} />
          </div>
          <div>
            <label>Total</label>
            <div className="badge green">{total}</div>
          </div>
          <div style={{ display: "flex", alignItems: "end" }}>
            <button className="button">Save Order</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Orders</h3>
        <table className="table">
          <thead><tr><th>ID</th><th>Dealer</th><th>Dealer ID</th><th>Total</th><th>Outstanding</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>{o._id.slice(-6)}</td>
                <td>{o.dealer?.name || o.dealer}</td>
                <td>{o.dealer?._id ? o.dealer._id.slice(-6) : (o.dealer?.toString?.() || "").slice(-6)}</td>
                <td>{o.total}</td>
                <td><span className="badge green">{o.outstanding}</span></td>
                <td>{o.status}</td>
                <td>
                  {o.status !== "delivered" && <button className="button secondary" onClick={() => updateStatus(o._id, "delivered")}>Mark Delivered</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}