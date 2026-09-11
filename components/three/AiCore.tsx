"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * "Núcleo IA" — substitui o robô humanoide por um elemento abstrato de
 * "produto tecnológico/IA": um núcleo facetado com brilho de borda
 * (fresnel), uma casca em wireframe por cima, dois anéis girando em
 * eixos inclinados (estilo giroscópio), fragmentos flutuando em órbita
 * e um campo de partículas ao redor.
 *
 * Tudo construído com geometria procedural do próprio Three.js — nenhum
 * arquivo .glb, nenhuma textura, nenhuma animação externa. Isso não é só
 * estética: é a decisão técnica que evita repetir a categoria inteira de
 * problema documentada em robotAnimations.ts (retarget do Mixamo
 * quebrando pose num rig customizado) — aqui não existe rig, esqueleto
 * nem retarget, então esse bug simplesmente não pode acontecer.
 *
 * Cada peça respeita `reduceMotion` (prop vinda de AiCoreScene.tsx, que
 * lê `prefers-reduced-motion` uma vez): com motion reduzido, nenhum
 * `useFrame` daqui mexe em transform/uniform — a cena fica parada numa
 * pose limpa, nunca em branco.
 */

const ACCENT = "#1d4ed8";
const ACCENT_LIGHT = "#3b82f6";
const ACCENT_CYAN = "#22d3ee";

// Shader do brilho de borda (fresnel): quanto mais "de raspão" a normal
// da superfície está em relação à câmera, mais forte o brilho — o
// centro da forma fica quase apagado, só a BORDA acende, como se
// tivesse energia contida por dentro vazando pelas bordas (o truque
// clássico de holograma/sci-fi).
const fresnelVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fresnelFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.6);
    // Cintilação leve "de dados" — soma de senos amarrada à normal, é
    // barata (nenhuma textura de ruído) e não parece um GIF repetindo.
    float shimmer = 0.85 + 0.15 * sin(uTime * 2.2 + vNormal.x * 6.0 + vNormal.y * 4.0);
    gl_FragColor = vec4(uColor * fresnel * uIntensity * shimmer, fresnel);
  }
`;

function FresnelShell({ geometry, reduceMotion }: { geometry: THREE.BufferGeometry; reduceMotion: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(ACCENT_CYAN) },
      uTime: { value: 0 },
      uIntensity: { value: 1.4 },
    }),
    []
  );

  useFrame((_state, delta) => {
    if (reduceMotion || !materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh geometry={geometry} scale={1.04}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={fresnelVertexShader}
        fragmentShader={fresnelFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

function OrbitRing({
  radius,
  tubeRadius,
  tilt,
  speed,
  nodeCount,
  color,
  reduceMotion,
}: {
  radius: number;
  tubeRadius: number;
  tilt: [number, number, number];
  speed: number;
  nodeCount: number;
  color: string;
  reduceMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => new THREE.TorusGeometry(radius, tubeRadius, 8, 96), [radius, tubeRadius]);

  useFrame((_state, delta) => {
    if (reduceMotion || !groupRef.current) return;
    groupRef.current.rotation.z += delta * speed;
  });

  const nodes = useMemo(
    () =>
      Array.from({ length: nodeCount }, (_, i) => {
        const angle = (i / nodeCount) * Math.PI * 2;
        return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0] as [number, number, number];
      }),
    [nodeCount, radius]
  );

  return (
    <group rotation={tilt}>
      <group ref={groupRef}>
        <mesh geometry={geometry}>
          <meshStandardMaterial color="#cbd5f5" metalness={0.9} roughness={0.2} />
        </mesh>
        {nodes.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[tubeRadius * 1.8, 12, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function FloatingShard({
  radius,
  height,
  speed,
  phase,
  scale,
  reduceMotion,
}: {
  radius: number;
  height: number;
  speed: number;
  phase: number;
  scale: number;
  reduceMotion: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (reduceMotion || !ref.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    ref.current.position.set(Math.cos(t) * radius, height + Math.sin(t * 1.7) * 0.15, Math.sin(t) * radius);
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.015;
  });

  // Posição inicial (motion reduzido nunca chama o useFrame acima, então
  // sem isto o fragmento ficaria preso na origem, dentro do núcleo).
  const initialPosition = useMemo<[number, number, number]>(
    () => [Math.cos(phase) * radius, height, Math.sin(phase) * radius],
    [phase, radius, height]
  );

  return (
    <mesh ref={ref} position={initialPosition} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color={ACCENT_LIGHT}
        emissive={ACCENT_LIGHT}
        emissiveIntensity={0.5}
        metalness={0.6}
        roughness={0.25}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

// `Math.random()` não pode rodar durante o render (nem dentro de
// useMemo — o linter de pureza do React Compiler trata o corpo de
// useMemo como parte do render pra fins de análise de pureza) — os
// pontos são gerados UMA VEZ, no carregamento do módulo, não a cada
// render. `<ParticleField>` não recebe count/radius customizados em
// lugar nenhum do app, então não há motivo pra suportar isso — só a
// constante, sem props.
const PARTICLE_COUNT = 420;
const PARTICLE_RADIUS = 3.2;

function createParticlePositions(): Float32Array {
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Distribui numa casca esférica (raio variando pouco, não um bolo
    // sólido) — dá o efeito de "campo de energia" ao redor do núcleo.
    const r = PARTICLE_RADIUS * (0.75 + Math.random() * 0.35);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

const PARTICLE_POSITIONS = createParticlePositions();

function ParticleField({ reduceMotion }: { reduceMotion: boolean }) {
  const groupRef = useRef<THREE.Points>(null);

  useFrame((_state, delta) => {
    if (reduceMotion || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.03;
  });

  return (
    <points ref={groupRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[PARTICLE_POSITIONS, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={ACCENT_CYAN}
        size={0.02}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * O núcleo em si: geometria facetada (icosaedro) com três camadas na
 * MESMA geometria — material físico (metal + clearcoat + iridescência,
 * recursos nativos do MeshPhysicalMaterial, sem precisar de shader
 * próprio pra isso), a casca de brilho fresnel por cima, e uma casca
 * wireframe por cima disso — o visual "holograma sólido".
 */
function Core({ reduceMotion }: { reduceMotion: boolean }) {
  const coreRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);

  useFrame((state, delta) => {
    if (reduceMotion) return;
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.18;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 2.2 + Math.sin(state.clock.elapsedTime * 1.6) * 0.6;
    }
  });

  return (
    <group ref={coreRef}>
      <pointLight ref={lightRef} color={ACCENT_LIGHT} intensity={2.2} distance={4} />
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={ACCENT}
          metalness={0.85}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.12}
          iridescence={0.6}
          iridescenceIOR={1.3}
          emissive={ACCENT}
          emissiveIntensity={0.12}
        />
      </mesh>
      <FresnelShell geometry={geometry} reduceMotion={reduceMotion} />
      <mesh geometry={geometry} scale={1.09}>
        <meshBasicMaterial color={ACCENT_CYAN} wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

const SHARDS = [
  { radius: 2.1, height: 0.4, speed: 0.35, phase: 0, scale: 0.16 },
  { radius: 2.3, height: -0.3, speed: 0.28, phase: 1.4, scale: 0.12 },
  { radius: 1.9, height: 0.7, speed: 0.42, phase: 2.8, scale: 0.1 },
  { radius: 2.5, height: 0, speed: 0.22, phase: 4.2, scale: 0.14 },
  { radius: 2.0, height: -0.6, speed: 0.38, phase: 5.5, scale: 0.11 },
];

/** Elemento completo — o que AiCoreScene.tsx monta dentro do Canvas. */
export function AiCore({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <group>
      <Core reduceMotion={reduceMotion} />
      <OrbitRing
        radius={1.7}
        tubeRadius={0.012}
        tilt={[Math.PI / 2.4, 0.3, 0]}
        speed={0.5}
        nodeCount={4}
        color={ACCENT_CYAN}
        reduceMotion={reduceMotion}
      />
      <OrbitRing
        radius={2.05}
        tubeRadius={0.01}
        tilt={[-Math.PI / 3, -0.4, 0.2]}
        speed={-0.35}
        nodeCount={6}
        color={ACCENT_LIGHT}
        reduceMotion={reduceMotion}
      />
      {SHARDS.map((s, i) => (
        <FloatingShard key={i} {...s} reduceMotion={reduceMotion} />
      ))}
      <ParticleField reduceMotion={reduceMotion} />
    </group>
  );
}
