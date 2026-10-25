"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";

type ModalProps = {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Accessible modal built on the native <dialog> element: it traps focus,
 * closes on Escape and returns focus to the opener.
 */
export function Modal({ title, description, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    // Removing the element on unmount closes it, so no cleanup is needed.
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) ref.current?.close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md animate-fade-up rounded-card border border-border bg-surface p-0 text-fg shadow-soft backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-sm text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="-m-1 rounded-full p-2 text-muted transition hover:bg-surface-2 hover:text-fg"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </dialog>
  );
}
