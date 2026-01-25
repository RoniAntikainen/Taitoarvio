"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Portal from "@/components/ui/Portal";

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
  const pointerIdRef = useRef<number | null>(null);

  // lukitse taustan scroll kun sheet auki
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  // reset kun avataan
  useEffect(() => {
    if (!open) return;
    setDragY(0);
    setDragging(false);
    pointerIdRef.current = null;
  }, [open]);

  const close = () => {
    setOpen(false);
  };

  const onHandlePointerDown = (e: React.PointerEvent) => {
    // vain primary pointer
    if (e.button !== 0 && e.pointerType !== "touch") return;

    setDragging(true);
    startYRef.current = e.clientY;
    pointerIdRef.current = e.pointerId;

    // ota pointer kiinni handleen
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onHandlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    if (pointerIdRef.current !== e.pointerId) return;

    const delta = e.clientY - startYRef.current;
    // vedetään vain alaspäin
    setDragY(delta > 0 ? delta : 0);
  };

  const onHandlePointerUp = (e: React.PointerEvent) => {
    if (pointerIdRef.current !== e.pointerId) return;

    setDragging(false);

    // jos vedetty tarpeeksi alas → sulje
    if (dragY > 120) {
      close();
      return;
    }

    // muuten snap takaisin ylös
    setDragY(0);
  };

  return (
    <>
      {/* AVATAR / TRIGGER */}
      <button
        className="userTrigger"
        onClick={() => setOpen(true)}
        aria-label="Käyttäjäasetukset"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt="Profiilikuva"
            width={32}
            height={32}
            className="userAvatar"
          />
        ) : (
          <span className="userAvatarFallback">👤</span>
        )}
      </button>

      {/* OVERLAY BODYSSA */}
      {open && (
        <Portal>
          <div className="sheetOverlay" onPointerDown={close}>
            <div
              className="sheet"
              role="dialog"
              aria-modal="true"
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                transform: `translateY(${dragY}px)`,
                transition: dragging ? "none" : "transform 180ms ease",
              }}
            >
              {/* DRAG HANDLE */}
              <div
                className="sheetHandle"
                onPointerDown={onHandlePointerDown}
                onPointerMove={onHandlePointerMove}
                onPointerUp={onHandlePointerUp}
                onPointerCancel={onHandlePointerUp}
              >
                <div className="sheetHandleBar" />
              </div>

              <div className="sheetContent">
                <div className="sheetHeader">
                  {user.image && (
                    <Image
                      src={user.image}
                      alt=""
                      width={48}
                      height={48}
                      className="userAvatarLg"
                    />
                  )}
                  <div>
                    <div className="sheetName">{user.name}</div>
                    <div className="sheetEmail">{user.email}</div>
                  </div>
                </div>

                <div className="sheetActions">
                  <button className="sheetBtn">Profiilin asetukset</button>
                  <button className="sheetBtn">Teema</button>
                  <a className="sheetBtn" href="/api/auth/signout">
                    Kirjaudu ulos
                  </a>
                </div>

                <div className="sheetHint">
                  Vedä alas sulkeaksesi tai napauta taustaa.
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
