import { useEffect, useState } from "react";
import type { Profile } from "./types";
import { Field, TextInput, Button, Avatar } from "./ui/primitives";
import { Modal } from "./ui/Modal";

export function MeuPerfilModal({
  open,
  onOpenChange,
  profile,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  onSave: (profile: Profile) => void;
}) {
  const [name, setName] = useState(profile.name);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");

  useEffect(() => {
    if (open) {
      setName(profile.name);
      setAvatarUrl(profile.avatarUrl ?? "");
    }
  }, [open, profile]);

  function handleSave() {
    if (!name.trim()) return;
    onSave({ ...profile, name: name.trim(), avatarUrl: avatarUrl.trim() || undefined });
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Meu perfil">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={name || profile.email} avatarUrl={avatarUrl || undefined} size={56} />
          <p className="text-white/30 text-xs">{profile.email}</p>
        </div>
        <Field label="Nome">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
        </Field>
        <Field label="Link da foto">
          <TextInput value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
        </Field>
        <div className="flex justify-end gap-2 mt-2">
          <Button onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
