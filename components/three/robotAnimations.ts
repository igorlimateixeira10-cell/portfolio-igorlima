/**
 * Registro central das animações do robô 3D (ver assets-source/robot/ — fonte
 * original intacta — e components/three/RobotCharacter.tsx, que é quem
 * consome isto). Mesmo espírito do antigo alterAnimations.ts: quem
 * pluga uma animação nova é este arquivo, nunca o componente.
 *
 * Os 8 arquivos em assets-source/robot/animations/*.fbx (Mixamo, "com pele" —
 * malha+esqueleto+animação juntos, do jeito que o Mixamo entrega) foram
 * IDENTIFICADOS UM A UM (não presumido pelo nome do arquivo — conferido
 * via assimp: cada um embute DOIS clipes, "Armature|Armature|running|
 * baselayer" — resquício do rig base — e "mixamo.com", que é o
 * conteúdo real; usamos sempre o segundo) e convertidos pra glTF/.glb em
 * public/models/robot/ SEM apagar nem substituir o original: a malha
 * (pesada, 116k vértices) só existe uma vez em robot.glb; cada arquivo
 * em animations/ tem só esqueleto+curvas de animação (malha/material
 * removidos — já tem em robot.glb), então cada um ficou de ~12,6MB pra
 * ~10-16KB.
 *
 * Correspondência arquivo → estado (todos os 8 .fbx originais, nenhum
 * apagado nem substituído):
 *   Idle.fbx              → idle    (base da postura "em pé", ver nota abaixo)
 *   Standing Greeting.fbx → greeting
 *   Salute.fbx             → salute
 *   Jogging.fbx            → jog
 *   Running To Turn.fbx   → run-turn
 *   Start Walking.fbx     → walk
 *   Strut Walking.fbx     → strut
 *   Start Plank.fbx        → plank
 *
 * Todos os 22 bones batem nome-a-nome com o robot.glb (mesmo rig Mixamo
 * — conferido via assimp antes de converter), então nenhum retarget de
 * NOME foi necessário. Mas o retarget de ROTAÇÃO em si veio torto: o
 * upload original pro Mixamo (feito pelo dono do projeto, fora desta
 * conversão) calibrou o rig de um jeito que deixa o personagem com as
 * pernas fortemente dobradas em QUALQUER animação — conferido testando
 * Idle, Salute e Standing Greeting cada um com sua PRÓPRIA malha
 * (nenhum retarget cruzado envolvido), todos mostrando a mesma
 * distorção. Não é bug desta conversão; é descompasso de eixo entre o
 * esqueleto humano do Mixamo e o rig deste robô.
 *
 * Correção aplicada (ver build-correction.mjs + process-anim-v3.mjs,
 * scripts de conversão — não fazem parte do bundle): calculei, a partir
 * da própria geometria de bind do personagem (comprimento/posição real
 * de cada osso — nada inventado), a rotação que faz cada segmento de
 * perna/braço/coluna apontar numa direção "em pé" natural (coluna reta,
 * pernas retas, braços caídos ao lado do corpo), e apliquei essa
 * correção em CIMA de cada quadro de TODAS as animações. Isso resolve o
 * descompasso pra qualquer clipe, incluindo os de locomoção.
 *
 * "idle" (o estado padrão/principal) usa uma pose ESTÁTICA construída
 * com essa mesma correção — não o clipe Idle.fbx real tocando. Motivo:
 * mesmo corrigido quadro a quadro, o Idle.fbx original ainda balança
 * bastante ao longo do próprio loop (o joelho volta a dobrar em alguns
 * pontos do ciclo — conferido girando a câmera em momentos diferentes).
 * Como o requisito é "nunca de joelhos" no estado parado, uma pose
 * estática garante isso 100% do tempo. As outras animações (greeting,
 * salute, jog) tocam o conteúdo real e corrigido do arquivo — são
 * estados passageiros, não o padrão, então uma variação pontual de pose
 * durante o gesto é aceitável.
 */

export type RobotAnimationState =
  | "idle"
  | "salute"
  | "greeting"
  | "plank"
  | "walk"
  | "jog"
  | "run-turn"
  | "strut";

export type RobotAnimationSource = {
  /** Caminho dentro de /public/models/robot/animations/. */
  file: string;
  /** Nome do clipe dentro do arquivo — sempre "mixamo.com" nestes 8. */
  clipName: string;
  /** Loop contínuo (idle) ou só uma vez, mantendo a pose final (gestos)? */
  loop: boolean;
  /** Busca em segundo plano assim que o robô entra em cena (sem
   * bloquear o primeiro frame, que só espera "idle")? `false` = arquivo
   * fica disponível no registro (não foi apagado, não foi substituído)
   * mas só é buscado se/quando alguém realmente pedir esse estado. */
  preload: boolean;
};

export const ROBOT_ANIMATIONS: Record<RobotAnimationState, RobotAnimationSource> = {
  // Postura principal — "em pé", pernas estendidas, braços ao lado do
  // corpo (ver nota grande no topo do arquivo sobre por que é uma pose
  // estática corrigida, não o Idle.fbx tocando direto).
  idle: { file: "idle.glb", clipName: "mixamo.com", loop: true, preload: true },

  // Sequência automática da Hero (ver ROBOT_HERO_SEQUENCE) — conteúdo
  // real dos clipes baixados, com a correção de postura aplicada.
  greeting: { file: "standing-greeting.glb", clipName: "mixamo.com", loop: false, preload: true },
  salute: { file: "salute.glb", clipName: "mixamo.com", loop: false, preload: true },
  jog: { file: "jogging.glb", clipName: "mixamo.com", loop: false, preload: true },

  // Disponíveis no sistema (carregados sob demanda, nunca apagados) mas
  // fora da sequência automática: são passos de locomoção/chão que não
  // encaixam numa Hero parada, ou (Start Plank) terminam numa pose de
  // exercício/chão — o pedido original é explícito em não deixar o
  // personagem parecer ajoelhado/deitado/em exercício na Hero.
  plank: { file: "start-plank.glb", clipName: "mixamo.com", loop: false, preload: false },
  walk: { file: "start-walking.glb", clipName: "mixamo.com", loop: false, preload: false },
  "run-turn": { file: "running-to-turn.glb", clipName: "mixamo.com", loop: false, preload: false },
  strut: { file: "strut-walking.glb", clipName: "mixamo.com", loop: false, preload: false },
};

export type RobotSequenceStep = {
  state: RobotAnimationState;
  /** Quanto tempo (segundos) o estado fica em cena antes do próximo —
   * sempre maior que a duração real do clipe, pra animação de gesto
   * terminar antes do próximo crossfade. */
  holdSeconds: number;
};

/**
 * Sequência automática e lógica da Hero — igual ao pedido: em pé →
 * cumprimento → continência → jogging → volta a ficar em pé, e repete.
 * Cada troca de estado já faz crossfade suave (ver o efeito de
 * fadeIn/fadeOut em RobotCharacter.tsx) — este array só decide QUANDO
 * trocar.
 *
 * Durações reais dos clipes (conferidas na conversão): salute 2,83s,
 * greeting 5,1s, jog 2,57s — os `holdSeconds` abaixo dão folga de
 * sobra pra cada um terminar com tranquilidade antes do crossfade.
 */
export const ROBOT_HERO_SEQUENCE: RobotSequenceStep[] = [
  { state: "idle", holdSeconds: 10 },
  { state: "greeting", holdSeconds: 6.5 },
  { state: "idle", holdSeconds: 6 },
  { state: "salute", holdSeconds: 4 },
  { state: "idle", holdSeconds: 6 },
  { state: "jog", holdSeconds: 3.5 },
];
