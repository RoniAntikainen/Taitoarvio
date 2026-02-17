"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Portal from "@/components/ui/Portal";
import { signOut } from "next-auth/react";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function UserMenu({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  // drag state
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startYRef = useRef(0);

  // refs
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    startYRef.current = e.clientY;
    setDragY(0);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const delta = e.clientY - startYRef.current;
    setDragY(Math.max(0, delta));
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);

    if (dragY > 140) {
      setOpen(false);
    }
    setDragY(0);
  };

  const transform = dragY ? `translateY(${dragY}px)` : undefined;

  return (
    <>
      <button
        className="userChip"
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "Käyttäjä"}
            width={28}
            height={28}
            className="userChip__avatar"
          />
        ) : (
          <span className="userChip__avatarFallback" aria-hidden="true">
            {user.name?.slice(0, 1)?.toUpperCase() ?? "U"}
          </span>
        )}

        <span className="userChip__name">{user.name ?? "Käyttäjä"}</span>
      </button>

      {open && (
        <Portal>
          <div className="sheetOverlay" onClick={() => setOpen(false)} />

          <div
            ref={sheetRef}
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Käyttäjävalikko"
            style={{ transform }}
          >
            <div
              className="sheetHandle"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            />

            <div className="sheetHeader">
              <div className="sheetTitle">{user.name ?? "Käyttäjä"}</div>
              <div className="sheetSubtitle">{user.email ?? ""}</div>
            </div>

            <div className="sheetBody">
              <div className="sheetGroup">
                <button className="sheetBtn">Profiilin asetukset</button>
                <button className="sheetBtn">Teema</button>

                <button
                  className="sheetBtn"
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Kirjaudu ulos
                </button>
              </div>

              <div className="sheetHint">
                Vedä alas sulkeaksesi tai napauta taustaa
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
