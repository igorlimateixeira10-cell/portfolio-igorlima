// Dados factuais dos projetos — apenas informações verificadas no código-fonte
// e nos READMEs reais de cada repositório. Não inclua nada aqui sem confirmar
// no repositório correspondente primeiro.

export type ProjectSlug = "site-leo" | "clickcola" | "refriar";

export type Project = {
  slug: ProjectSlug;
  image: string;
  liveUrl: string;
  githubUrl: string;
  tech: string[];
};

export const projects: Project[] = [
  {
    slug: "site-leo",
    image: "/projects/pesanha.jpg",
    liveUrl: "https://site-leo-nine.vercel.app",
    githubUrl: "https://github.com/igorlimateixeira10-cell/site-leo",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "clickcola",
    image: "/projects/fabio.jpg",
    liveUrl: "https://projeto-clickcola.vercel.app",
    githubUrl: "https://github.com/igorlimateixeira10-cell/projeto-clickcola",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "refriar",
    image: "/projects/yago.jpg",
    liveUrl: "https://projeto-refriar.vercel.app",
    githubUrl: "https://github.com/igorlimateixeira10-cell/projeto-refriar",
    tech: ["HTML5", "CSS3", "JavaScript"],
  },
];
