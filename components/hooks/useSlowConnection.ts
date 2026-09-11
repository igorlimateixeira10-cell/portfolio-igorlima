"use client";

import { useSyncExternalStore } from "react";

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

function subscribe(callback: () => void) {
  const conn = getConnection();
  if (!conn) return () => {};
  conn.addEventListener("change", callback);
  return () => conn.removeEventListener("change", callback);
}

const SLOW_TYPES = new Set(["slow-2g", "2g", "3g"]);

function getSnapshot() {
  const conn = getConnection();
  // Safari e outros navegadores sem a API: não dá pra saber a conexão
  // real, então assume boa — nunca nega a experiência completa por
  // falta de informação.
  if (!conn) return false;
  if (conn.saveData) return true;
  return !!conn.effectiveType && SLOW_TYPES.has(conn.effectiveType);
}

function getServerSnapshot() {
  // O servidor nunca sabe a conexão do visitante — mesmo valor que o
  // cliente usa ANTES de hidratar, pra não dar mismatch de hidratação;
  // a checagem real acontece logo em seguida, já no cliente.
  return false;
}

/**
 * Detecta conexão lenta / "economia de dados" ligada (extraído de
 * HeroVisual.tsx pra ser reaproveitado também pelos painéis 3D de
 * projeto — ver Projects.tsx). Onde a API não existe, sempre assume
 * conexão boa, nunca reduz a experiência por falta de informação.
 */
export function useSlowConnection() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
