import type { Dictionary } from "@/data/dictionaries/pt";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/layout/ContactForm";
import { RobotHead } from "@/components/contact/RobotHead";
import {
  WhatsAppIcon,
  MailIcon,
  LinkedInIcon,
  ArrowUpRightIcon,
} from "@/components/icons/SocialIcons";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/contact";

export function Contact({ dict }: { dict: Dictionary }) {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    dict.contact.whatsappMessage
  )}`;

  return (
    <section id="contact" className="bg-bg/80">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        {/* Mesmo painel grande usado em Serviços — a área de contato
            também é tratada como um bloco/produto único, não uma seção
            solta no fundo do site. */}
        <div className="tech-panel relative rounded-4xl p-6 sm:p-10 lg:p-14">
          {/* Ilustração decorativa (referência: a cabeça de IA ao lado do
              formulário no mockup enviado) — só a partir do `xl`, atrás
              do conteúdo, bem discreta pra não brigar com o formulário. */}
          <div className="pointer-events-none absolute bottom-8 right-10 hidden w-56 opacity-60 xl:block">
            <RobotHead />
          </div>

          <div className="relative grid gap-14 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <Reveal>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-accent-ink">
                  {dict.contact.eyebrow}
                </span>
                <h2 className="mt-3 text-balance text-4xl font-bold leading-[0.95] tracking-tight text-ink sm:text-5xl lg:text-[3.75rem]">
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
                    className="group flex items-center gap-4 rounded-2xl bg-accent px-6 py-5 text-ink shadow-[0_10px_30px_-14px_rgba(var(--accent-glow),0.5)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-accent-hover"
                  >
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-bg/15">
                      <WhatsAppIcon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-base font-medium">
                        {dict.contact.whatsappCta}
                      </span>
                      <span className="block font-mono text-xs uppercase tracking-wide text-ink/70">
                        {dict.contact.whatsapp}
                      </span>
                    </span>
                    <ArrowUpRightIcon className="ml-auto h-4 w-4 flex-none transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>

                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="glow-card tech-card group flex items-center gap-4 rounded-2xl px-6 py-5"
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

              {/* QR real (SVG gerado localmente, ver public/icons/whatsapp-qr.svg
                  — sem chamar serviço externo em runtime) apontando pro
                  mesmo WhatsApp dos botões acima — atalho pra quem está
                  vendo o site no computador e prefere continuar no celular. */}
              <Reveal delay={160}>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="tech-card mt-6 flex w-fit items-center gap-4 rounded-2xl p-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/icons/whatsapp-qr.svg"
                    alt=""
                    aria-hidden
                    className="h-20 w-20 flex-none rounded-md bg-bg p-1.5"
                  />
                  <span>
                    <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-accent-ink">
                      {dict.contact.qrLabel}
                    </span>
                    <span className="mt-1 block max-w-40 text-xs leading-relaxed text-ink-faint">
                      {dict.contact.qrHint}
                    </span>
                  </span>
                </a>
              </Reveal>
            </div>

            <Reveal delay={120}>
              {/* bg-bg quase opaco: é um formulário de verdade, precisa de
                  contraste alto pros campos. */}
              <div className="rounded-2xl border border-line bg-bg/80 p-6 backdrop-blur-sm sm:p-8">
                <ContactForm dict={dict.contact.form} />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
