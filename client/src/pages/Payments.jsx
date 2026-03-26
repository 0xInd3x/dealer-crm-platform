import { useEffect, useState } from "react";
import api from "../apiClient";
import Layout from "../components/Layout";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ order: "", amount: 0, method: "online", reference: "" });

  const load = () => api.get("/payments").then(res => setPayments(res.data));
  useEffect(() => {
    load();
    api.get("/orders").then(res => setOrders(res.data));
  }, []);

  const submit = async e => {
    e.preventDefault();
    await api.post("/payments", form);
    setForm({ order: "", amount: 0, method: "online", reference: "" });
    load();
  };

  return (
    <Layout>
      <div className="topbar"><h2>Payments / Ledger</h2></div>
      <div className="card" style={{ marginBottom: 14 }}>
        <h3>Record Payment</h3>
        <form onSubmit={submit} className="row">
          <div>
            <label>Order</label>
            <select value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} required>
              <option value="">Select order</option>
              {orders.map(o => (
                <option key={o._id} value={o._id}>{o.lead?.name} | {o.dealer?.name || o.dealer} | {o.dealer?._id ? o.dealer._id.slice(-6) : (o.dealer?.toString?.() || "").slice(-6)}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Amount</label>
            <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: (e.target.value) })} required />
          </div>
          <div>
            <label>Method</label>
            <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>
              <option value="online">Online</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
          <div>
            <label>Reference</label>
            <input value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
          </div>
          <div style={{ display: "flex", alignItems: "end" }}>
            <button className="button">Save Payment</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Payments</h3>
        <table className="table">
          
          <thead><tr><th>Order ID</th><th>Dealer</th><th>Dealer ID</th><th>Amount</th><th>Method</th><th>When</th></tr></thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id}>
                {/* <td>{p.order?.toString().slice(-6)}</td> */}
                <th>{p.order._id}</th>
                <td>{p.dealer?.name || p.dealer}</td>
                <td>{p.dealer?._id ? p.dealer._id.slice(-6) : (p.dealer?.toString?.() || "").slice(-6)}</td>
                <td>{p.amount}</td>
                <td>{p.method}</td>
                <td>{new Date(p.paidOn || p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}