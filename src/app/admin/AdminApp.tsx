import { Navigate, Route, Routes } from "react-router";
import { AdminLogin } from "./AdminLogin";
import { AdminLayout } from "./AdminLayout";
import { AdminPending } from "./AdminPending";
import { adminModules } from "./modules";
import { useSession } from "./auth";
import { useMyAccess, hasAccess } from "./lib/access";

export default function AdminApp() {
  const session = useSession();
  const access = useMyAccess(session ?? null);

  if (session === undefined || access.loading) {
    return null;
  }

  if (!session) {
    return <AdminLogin />;
  }

  if (!access.isAdmin && access.moduleAccess.length === 0) {
    return <AdminPending email={session.user.email ?? ""} status={access.status ?? "pending"} />;
  }

  const visibleModules = adminModules.filter((m) => {
    if (m.slug === "geral") return true;
    if (m.slug === "acessos") return access.isAdmin;
    return hasAccess(access, m.slug);
  });

  return (
    <Routes>
      <Route element={<AdminLayout modules={visibleModules} />}>
        <Route index element={<Navigate to="geral" replace />} />
        {visibleModules.map((m) => {
          const Component = m.component;
          return <Route key={m.slug} path={m.slug} element={<Component />} />;
        })}
        <Route path="*" element={<Navigate to="geral" replace />} />
      </Route>
    </Routes>
  );
}
