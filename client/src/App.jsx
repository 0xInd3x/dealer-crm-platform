import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/auth";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import DashboardPage from "./pages/Dashboard";
import LeadsPage from "./pages/Leads";
import OrdersPage from "./pages/Orders";
import PaymentsPage from "./pages/Payments";
import DealersPage from "./pages/Dealers";
import SchemesPage from "./pages/Schemes";
import TicketsPage from "./pages/Tickets";
import SalesPage from "./pages/Sales";
import UsersPage from "./pages/Users";

function Protected({ children }) {
  const token = useAuthStore(state => state.token);
  if (!token) return <Navigate to="/" replace />;
  return children;
}

function RequireRole({ roles, children }) {
  const user = useAuthStore(state => state.user);
  if (!user || !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
      <Route path="/leads" element={<Protected><LeadsPage /></Protected>} />
      <Route path="/orders" element={<Protected><OrdersPage /></Protected>} />
      <Route path="/payments" element={<Protected><PaymentsPage /></Protected>} />
      <Route path="/users" element={<Protected><RequireRole roles={["admin"]}><UsersPage /></RequireRole></Protected>} />
      <Route path="/dealers" element={<Protected><RequireRole roles={["admin"]}><DealersPage /></RequireRole></Protected>} />
      <Route path="/schemes" element={<Protected><RequireRole roles={["admin"]}><SchemesPage /></RequireRole></Protected>} />
      <Route path="/tickets" element={<Protected><TicketsPage /></Protected>} />
      <Route path="/sales" element={<Protected><RequireRole roles={["admin"]}><SalesPage /></RequireRole></Protected>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}