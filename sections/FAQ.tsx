"use client";

import { useState } from "react";
import type { Dictionary } from "@/data/dictionaries/pt";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Referência: `#faq` do DevClub (`.faq-item > .faq-q + .faq-a`, JS
 * trocando display none/block). Aqui a abertura/fechamento é animada de
 * verdade (grid-template-rows 0fr → 1fr, ver .faq-panel em globals.css) em
 * vez do toggle abrupto deles, e cada item usa a mesma pele de card do
 * resto do site (.tech-card) em vez de um card genérico.
 *
 * Fica oculta enquanto `dict.faq.items` estiver vazio — ver comentário no
 * dicionário (data/dictionaries/pt.ts). Sem isso, a section ficaria no ar
 * com perguntas inventadas, o que não faz sentido pra um site real.
 */
export function FAQ({ dict }: { dict: Dictionary }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (dict.faq.items.length === 0) return null;

  return (
    <section id="faq" className="border-b border-line bg-surface/70">
      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <SectionHeading eyebrow={dict.faq.eyebrow} title={dict.faq.title} align="center" />
        </Reveal>

        <div className="mt-12 flex flex-col gap-3">
          {dict.faq.items.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={item.question} delay={i * 60}>
                <div className="tech-card overflow-hidden rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={`faq-answer-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                  >
                    <span className="text-sm font-medium text-ink sm:text-base">
                      {item.question}
                    </span>
                    <span
                      aria-hidden
                      className={`flex h-6 w-6 flex-none items-center justify-center rounded-full border border-line text-ink-soft transition-transform duration-300 ${
                        open ? "rotate-45 border-accent/40 text-accent-ink" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <div id={`faq-answer-${i}`} className={`faq-panel ${open ? "faq-panel--open" : ""}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft sm:px-6">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
