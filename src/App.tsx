import { Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Overview from "@/pages/dashboard/Overview";
import Activities from "@/pages/dashboard/Activities";
import Geography from "@/pages/dashboard/Geography";
import Settings from "@/pages/settings/Settings";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Overview />} />
          <Route path="activities" element={<Activities />} />
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="geography" element={<Geography />} />
          </Route>

          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
