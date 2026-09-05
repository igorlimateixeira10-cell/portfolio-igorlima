import type { Dictionary } from "@/data/dictionaries/pt";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/layout/ContactForm";
import { WhatsAppIcon, MailIcon, LinkedInIcon } from "@/components/icons/SocialIcons";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/contact";

export function Contact({ dict }: { dict: Dictionary }) {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    dict.contact.whatsappMessage
  )}`;

  return (
    <section id="contact">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-ink">
                {dict.contact.eyebrow}
              </span>
              <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                {dict.contact.title}
              </h2>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-ink-soft">
                {dict.contact.subtitle}
              </p>
            </Reveal>

            {/* WhatsApp e e-mail precisam ser o ponto mais fácil de achar da
                seção — por isso viram botões grandes, não um link discreto. */}
            <Reveal delay={100}>
              <div className="mt-9 flex flex-col gap-3">
                <p className="font-mono text-xs uppercase tracking-wide text-ink-faint">
                  {dict.contact.directTitle}
                </p>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-2xl bg-accent px-6 py-5 text-white shadow-[0_10px_30px_-14px_rgba(47,92,246,0.55)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-accent-ink"
                >
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white/15">
                    <WhatsAppIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-white">
                      WhatsApp
                    </span>
                    <span className="block font-mono text-base font-medium">
                      {dict.contact.whatsapp}
                    </span>
                  </span>
                </a>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-surface px-6 py-5 transition-colors duration-200 hover:border-ink"
                >
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-bg text-ink-soft">
                    <MailIcon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-ink-faint">
                      Email
                    </span>
                    <span className="block break-all font-mono text-sm font-medium text-ink sm:text-base">
                      {dict.contact.email}
                    </span>
                  </span>
                </a>

                <a
                  href="https://www.linkedin.com/in/igor-teixeira-4055232b8/"
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline mt-1 flex w-fit items-center gap-2 text-sm text-ink-soft hover:text-ink"
                >
                  <LinkedInIcon className="h-4 w-4" />
                  {dict.contact.linkedin}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
              <ContactForm dict={dict.contact.form} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
