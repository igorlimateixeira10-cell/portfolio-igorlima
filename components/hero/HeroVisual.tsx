"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { RobotFallbackImage } from "@/components/hero/RobotFallbackImage";

/**
 * O quadro visual da direita do Hero — hoje é o robô 3D (ver
 * Robot3D.tsx/components/three/). Esse componente já foi outras coisas
 * antes (o CodeCard, um alternador CodeCard/ALTER 3D, depois o vídeo do
 * robô — nenhum foi apagado, ver CodeCard.tsx, components/three/Alter*
 * e RobotVideo.tsx); troquei só o que este componente renderiza.
 *
 * `next/dynamic` com `ssr: false` é obrigatório aqui: three.js/WebGL só
 * existem no navegador — tentar renderizar o Canvas no servidor
 * quebraria o build. Isso também separa o bundle pesado do R3F/three do
 * JS principal da página (quem nunca rola até aqui, ou quem tem JS
 * desabilitado, não paga o custo dele).
 */
const Robot3D = dynamic(() => import("@/components/hero/Robot3D").then((mod) => mod.Robot3D), {
  ssr: false,
});

/** Network Information API — não faz parte do lib.dom.d.ts padrão do
 * TypeScript (é experimental; Safari nunca implementou). Só os campos
 * que realmente uso. */
interface NetworkInformationLike extends EventTarget {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
}

function getConnection(): NetworkInformationLike | undefined {
  if (typeof navigator === "undefined") return undefined;
  const nav = navigator as Navigator & {
    connection?: NetworkInformationLike;
    mozConnection?: NetworkInformationLike;
    webkitConnection?: NetworkInformationLike;
  };
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
}

function subscribeSlowConnection(callback: () => void) {
  const conn = getConnection();
  if (!conn) return () => {};
  conn.addEventListener("change", callback);
  return () => conn.removeEventListener("change", callback);
}

const SLOW_TYPES = new Set(["slow-2g", "2g", "3g"]);

function getSlowConnectionSnapshot() {
  const conn = getConnection();
  // Safari e outros navegadores sem a API: não dá pra saber a conexão
  // real, então assume boa e mostra o robô 3D normalmente — nunca nega
  // a experiência completa por falta de informação.
  if (!conn) return false;
  if (conn.saveData) return true;
  return !!conn.effectiveType && SLOW_TYPES.has(conn.effectiveType);
}

function getSlowConnectionServerSnapshot() {
  // O servidor nunca sabe a conexão do visitante — mesmo valor que o
  // cliente usa ANTES de hidratar (ver useSyncExternalStore), pra não
  // dar mismatch de hidratação; a checagem real acontece logo em
  // seguida, já no cliente.
  return false;
}

/**
 * Em conexão lenta ou com "economia de dados" ligada, troca o robô 3D
 * (Canvas + three.js/R3F/drei, ~1,4MB de JS) por uma imagem estática
 * leve (ver RobotFallbackImage.tsx) com o mesmo glow ambiente — mantém
 * a identidade visual da Hero sem forçar esse download em quem tem
 * conexão ruim. Onde a API não existe (Safari, principalmente), sempre
 * mostra o robô 3D — nunca nega a experiência completa por falta de
 * informação, só reage quando o navegador realmente avisa que está ruim.
 */
export function HeroVisual() {
  const isSlowConnection = useSyncExternalStore(
    subscribeSlowConnection,
    getSlowConnectionSnapshot,
    getSlowConnectionServerSnapshot
  );

  if (isSlowConnection) return <RobotFallbackImage />;
  return <Robot3D />;
}
