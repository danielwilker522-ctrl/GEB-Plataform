"use client";

import { useState } from "react";
import { faq } from "@/lib/site-content";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-line px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-vine">
          Perguntas Frequentes
        </p>
        <h2 className="text-center font-display text-3xl text-ink sm:text-4xl">
          Dúvidas comuns
        </h2>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {faq.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.pergunta}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-medium text-ink">{item.pergunta}</span>
                  <span
                    className={`shrink-0 text-xl text-gold-deep transition-transform ${isOpen ? "rotate-45" : ""}`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-5 pr-10 text-ink/70 leading-relaxed">{item.resposta}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
