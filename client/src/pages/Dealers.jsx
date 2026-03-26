import { useEffect, useState } from "react";
import api from "../apiClient";
import Layout from "../components/Layout";

export default function DealersPage() {
  const [dealers, setDealers] = useState([]);
  const [form, setForm] = useState({ name: "", area: "", phone: "", leadRate: 5, salesRate: 5 });

  const load = () => api.get("/dealers").then(res => setDealers(res.data));
  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault();
    await api.post("/dealers", { name: form.name, code: form.code, area: form.area, phone: form.phone, incentive: { leadRate: Number(form.leadRate), salesRate: Number(form.salesRate) } });
    setForm({ name: "", area: "", phone: "", leadRate: 0, salesRate: 0 });
    load();
  };

  return (
    <Layout>
      <div className="topbar"><h2>Dealers</h2></div>
      <div className="card" style={{ marginBottom: 14 }}>
        <h3>New Dealer</h3>
        <form onSubmit={submit} className="row">
          <div><label>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
          {/* <div><label>Code</label><input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required /></div> */}
          <div><label>Area</label><input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} required /></div>
          <div><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label>Lead Incentive %</label><input type="number" value={form.leadRate} onChange={e => setForm({ ...form, leadRate: e.target.value })} /></div>
          <div><label>Sales Incentive %</label><input type="number" value={form.salesRate} onChange={e => setForm({ ...form, salesRate: e.target.value })} /></div>
          <div style={{ display: "flex", alignItems: "end" }}><button className="button">Save Dealer</button></div>
        </form>
      </div>
      <div className="card">
        <h3>Dealer List</h3>
        <table className="table">
          <thead><tr><th>Name</th><th>Area</th><th>Dealer ID</th><th>Phone</th></tr></thead>
          <tbody>
            {dealers.map(d => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.area}</td>
                {/* <td>{d.code}</td> */}
                <td><span className="badge" style={{ background: "rgba(37,99,235,0.12)", color: "#1f2937" }}>{d._id?.slice(-6)}</span></td>
                <td>{d.phone}</td>
                <td>{d.incentive?.leadRate ?? 0}%</td>
                <td>{d.incentive?.salesRate ?? 0}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}