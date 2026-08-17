import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { headingFont } from "./tokens";

export function Modal({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-40" />
        <Dialog.Content
          className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2.5rem)] max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl p-6"
          style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 16px 64px rgba(0,0,0,0.6)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-white text-lg" style={headingFont}>
              {title}
            </Dialog.Title>
            <Dialog.Close className="text-white/40 hover:text-white/80 transition-colors">
              <X size={18} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
