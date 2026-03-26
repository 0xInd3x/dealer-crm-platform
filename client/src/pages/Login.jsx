import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../apiClient";
import { useAuthStore } from "../store/auth";

const landingOptions = [
  { value: "auto", label: "Auto (role-based)" },
  { value: "admin", label: "Admin Dashboard" },
  { value: "dealer", label: "Dealer Panel" },
  { value: "sales", label: "Sales Panel" }
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [landing, setLanding] = useState("auto");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const resolveAutoPath = role => {
    if (role === "admin") return "/dashboard";
    if (role === "dealer") return "/dashboard";
    return "/leads"; // sales defaults to Sales Panel
  };

  const resolveSelectedPath = (selection, role) => {
    if (selection === "admin") return role === "admin" ? "/dashboard" : resolveAutoPath(role);
    if (selection === "dealer") return role === "dealer" ? "/dashboard" : resolveAutoPath(role);
    if (selection === "sales") return role === "sales" ? "/leads" : resolveAutoPath(role);
    return resolveAutoPath(role);
  };

  const submit = async e => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data.token, data.user);
      const target = resolveSelectedPath(landing, data.user.role);
      navigate(target);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Dealer CRM Login</h2>
      <p style={{ color: "var(--muted)" }}></p>
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} required />
        <label style={{ marginTop: 10 }}>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <label style={{ marginTop: 10 }}>Choose Panel</label>
        <select value={landing} onChange={e => setLanding(e.target.value)}>
          {landingOptions.map(o => <option key={o.label + o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 6 }}>
          If a panel doesn't match your role, we'll route you automatically.
        </div>
        {error && <div style={{ color: "var(--danger)", marginTop: 10 }}>{error}</div>}
        <button className="button" style={{ marginTop: 16, width: "100%" }}>Sign in</button>
      </form>
      <div style={{ marginTop: 12, color: "var(--muted)", fontSize: 13 }}>
        Need an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}