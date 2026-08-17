import { useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import { AdminLogin } from "./AdminLogin";
import { AdminLayout } from "./AdminLayout";
import { adminModules } from "./modules";
import { isAdminAuthenticated } from "./auth";

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated());

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout onLogout={() => setAuthenticated(false)} />}>
        <Route index element={<Navigate to={adminModules[0].slug} replace />} />
        {adminModules.map((m) => {
          const Component = m.component;
          return <Route key={m.slug} path={m.slug} element={<Component />} />;
        })}
        <Route path="*" element={<Navigate to={adminModules[0].slug} replace />} />
      </Route>
    </Routes>
  );
}
