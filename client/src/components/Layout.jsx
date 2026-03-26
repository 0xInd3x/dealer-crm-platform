import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/leads", label: "Leads" },
  { to: "/orders", label: "Orders" },
  { to: "/payments", label: "Payments" },
  { to: "/users", label: "Users", roles: ["admin"] },
  { to: "/dealers", label: "Dealers", roles: ["admin"] },
  { to: "/schemes", label: "Schemes", roles: ["admin"] },
  { to: "/tickets", label: "Tickets" },
  { to: "/sales", label: "Sales Team", roles: ["admin"] }
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const filteredLinks = links.filter(l => !l.roles || l.roles.includes(user?.role));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Dealer CRM</h1>
        <div className="nav">
          {filteredLinks.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")}>{l.label}</NavLink>
          ))}
        </div>
      </aside>
      <main className="content">
        <div className="topbar">
          <div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Logged in</div>
            <div style={{ fontWeight: 700 }}>{user?.name} | {user?.role}</div>
          </div>
          <button className="button secondary" onClick={() => { logout(); navigate("/"); }}>Logout</button>
        </div>
        {children}
      </main>
    </div>
  );
}