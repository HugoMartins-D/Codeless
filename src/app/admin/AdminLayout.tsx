import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { LogOut } from "lucide-react";
import type { AdminModule } from "./modules";
import { signOut, useSession } from "./auth";
import { useSupabaseTable } from "./lib/supabaseData";
import { fromProfileRow, toProfileRow } from "./lib/mappers";
import type { Profile } from "./types";
import { Avatar } from "./ui/primitives";
import { MeuPerfilModal } from "./MeuPerfilModal";

export function AdminLayout({ modules }: { modules: AdminModule[] }) {
  const session = useSession();
  const [profiles, setProfiles] = useSupabaseTable<Profile>("profiles", fromProfileRow, toProfileRow);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const myProfile = profiles.find((p) => p.id === session?.user.id) ?? {
    id: session?.user.id ?? "",
    email: session?.user.email ?? "",
    name: session?.user.email?.split("@")[0] ?? "",
  };

  function handleSaveProfile(next: Profile) {
    setProfiles((prev) => (prev.some((p) => p.id === next.id) ? prev.map((p) => (p.id === next.id ? next : p)) : [next, ...prev]));
  }

  return (
    <div className="min-h-screen flex bg-[#050505]">
      <aside
        className="w-64 shrink-0 flex flex-col p-5"
        style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}
      >
        <p
          className="text-white/40 text-[11px] tracking-widest uppercase mb-6 px-2"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}
        >
          Code Less · Interno
        </p>

        <nav className="flex flex-col gap-1 flex-1">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <NavLink
                key={m.slug}
                to={`/admin/${m.slug}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive ? "text-white" : "text-white/50 hover:text-white/80"
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? "rgba(199,211,0,0.10)" : "transparent",
                  border: isActive ? "1px solid rgba(199,211,0,0.25)" : "1px solid transparent",
                })}
              >
                <Icon size={16} />
                {m.title}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={() => setProfileModalOpen(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white transition-colors hover:bg-white/[0.04]"
        >
          <Avatar name={myProfile.name || myProfile.email} avatarUrl={myProfile.avatarUrl} size={28} />
          <span className="truncate">{myProfile.name || myProfile.email}</span>
        </button>

        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-[#e93e8f] transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>

      <MeuPerfilModal open={profileModalOpen} onOpenChange={setProfileModalOpen} profile={myProfile} onSave={handleSaveProfile} />
    </div>
  );
}
