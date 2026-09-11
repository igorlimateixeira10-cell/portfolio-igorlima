"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/data/dictionaries/pt";
import { ButtonAsButton } from "@/components/ui/Button";
import { CONTACT_EMAIL } from "@/lib/contact";

// Não há backend configurado para este site. O envio abre o app de e-mail do
// visitante (mailto:) com a mensagem pronta — funciona de verdade, sem
// depender de nenhum serviço externo. Quando houver um backend (ex.: uma
// API route ou um serviço como Formspree/Resend), troque handleSubmit por
// uma chamada real.

export function ContactForm({ dict }: { dict: Dictionary["contact"]["form"] }) {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const company = formData.get("company")?.toString() ?? "";
    const projectType = formData.get("projectType")?.toString() ?? "";
    const message = formData.get("message")?.toString() ?? "";

    const subject = `${projectType} — ${name}`;
    const body = [
      `${dict.name}: ${name}`,
      `${dict.email}: ${email}`,
      company && `${dict.company}: ${company}`,
      `${dict.projectType}: ${projectType}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={dict.name} name="name" required />
        <Field label={dict.email} name="email" type="email" required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={`${dict.company} (${dict.companyOptional})`} name="company" />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="projectType" className="text-sm text-ink-soft">
            {dict.projectType}
          </label>
          <select
            id="projectType"
            name="projectType"
            required
            defaultValue=""
            className="rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus-visible:border-ink"
          >
            <option value="" disabled>
              —
            </option>
            {dict.projectTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm text-ink-soft">
          {dict.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="resize-none rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus-visible:border-ink"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <ButtonAsButton type="submit" variant="accent">
          {dict.submit}
        </ButtonAsButton>
        <p className="text-xs text-ink-faint">{sent ? "✓" : ""} {dict.note}</p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm text-ink-soft">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus-visible:border-ink"
      />
    </div>
  );
}
