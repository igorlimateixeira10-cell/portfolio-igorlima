import Image from "next/image";

/**
 * Substituto leve do robô 3D pra conexão ruim/"economia de dados" (ver
 * HeroVisual.tsx, que decide qual dos dois renderizar). Em vez de baixar
 * ~1,4MB de three.js/R3F/drei + o modelo, mostra só uma imagem estática
 * (a mesma que já servia de poster do vídeo antigo do robô, ainda em
 * public/robo-poster.jpg — nenhum arquivo novo) com o mesmo glow azul
 * ambiente do resto da Hero, pra manter a mesma identidade visual sem o
 * custo de WebGL.
 *
 * Mesma técnica de "sem card/moldura" já usada em RobotVideo.tsx: a
 * imagem em si tem um fundo de sala de servidor (não é uma cor sólida
 * recortável), então `.robot-video-frame` (mix-blend-mode + máscara
 * radial, ver globals.css) funde as partes escuras com o fundo da
 * página e esmaece as quinas retangulares — sem isso, a imagem apareceria
 * dentro de um retângulo visível, inconsistente com o resto do site.
 */
export function RobotFallbackImage() {
  return (
    <div className="robot3d-perspective w-full lg:w-auto">
      <div className="robot3d-stage relative mx-auto flex aspect-3/4 w-full max-w-xs items-center justify-center sm:max-w-sm md:max-w-md lg:mx-0 lg:aspect-auto lg:h-[72vh] lg:max-h-[760px] lg:min-h-[460px] lg:w-[38vw] lg:min-w-[380px] lg:max-w-[620px]">
        <div className="robot3d-glow" aria-hidden />
        <div className="robot-video-frame relative isolate h-full w-full">
          <Image
            src="/robo-poster.jpg"
            alt=""
            aria-hidden
            fill
            priority
            sizes="(min-width: 1024px) 38vw, 24rem"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
