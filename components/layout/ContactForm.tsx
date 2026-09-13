"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/data/dictionaries/pt";
import { ButtonAsButton } from "@/components/ui/Button";
import { WHATSAPP_NUMBER } from "@/lib/contact";

// Não há backend configurado para este site. O envio abre o WhatsApp com a
// mensagem pronta, usando o mesmo número do botão de contato do portfólio.

export function ContactForm({ dict }: { dict: Dictionary["contact"]["form"] }) {
  const [sent, setSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  function validateEmail(value: string) {
    const email = value.trim().toLowerCase();
    const [, domain = ""] = email.split("@");
    const reservedDomains = new Set([
      "example.com",
      "example.org",
      "example.net",
      "invalid",
      "localhost",
      "test.com",
    ]);

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ||
      reservedDomains.has(domain)
    ) {
      return dict.emailInvalid;
    }

    return "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const company = formData.get("company")?.toString() ?? "";
    const projectType = formData.get("projectType")?.toString() ?? "";
    const message = formData.get("message")?.toString() ?? "";

    const validationMessage = validateEmail(email);
    if (validationMessage) {
      setEmailError(validationMessage);
      document.getElementById("email")?.focus();
      return;
    }

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

    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;

    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={dict.name} name="name" required />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm text-ink-soft">
            {dict.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-invalid={emailError ? "true" : undefined}
            aria-describedby={emailError ? "email-error" : undefined}
            onBlur={(event) => setEmailError(validateEmail(event.currentTarget.value))}
            onChange={(event) => {
              setSent(false);
              if (emailError) setEmailError(validateEmail(event.currentTarget.value));
            }}
            onInvalid={(event) => {
              event.preventDefault();
              setEmailError(validateEmail(event.currentTarget.value));
            }}
            className={`rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus-visible:border-ink ${
              emailError ? "border-red-500 focus-visible:border-red-600" : "border-line"
            }`}
          />
          {emailError && (
            <p id="email-error" role="alert" className="text-xs font-medium text-red-600">
              {emailError}
            </p>
          )}
        </div>
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
