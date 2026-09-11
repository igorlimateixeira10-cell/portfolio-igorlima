/**
 * Registro central das animações do ALTER — é AQUI que se pluga um
 * arquivo novo baixado do Mixamo (ver instruções em
 * public/models/alter/animations/README.md), nunca em AlterCharacter.tsx.
 *
 * "reference-run" é o clipe que já vinha embutido no próprio alter.glb —
 * serviu só pra validar o rig, não é usado no Hero.
 *
 * "typing" é a primeira animação externa de verdade: baixada do Mixamo
 * (public/models/alter/animations/Typing.fbx, 13MB, malha+esqueleto+
 * animação juntos, "com pele" e sem redução de quadros-chave, como o
 * Mixamo entrega). Os bones do Typing.fbx batem nome-a-nome com os do
 * alter.glb (conferido: Hips, Spine02, Spine01, Spine, LeftForeArm...
 * idênticos) — não precisou de nenhum retarget/renomeação de bone.
 *
 * O que está registrado abaixo (`typing.glb`) NÃO é o Typing.fbx direto:
 * é ele reprocessado com o mesmo pipeline do alter.glb (assimp export +
 * um script removendo a malha/material duplicados — já temos a malha no
 * alter.glb — + gltfpack comprimindo as curvas de animação). Resultado:
 * 13MB → 24,7KB, mesma duração (16,47s) e os mesmos 495 quadros-chave,
 * só sem carregar uma segunda cópia inteira do personagem à toa.
 *
 * "looking" segue o mesmo padrão: baixado do Mixamo como
 * "Looking Around.fbx" (13MB, mesmos 22 bones idênticos ao alter.glb,
 * conferido — sem retarget), reprocessado com o mesmo pipeline pra
 * `looking.glb` (13MB → 18,8KB), mesma duração (6,47s) e os mesmos 195
 * quadros-chave do arquivo original.
 *
 * Os outros dois estados (interaction/gesture) continuam com
 * `file: null` — nenhuma animação foi inventada pra eles.
 */

export type AlterAnimationState =
  | "reference-run"
  | "idle"
  | "typing"
  | "looking"
  | "interaction"
  | "gesture";

export type AlterAnimationSource = {
  /**
   * Caminho do arquivo dentro de public/models/alter/animations/
   * (.fbx ou .glb — os dois são suportados, ver AlterCharacter.tsx).
   * `null` = ainda não existe; o estado fica inativo até alguém
   * registrar um arquivo real aqui.
   */
  file: string | null;
  /**
   * Nome do clipe DENTRO do arquivo. O Mixamo costuma nomear o clipe
   * "mixamo.com" não importa qual animação você baixou — troque esse
   * valor pra bater com o nome real depois de conferir (dá pra ver o
   * nome no console: qualquer AlterCharacter loga os clipes disponíveis
   * de cada arquivo novo que carrega, ver comentário no componente).
   * `null` enquanto `file` também for `null`.
   */
  clipName: string | null;
  /** Anima em loop contínuo (idle, typing, interaction) ou só uma vez e
   * mantém a última pose (looking, gesture)? */
  loop: boolean;
};

export const ALTER_ANIMATIONS: Record<AlterAnimationState, AlterAnimationSource> = {
  // Único clipe real hoje — já vem embutido no alter.glb (por isso
  // `file: null`: não é um arquivo externo desta pasta). Serve só de
  // teste de rig, não é a experiência final do Hero.
  "reference-run": {
    file: null,
    clipName: "Armature|Armature|running|baselayer",
    loop: true,
  },

  // Animações externas reais — ver comentário acima.
  typing: { file: "typing.glb", clipName: "mixamo.com", loop: true },
  looking: { file: "looking.glb", clipName: "mixamo.com", loop: false },

  // Os três abaixo continuam previstos pro ALTER sentado trabalhando
  // (ver objetivo final na conversa) mas sem animação ainda. Preencha
  // `file`/`clipName` conforme forem baixados do Mixamo.
  idle: { file: null, clipName: null, loop: true },
  interaction: { file: null, clipName: null, loop: true },
  gesture: { file: null, clipName: null, loop: false },
};

/** Estados que já têm um arquivo externo pra carregar (hoje: só "typing.glb"). */
export function listExternalAnimationFiles(): string[] {
  const files = Object.values(ALTER_ANIMATIONS)
    .map((entry) => entry.file)
    .filter((file): file is string => file !== null);
  return Array.from(new Set(files));
}

/**
 * Um passo da sequência narrativa do Hero: qual estado, e quanto tempo
 * (em segundos) ele fica em cena antes de passar pro próximo — ver
 * useAlterHeroSequence.ts, que consome isso.
 */
export type AlterSequenceStep = {
  state: AlterAnimationState;
  holdSeconds: number;
};

/**
 * A sequência COMPLETA pretendida pro Hero: digitando → olhando/
 * interagindo com a tela → joinha → volta pra digitar (loop). Isso é só
 * a INTENÇÃO — nem todo estado listado aqui tem animação de verdade
 * ainda (ver ALTER_ANIMATIONS). `getActiveHeroSequence()` abaixo filtra
 * pra só os que realmente têm clipe, então adicionar um arquivo novo no
 * futuro (registrar em ALTER_ANIMATIONS) já basta pra ele entrar na
 * sequência — não precisa mexer aqui nem no hook.
 */
const ALTER_HERO_SEQUENCE: AlterSequenceStep[] = [
  { state: "typing", holdSeconds: 14 },
  // 7s, não 4: o clipe de "looking" dura 6,47s de verdade (conferido) e
  // não repete (`loop: false`) — precisa de tempo pra terminar antes de
  // cruzar pro próximo estado, senão corta a animação no meio.
  { state: "looking", holdSeconds: 7 },
  { state: "gesture", holdSeconds: 3 },
];

/**
 * Filtra ALTER_HERO_SEQUENCE pros passos que têm clipe de verdade
 * (`clipName` não-nulo em ALTER_ANIMATIONS). Hoje só "typing" passa —
 * "looking" e "gesture" ainda não têm arquivo (ver README.md da pasta
 * animations/), então o resultado atual é só [typing]: o ALTER fica
 * digitando o tempo todo, sem "buraco" nenhum na sequência, porque não
 * existe transição pra lugar nenhum ainda.
 */
export function getActiveHeroSequence(): AlterSequenceStep[] {
  return ALTER_HERO_SEQUENCE.filter((step) => ALTER_ANIMATIONS[step.state].clipName !== null);
}
