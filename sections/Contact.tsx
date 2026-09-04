import type { Dictionary } from "@/data/dictionaries/pt";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/layout/ContactForm";
import { MailIcon, WhatsAppIcon, LinkedInIcon } from "@/components/icons/SocialIcons";

export function Contact({ dict }: { dict: Dictionary }) {
  return (
    <section id="contact">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Reveal>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-ink">
                {dict.contact.eyebrow}
              </span>
              <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {dict.contact.title}
              </h2>
              <p className="mt-4 max-w-sm text-base text-ink-soft">{dict.contact.subtitle}</p>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-10 flex flex-col gap-4">
                <p className="font-mono text-xs uppercase tracking-wide text-ink-faint">
                  {dict.contact.directTitle}
                </p>

                <ContactLine icon={<MailIcon className="h-4 w-4" />} placeholder>
                  {dict.contact.email}
                </ContactLine>
                <ContactLine icon={<WhatsAppIcon className="h-4 w-4" />} placeholder>
                  {dict.contact.whatsapp}
                </ContactLine>
                <ContactLine
                  icon={<LinkedInIcon className="h-4 w-4" />}
                  href="https://www.linkedin.com/in/igor-teixeira-4055232b8/"
                >
                  {dict.contact.linkedin}
                </ContactLine>
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

function ContactLine({
  icon,
  children,
  href,
  placeholder = false,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  placeholder?: boolean;
}) {
  const content = (
    <span className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft">
        {icon}
      </span>
      <span className={`font-mono text-sm ${placeholder ? "text-ink-faint" : "text-ink"}`}>
        {children}
      </span>
    </span>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="w-fit hover:opacity-70">
        {content}
      </a>
    );
  }

  return <div className="w-fit">{content}</div>;
}
