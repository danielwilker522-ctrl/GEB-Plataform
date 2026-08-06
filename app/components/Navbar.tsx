"use client";

import { useState } from "react";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#quem-somos", label: "Quem Somos" },
  { href: "#missao-visao-valores", label: "Missão & Visão" },
  { href: "#estrutura", label: "Estrutura" },
  { href: "#como-funciona", label: "Como Funciona" },
  { href: "#faq", label: "FAQ" },
  { href: "#contactos", label: "Contactos" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#inicio" className="font-display text-xl font-semibold tracking-tight text-vine-deep">
          GEB
        </a>

        <ul className="hidden items-center gap-7 text-sm text-ink/80 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="underline-grow">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#abrir-grupo"
          className="hidden rounded-full bg-vine px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-vine-deep lg:inline-block"
        >
          Abrir um Grupo
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Abrir menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
        >
          <span className="sr-only">Menu</span>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
            <path d="M0 1H18" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0 7H18" stroke="currentColor" strokeWidth="1.5" />
            <path d="M0 13H18" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-paper px-6 py-4 lg:hidden">
          <ul className="flex flex-col gap-4 text-ink/85">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#abrir-grupo"
            onClick={() => setOpen(false)}
            className="mt-4 block rounded-full bg-vine px-5 py-2.5 text-center text-sm font-medium text-paper"
          >
            Abrir um Grupo
          </a>
        </div>
      )}
    </header>
  );
}
