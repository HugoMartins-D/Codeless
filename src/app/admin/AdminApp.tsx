import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import type { Session } from "@supabase/supabase-js";
import { AdminLogin } from "./AdminLogin";
import { AdminLayout } from "./AdminLayout";
import { adminModules } from "./modules";
import { getSession, onAuthChange } from "./auth";

export default function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    getSession().then(setSession);
    return onAuthChange(setSession);
  }, []);

  if (session === undefined) {
    return null;
  }

  if (!session) {
    return <AdminLogin />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
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
