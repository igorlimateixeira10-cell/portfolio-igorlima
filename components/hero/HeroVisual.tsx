"use client";

import dynamic from "next/dynamic";
import { AiCoreFallback } from "@/components/hero/AiCoreFallback";
import { useSlowConnection } from "@/components/hooks/useSlowConnection";

/**
 * O quadro visual da direita do Hero — hoje é o "Núcleo IA" (ver
 * AiCoreScene.tsx/components/three/AiCore.tsx). Esse componente já foi
 * outras coisas antes (o CodeCard, um alternador CodeCard/ALTER 3D,
 * depois o vídeo do robô, depois o robô 3D humanoide — nenhum foi
 * apagado, ver CodeCard.tsx, components/three/Alter*, RobotVideo.tsx,
 * Robot3D.tsx, RobotCharacter.tsx e robotAnimations.ts); troquei só o
 * que este componente renderiza.
 *
 * `next/dynamic` com `ssr: false` é obrigatório aqui: three.js/WebGL só
 * existem no navegador — tentar renderizar o Canvas no servidor
 * quebraria o build. Isso também separa o bundle pesado do R3F/three do
 * JS principal da página (quem nunca rola até aqui, ou quem tem JS
 * desabilitado, não paga o custo dele).
 */
const AiCoreScene = dynamic(() => import("@/components/hero/AiCoreScene").then((mod) => mod.AiCoreScene), {
  ssr: false,
});

/**
 * Em conexão lenta ou com "economia de dados" ligada, troca o Núcleo IA
 * (Canvas + three.js/R3F/drei, ~1,4MB de JS) por um SVG estático leve
 * (ver AiCoreFallback.tsx) com o mesmo glow ambiente — mantém a
 * identidade visual da Hero sem forçar esse download em quem tem
 * conexão ruim. Onde a API não existe (Safari, principalmente), sempre
 * mostra a cena 3D — nunca nega a experiência completa por falta de
 * informação, só reage quando o navegador realmente avisa que está ruim.
 */
export function HeroVisual() {
  const isSlowConnection = useSlowConnection();

  if (isSlowConnection) return <AiCoreFallback />;
  return <AiCoreScene />;
}
