"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC = "/robo.mp4";
const VIDEO_REVERSE_SRC = "/robo-reverse.mp4";
const POSTER_SRC = "/robo-poster.jpg";

/**
 * O robô "flutuando" no fundo do Hero — sem card/moldura/retângulo.
 *
 * IMPORTANTE sobre o fundo do vídeo em si: public/robo.mp4 não tem um
 * fundo preto/uniforme — é uma sala de servidores bem iluminada, cheia
 * de telas e luzes coloridas (conferi quadro a quadro antes de mexer
 * aqui). Isso não é o tipo de fundo que blend mode ou máscara CSS
 * conseguem apagar de verdade (isso exigiria recorte/rotoscopia do
 * vídeo em si, fora do que dá pra fazer em CSS/canvas em tempo real).
 * O que dá pra fazer, e é o que está aqui:
 *   1) `mix-blend-mode: screen` — matematicamente, com o fundo do site
 *      quase preto por trás, as partes ESCURAS do vídeo (sombras, vãos
 *      entre os equipamentos) se fundem de verdade com a página; as
 *      partes claras (o robô, as telas) continuam vívidas por cima.
 *   2) Uma máscara radial (`mask-image`) esmaece as bordas retangulares
 *      do vídeo até sumirem — acaba com o "quadrado" ao redor, mesmo
 *      sem recortar o robô pixel a pixel.
 *
 * LOOP "PING-PONG" (a parte nova): conferi quadro a quadro — o primeiro
 * e o último frame de robo.mp4 são poses BEM diferentes (a cabeça gira
 * de quase-frente até o perfil, com leve zoom junto). Um loop comum
 * (voltar pro início) sempre ia mostrar um salto ali, não tem como
 * disfarçar isso com fade nem CSS: os frames são fisicamente diferentes.
 *
 * A técnica que resolve isso de verdade pra ESTE vídeo (movimento
 * contínuo, sem corte no meio): gerei um SEGUNDO arquivo com os frames
 * invertidos (`ffmpeg -vf reverse`, public/robo-reverse.mp4) — o
 * primeiro frame dele é EXATAMENTE o último frame do original (mesmo
 * pixel a pixel, é o mesmo frame). Toca o original até o fim, troca pro
 * invertido (que já começa exatamente onde o outro parou), toca ele até
 * o fim (que termina exatamente no frame inicial do original), troca de
 * volta — nunca existe um instante em que a pose "pula". O movimento só
 * reverte e continua, pra sempre.
 *
 * Dois cuidados extras na troca em si (ver `swapTo`), pra não introduzir
 * um engasgo por conta própria bem na hora mais sensível:
 *  - a troca de opacidade é instantânea, sem transition — os dois frames
 *    são idênticos, um fade só arriscaria expor recompressão entre os
 *    arquivos por um instante, sem ganhar nada em troca;
 *  - reposicionar o vídeo que ACABOU de sair pro frame 0 (pra deixá-lo
 *    pronto pro próximo turno) é adiado com `requestAnimationFrame`, pra
 *    não competir por CPU com o `play()` do que está entrando bem no
 *    instante da costura.
 */
export function RobotVideo() {
  const stageRef = useRef<HTMLDivElement>(null);
  const forwardRef = useRef<HTMLVideoElement>(null);
  const reverseRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const forward = forwardRef.current;
    const reverse = reverseRef.current;
    if (!forward || !reverse) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    // O quadro inteiro já é `hidden` via CSS abaixo do `lg` (mesma regra
    // de sempre neste Hero), mas isso sozinho não impede o navegador de
    // baixar/tocar um <video> escondido — `display:none` não pausa rede
    // nem playback. Sem checar a media query aqui, os vídeos continuariam
    // baixando à toa no celular. Abaixo do `lg`, fica só no poster.
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    forward.src = VIDEO_SRC;
    reverse.src = VIDEO_REVERSE_SRC;

    // O invertido fica pronto (carregado, parado no frame 0, invisível)
    // enquanto o original toca — na hora da troca ele já está pronto,
    // sem esperar buffer nenhum.
    reverse.preload = "auto";
    reverse.style.opacity = "0";

    forward.play().catch(() => {
      // Autoplay pode falhar em navegador restritivo — o poster (sempre
      // no JSX) continua cobrindo o quadro normalmente.
    });

    function swapTo(incoming: HTMLVideoElement, outgoing: HTMLVideoElement) {
      // A troca em si primeiro, sem nada mais competindo por CPU nesse
      // instante exato: só opacidade (o incoming já está parado no
      // frame 0 desde a troca anterior, pronto) e o play().
      incoming.style.opacity = "1";
      outgoing.style.opacity = "0";
      incoming.play().catch(() => {});
      outgoing.pause();

      // Só DEPOIS da troca visual já ter acontecido é que reposiciona o
      // que saiu de cena pro frame 0 (pro próximo turno dele) — fazer
      // isso no mesmo instante do play() do incoming arriscava competir
      // por CPU bem na hora mais sensível (a costura do loop).
      requestAnimationFrame(() => {
        outgoing.currentTime = 0;
      });
    }

    function onForwardEnded() {
      swapTo(reverse!, forward!);
    }
    function onReverseEnded() {
      swapTo(forward!, reverse!);
    }
    forward.addEventListener("ended", onForwardEnded);
    reverse.addEventListener("ended", onReverseEnded);

    function onVisibilityChange() {
      const active = forward!.style.opacity === "1" ? forward! : reverse!;
      if (document.hidden) {
        active.pause();
      } else {
        active.play().catch(() => {});
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      forward.removeEventListener("ended", onForwardEnded);
      reverse.removeEventListener("ended", onReverseEnded);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  // Inclinação leve seguindo o cursor — só em telas com mouse de verdade
  // (hover:hover + pointer:fine exclui touch/tablet, não só por
  // `matches` da largura da tela: um tablet grande também cai fora).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    function onMove(event: MouseEvent) {
      const rect = stage!.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 6;
      const rotateX = (0.5 - py) * 6;
      const shiftX = (px - 0.5) * 8;
      const shiftY = (py - 0.5) * 8;
      stage!.style.transition = "transform 0.15s ease-out";
      stage!.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${shiftX}px, ${shiftY}px, 0)`;
    }
    function onLeave() {
      stage!.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
      stage!.style.transform = "rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)";
    }
    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="robot-video-perspective hidden lg:block">
      {/* `stage` é o que conta pro grid do Hero (Hero.tsx usa
          `lg:grid-cols-[1fr_auto]` — a coluna direita vira exatamente a
          largura declarada aqui). Deliberadamente NÃO é aqui que o vídeo
          fica visualmente grande: se essa largura crescer demais, a
          coluna de texto à esquerda (1fr) é espremida e o título pode
          estourar. Quem cresce de verdade é o `.robot-video-frame` logo
          abaixo, que estoura pra fora desta caixa via `position:
          absolute` + inset negativo — isso não ocupa espaço nenhum no
          grid (position:absolute sai do fluxo), só aparece por cima. */}
      <div
        ref={stageRef}
        className="robot-video-stage relative aspect-video w-[48vw] min-w-[440px] max-w-[920px]"
      >
        {/* Glow ambiente atrás — mesma linguagem do resto do Hero, um
            pouco maior pra acompanhar o vídeo maior. */}
        <div
          className="absolute inset-[-20%] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(var(--accent-glow),0.4), transparent 70%)" }}
          aria-hidden
        />

        {/* Sem card/moldura/fundo — o blend+máscara (ver comentário no
            topo do arquivo) fica aqui, no wrapper, e vale pros dois
            vídeos empilhados dentro (só um visível de cada vez, via
            opacity — nunca os dois ao mesmo tempo). `isolate` contém o
            blend mode a esta camada, sem vazar pros elementos irmãos.
            O canto superior-esquerdo fica FIXO exatamente onde o
            `stage` começa (top:0/left:0) — cresce só pra baixo e pra
            direita (`right`/`bottom` negativos), que é exatamente onde
            sobra espaço vazio (a coluna de texto fica à ESQUERDA do
            stage; crescer pra esquerda é que invadiria o texto, por
            isso não cresce daquele lado). Isso faz o robô ficar bem
            maior que o `stage` e "protagonista" da área direita, com
            uma aproximação pro canto inferior direito — sem mexer no
            tamanho que o grid do Hero reserva pra esta coluna nem
            arriscar sobrepor o texto. Como o crescimento é a mesma
            proporção da caixa original (aspect-video), a proporção do
            vídeo em si não é distorcida — só aumenta de tamanho. */}
        <div
          className="robot-video-frame absolute isolate"
          style={{ top: 0, left: 0, right: "-42%", bottom: "-42%" }}
        >
          {/* Troca instantânea (sem transition de opacidade) de propósito:
              como o frame de saída e o de entrada são PIXEL A PIXEL o
              mesmo frame, um fade só arriscaria expor uma diferença de
              recompressão entre os dois arquivos por um instante — um
              corte seco entre duas imagens idênticas não mostra nada. */}
          <video
            ref={forwardRef}
            poster={POSTER_SRC}
            muted
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 h-full w-full object-contain"
          />
          <video
            ref={reverseRef}
            muted
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 h-full w-full object-contain opacity-0"
          />
        </div>
      </div>
    </div>
  );
}
