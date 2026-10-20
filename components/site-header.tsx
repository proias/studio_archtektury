"use client";
import Link from "next/link";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { navigation } from "@/lib/site-content";
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          href="/"
          className="wordmark"
          aria-label="Paulina Cywińska — strona główna"
        >
          <span>PAULINA CYWIŃSKA</span>
          <small>STUDIO ARCHITEKTURY</small>
        </Link>
        <nav className="desktop-nav" aria-label="Nawigacja główna">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              className="menu-toggle"
              aria-label="Otwórz menu"
              aria-expanded={open}
            >
              <Menu size={23} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="menu-overlay" />
            <Dialog.Content className="mobile-menu">
              <Dialog.Title className="eyebrow">Nawigacja</Dialog.Title>
              <Dialog.Description className="sr-only">
                Wybierz sekcję strony pracowni.
              </Dialog.Description>
              <Dialog.Close asChild>
                <button className="menu-close" aria-label="Zamknij menu">
                  <X />
                </button>
              </Dialog.Close>
              <nav aria-label="Nawigacja mobilna">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <p>
                Paulina Cywińska
                <br />
                Studio Architektury · Łódź
              </p>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
