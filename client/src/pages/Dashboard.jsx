import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../apiClient";
import Layout from "../components/Layout";
import { StatCard } from "../components/StatCard";
import { useAuthStore } from "../store/auth";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [dealers, setDealers] = useState([]);
  const [selectedDealer, setSelectedDealer] = useState("");
  const [latestLeads, setLatestLeads] = useState([]);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const load = async dealerId => {
    const res = await api.get("/dashboard/summary", { params: dealerId ? { dealerId } : {} });
    setData(res.data);
    const leadsRes = await api.get("/leads", { params: dealerId ? { dealerId } : {} });
    setLatestLeads(leadsRes.data.slice(0, 5));
  };

  useEffect(() => {
    load();
    if (user?.role === "admin") {
      api.get("/dealers").then(res => setDealers(res.data));
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin" && selectedDealer) load(selectedDealer);
  }, [selectedDealer]);

  const leadMap = useMemo(
    () => Object.fromEntries((data?.leadCounts || []).map(l => [l._id || "unknown", l.count])),
    [data]
  );

  const shortcuts = user?.role === "admin"
    ? [
        { label: "Manage Dealers", to: "/dealers" },
        { label: "Schemes & Incentives", to: "/schemes" },
        { label: "Sales Team", to: "/sales" },
        { label: "Users", to: "/users" },
        { label: "Tickets", to: "/tickets" }
      ]
    : [
        { label: "My Leads", to: "/leads" },
        { label: "My Orders", to: "/orders" },
        { label: "Payments", to: "/payments" },
        { label: "Support", to: "/tickets" }
      ];

  if (!data) return null;

  return (
    <Layout>
      <div className="topbar" style={{ alignItems: "center", gap: 12 }}>
        <h2>{user?.role === "admin" ? "Admin Dashboard" : user?.role === "dealer" ? "Dealer Panel" : "Sales Panel"}</h2>
        {user?.role === "admin" && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: "var(--muted)", fontSize: 12 }}>View as dealer</span>
            <select value={selectedDealer} onChange={e => setSelectedDealer(e.target.value)}>
              <option value="">All dealers</option>
              {dealers.map(d => <option key={d._id} value={d._id}>{d.name} | {d.area} | {d._id.slice(-6)}</option>)}
            </select>
          </div>
        )}
        {user?.role === "dealer" && data.dealerInfo && (
          <div style={{ color: "var(--muted)", fontSize: 13 }}>Dealer: {data.dealerInfo.name} | {data.dealerInfo.code} | {data.dealerInfo.area}</div>
        )}
      </div>
      <div className="card-grid" style={{ marginTop: 12 }}>
        <StatCard label="Leads" value={leadMap.new + leadMap.contacted + leadMap.converted + leadMap.lost || 0} hint="Total pipeline" />
        <StatCard label="Converted" value={leadMap.converted || 0} />
        <StatCard label="Revenue" value={`${data.orderTotals?.total || 0}`} />
        <StatCard label="Outstanding" value={`${data.outstanding || 0}`} hint="Auto-updates with payments" />
        <StatCard label="Incentives" value={`${data.orderTotals?.incentive || 0}`} hint="Dealer/Sales incentives" />
        {user?.role === "admin" && <StatCard label="New Signups (7d)" value={data.userTotals?.new7 || 0} hint={`Total users: ${data.userTotals?.total || 0}`} />}
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Lead Status</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["new", "contacted", "converted", "lost"].map(k => (
            <div key={k} className="badge" style={{ background: "rgba(37,99,235,0.12)", color: "#1f2937" }}>{k}: {leadMap[k] || 0}</div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>Latest Leads</h3>
        <table className="table">
          <thead><tr><th>ID</th><th>Name</th><th>Area</th><th>Status</th><th>Dealer</th></tr></thead>
          <tbody>
            {latestLeads.map(l => (
              <tr key={l._id}>
                <td>{l._id.slice(-6)}</td>
                <td>{l.name}</td>
                <td>{l.area}</td>
                <td>{l.status}</td>
                <td>{l.dealer?.name || "Unassigned"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3>{user?.role === "admin" ? "Admin Controls" : "Quick Actions"}</h3>
        <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
          {shortcuts.map(sc => (
            <div key={sc.to} className="card" style={{ cursor: "pointer" }} onClick={() => navigate(sc.to)}>
              <div style={{ fontWeight: 700 }}>{sc.label}</div>
              <div style={{ color: "var(--muted)", fontSize: 12 }}>Open {sc.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}