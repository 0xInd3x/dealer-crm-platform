import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../apiClient";
import { useAuthStore } from "../store/auth";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "sales", dealer: "", areas: "", dealerArea: "", dealerPhone: "" });
  const [dealers, setDealers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  useEffect(() => {
    api.get("/dealers").then(res => setDealers(res.data));
  }, []);

  const submit = async e => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, areas: form.areas ? form.areas.split(",").map(a => a.trim()).filter(Boolean) : [] };
      if (!payload.dealer) delete payload.dealer;
      const { data } = await api.post("/auth/signup", payload);
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <p style={{ color: "var(--muted)" }}>Choose Sales / Dealer / Admin. Dealer signups auto-create a dealer record if none selected.</p>
      <form onSubmit={submit}>
        <label>Name</label>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <label style={{ marginTop: 10 }}>Email</label>
        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <label style={{ marginTop: 10 }}>Password</label>
        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <label style={{ marginTop: 10 }}>Role</label>
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="sales">Sales</option>
          <option value="dealer">Dealer</option>
          <option value="admin">Admin</option>
        </select>
        {form.role === "dealer" && (
          <>
            <label style={{ marginTop: 10 }}>Link to Existing Dealer</label>
            <select value={form.dealer} onChange={e => setForm({ ...form, dealer: e.target.value })}>
              <option value="">(None) auto-create dealer</option>
              {dealers.map(d => <option key={d._id} value={d._id}>{d.name} ? {d.area} ? {d._id.slice(-6)}</option>)}
            </select>
            <label style={{ marginTop: 10 }}>Dealer Area (for auto-create)</label>
            <input value={form.dealerArea} onChange={e => setForm({ ...form, dealerArea: e.target.value })} placeholder="e.g., North" />
            <label style={{ marginTop: 10 }}>Dealer Phone (optional)</label>
            <input value={form.dealerPhone} onChange={e => setForm({ ...form, dealerPhone: e.target.value })} />
          </>
        )}
        {form.role === "sales" && (
          <>
            <label style={{ marginTop: 10 }}>Areas (comma separated)</label>
            <input value={form.areas} onChange={e => setForm({ ...form, areas: e.target.value })} />
          </>
        )}
        {error && <div style={{ color: "var(--danger)", marginTop: 10 }}>{error}</div>}
        <button className="button" style={{ marginTop: 16, width: "100%" }}>Sign up</button>
      </form>
      <div style={{ marginTop: 12, color: "var(--muted)", fontSize: 13 }}>
        Already registered? <Link to="/">Sign in</Link>
      </div>
    </div>
  );
}