"use client";

import { useEffect, useRef } from "react";
import type * as THREE from "three";

/**
 * Fundo 3D discreto do Hero — pontos esparsos e 3 sólidos em wireframe
 * girando devagar, nas cores do próprio site (sem neon).
 *
 * Cuidados de performance/acessibilidade:
 * - Three.js só é carregado dentro do useEffect (nunca no SSR nem no bundle
 *   inicial) — não afeta o carregamento nem o LCP da página.
 * - Não roda se o usuário preferir menos movimento (prefers-reduced-motion).
 * - Pausa sozinho quando a aba está em segundo plano ou quando a cena sai da
 *   tela (IntersectionObserver), para não gastar CPU/bateria à toa.
 * - pixelRatio limitado e poucos elementos (baixo custo mesmo em notebooks
 *   modestos).
 * - Se o WebGL não estiver disponível, simplesmente não desenha nada — a
 *   grade estática do Hero continua servindo de fundo.
 */
export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // O contêiner já fica oculto (hidden lg:block) abaixo do breakpoint
    // "lg" — nem vale a pena baixar o Three.js nesse caso (economiza dados
    // e bateria em celular, onde a cena nem apareceria).
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }

    let disposed = false;
    let cleanup: (() => void) | undefined;

    // Adia o carregamento do Three.js até a thread principal ficar livre
    // (depois da hidratação), para não competir com o carregamento inicial
    // da página nem aumentar o tempo de bloqueio.
    const load = () => import("three").then((mod) => {
      if (disposed || !container) return;
      const THREE = mod as unknown as typeof import("three");

      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return; // sem suporte a WebGL — mantém só a grade estática
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, 9);

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(width, height);
      renderer.domElement.style.display = "block";
      container.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      const lineColor = new THREE.Color("#c7cbd6");
      const accentColor = new THREE.Color("#2f5cf6");

      // Campo de pontos esparso — dá profundidade sem chamar atenção.
      const pointCount = 90;
      const positions = new Float32Array(pointCount * 3);
      for (let i = 0; i < pointCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 11;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      }
      const pointsGeometry = new THREE.BufferGeometry();
      pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const pointsMaterial = new THREE.PointsMaterial({
        color: lineColor,
        size: 0.045,
        transparent: true,
        opacity: 0.5,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(pointsGeometry, pointsMaterial);
      group.add(points);

      // Três sólidos em wireframe — o que deixa o "3D" evidente à primeira vista.
      const geometries = [
        new THREE.IcosahedronGeometry(1.1, 0),
        new THREE.OctahedronGeometry(0.9, 0),
        new THREE.TetrahedronGeometry(1, 0),
      ];
      const shapes = geometries.map((geometry, i) => {
        const material = new THREE.MeshBasicMaterial({
          color: i === 1 ? accentColor : lineColor,
          wireframe: true,
          transparent: true,
          opacity: i === 1 ? 0.55 : 0.35,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set((i - 1) * 3.3, Math.sin(i) * 1.1, (i - 1) * -1.6);
        group.add(mesh);
        return mesh;
      });

      let inView = true;
      let running = true;
      let frameId = 0;
      const clock = new THREE.Clock();

      function animate() {
        if (!running) return;
        frameId = requestAnimationFrame(animate);
        if (!inView || document.hidden) return;

        const t = clock.getElapsedTime();
        group.rotation.y = t * 0.05;
        group.rotation.x = Math.sin(t * 0.1) * 0.05;
        shapes.forEach((mesh, i) => {
          mesh.rotation.x += 0.0022 + i * 0.0004;
          mesh.rotation.y += 0.003;
          mesh.position.y += Math.sin(t * 0.6 + i) * 0.0012;
        });

        renderer.render(scene, camera);
      }
      animate();

      const resizeObserver = new ResizeObserver(() => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });
      resizeObserver.observe(container);

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
        },
        { threshold: 0 }
      );
      intersectionObserver.observe(container);

      cleanup = () => {
        running = false;
        cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        pointsGeometry.dispose();
        pointsMaterial.dispose();
        shapes.forEach((mesh) => {
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
        });
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    });

    let idleId: number;
    let cancelIdle: () => void;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(load);
      cancelIdle = () => window.cancelIdleCallback(idleId);
    } else {
      idleId = window.setTimeout(load, 200);
      cancelIdle = () => window.clearTimeout(idleId);
    }

    return () => {
      disposed = true;
      cancelIdle();
      cleanup?.();
    };
  }, []);

  return <div ref={containerRef} aria-hidden className="absolute inset-0" />;
}
