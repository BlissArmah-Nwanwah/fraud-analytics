import { Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Overview from "@/pages/dashboard/Overview";
import RealTime from "@/pages/dashboard/RealTime";
import Geography from "@/pages/dashboard/Geography";
import Providers from "@/pages/dashboard/Providers";
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
          <Route path="real-time" element={<RealTime />} />
          <Route path="geography" element={<Geography />} />
          <Route element={<ProtectedRoute roles={["admin", "analyst"]} />}>
            <Route path="providers" element={<Providers />} />
          </Route>
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
