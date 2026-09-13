import type { Dictionary } from "@/data/dictionaries/pt";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { WHATSAPP_NUMBER } from "@/lib/contact";

/**
 * CTA flutuante persistente (referência: `#zap` do DevClub — fixed,
 * bottom-right, sempre visível, fora do fluxo de qualquer section).
 * Cor e formato seguem o sistema do PRÓPRIO site (--accent), não o verde
 * deles — mesmo número e mesma mensagem já usados no Hero/Contact
 * (lib/contact.ts + dict.contact.whatsappMessage), então não duplica
 * dado nenhum.
 *
 * Duas animações contínuas (ambas em globals.css, ambas desligadas por
 * `prefers-reduced-motion`, mesmo padrão do resto do site):
 *  - flutua devagar (translateY) — na `<div>` de fora, não no `<a>`, de
 *    propósito: `hover:scale-105` do link também mexe em `transform`, e
 *    as duas juntas no MESMO elemento se cancelariam (só uma `transform`
 *    vale por vez em CSS puro).
 *  - pisca um anel pulsando atrás do ícone (mesma ideia do "ping" do
 *    indicador de disponibilidade no Hero), pra chamar atenção sem
 *    animar o ícone em si.
 *
 * Some no mobile quando o teclado abre um input focado seria ideal, mas
 * o site não tem formulário nativo de texto que caiba nessa preocupação
 * agora (ContactForm decide por si só); mantido simples.
 */
export function WhatsAppFloat({ dict }: { dict: Dictionary }) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    dict.contact.whatsappMessage
  )}`;

  return (
    <div className="whatsapp-float fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={dict.contact.whatsappCta}
        className="whatsapp-float__button relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-ink shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6),0_0_28px_-6px_rgba(var(--accent-glow),0.6)] transition-all hover:bg-accent-hover"
      >
        <span className="whatsapp-float__ping absolute inset-0 rounded-full bg-accent" aria-hidden />
        <WhatsAppIcon className="relative z-10 h-6 w-6" />
      </a>
    </div>
  );
}
