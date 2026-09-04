import type { ProjectSlug } from "@/data/projects";

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    projects: string;
    services: string;
    about: string;
    contact: string;
    cta: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    availability: string;
  };
  techStack: {
    eyebrow: string;
    title: string;
  };
  projects: {
    eyebrow: string;
    title: string;
    subtitle: string;
    viewProject: string;
    viewCode: string;
    otherProjects: string;
    items: Record<
      ProjectSlug,
      { name: string; category: string; description: string }
    >;
  };
  cases: {
    eyebrow: string;
    title: string;
    labels: {
      objective: string;
      tech: string;
      solution: string;
      result: string;
    };
    items: Record<
      ProjectSlug,
      { objective: string; solution: string; result: string }
    >;
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; description: string }[];
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  process: {
    eyebrow: string;
    title: string;
    steps: { number: string; title: string; description: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      company: string;
      companyOptional: string;
      projectType: string;
      projectTypeOptions: string[];
      message: string;
      submit: string;
      note: string;
    };
    directTitle: string;
    email: string;
    whatsapp: string;
    linkedin: string;
    placeholder: string;
  };
  footer: {
    tagline: string;
    rights: string;
  };
};

export const pt: Dictionary = {
  meta: {
    title: "Igor Lima | Front-End Developer",
    description:
      "Front-End Developer especializado em React, Next.js e TypeScript. Desenvolvo websites profissionais, landing pages e aplicações web para empresas no Brasil e no exterior.",
  },
  nav: {
    home: "Início",
    projects: "Projetos",
    services: "Serviços",
    about: "Sobre",
    contact: "Contato",
    cta: "Solicitar orçamento",
  },
  hero: {
    eyebrow: "Front-End Developer",
    title: "Websites profissionais e aplicações web modernas para empresas e marcas.",
    subtitle:
      "Desenvolvo sites institucionais, landing pages e sistemas web com React, Next.js e TypeScript — rápidos, responsivos e prontos para representar o seu negócio online.",
    ctaPrimary: "Ver projetos",
    ctaSecondary: "Solicitar orçamento",
    availability: "Disponível para novos projetos",
  },
  techStack: {
    eyebrow: "Stack",
    title: "Tecnologias que eu uso no dia a dia",
  },
  projects: {
    eyebrow: "Trabalho",
    title: "Projetos em destaque",
    subtitle:
      "Sites institucionais reais, desenvolvidos e publicados para negócios de diferentes segmentos.",
    viewProject: "Ver projeto",
    viewCode: "Ver código",
    otherProjects: "Outros projetos técnicos no GitHub",
    items: {
      "site-leo": {
        name: "Leonardo Pessanha — Psicólogo",
        category: "Site institucional",
        description:
          "Site institucional para um psicólogo clínico em Serra/ES, com blog, agendamento via WhatsApp e SEO técnico completo.",
      },
      clickcola: {
        name: "Click Cola Instalações",
        category: "Site institucional",
        description:
          "Site institucional para uma empresa de instalação de pisos em Colatina/ES, com galeria de obras e assistente de agendamento via WhatsApp.",
      },
      refriar: {
        name: "Refriar",
        category: "Site institucional",
        description:
          "Site institucional para uma empresa de climatização e assistência técnica, com formulário de orçamento integrado ao WhatsApp.",
      },
    },
  },
  cases: {
    eyebrow: "Cases",
    title: "Como cada projeto foi resolvido",
    labels: {
      objective: "Objetivo",
      tech: "Tecnologias",
      solution: "Solução",
      result: "Resultado",
    },
    items: {
      "site-leo": {
        objective:
          "Dar presença profissional online a um psicólogo clínico, facilitando o agendamento de sessões sem depender apenas de redes sociais.",
        solution:
          "Site em Next.js com blog institucional, seções de abordagem e depoimentos, e botões de agendamento que abrem o WhatsApp com uma mensagem pronta.",
        result:
          "Site publicado e no ar, com SEO técnico configurado (metadados, sitemap e Open Graph) para indexação em buscadores.",
      },
      clickcola: {
        objective:
          "Apresentar o portfólio de obras de uma empresa de instalação de pisos e transformar visitas em pedidos de orçamento.",
        solution:
          "Site em Next.js com galeria de mais de 35 fotos reais de obras e um assistente virtual que conduz o visitante até um pedido de orçamento pelo WhatsApp.",
        result:
          "Site publicado e no ar, com um canal de contato direto funcionando via WhatsApp.",
      },
      refriar: {
        objective:
          "Criar uma página institucional simples para uma empresa de climatização e assistência técnica, com um jeito fácil de pedir orçamento.",
        solution:
          "Site estático em HTML, CSS e JavaScript com um formulário que monta automaticamente uma mensagem de orçamento e abre o WhatsApp da empresa.",
        result: "Site publicado e no ar, pronto para gerar contatos comerciais.",
      },
    },
  },
  services: {
    eyebrow: "Serviços",
    title: "Serviços",
    subtitle: "O que está incluído em cada tipo de projeto.",
    items: [
      {
        title: "Website profissional",
        description:
          "Site sob medida para o seu negócio, com design responsivo, boas práticas de SEO técnico e estrutura pensada para transmitir credibilidade.",
      },
      {
        title: "Landing Page",
        description:
          "Página única focada em conversão, para divulgar um produto, serviço ou campanha específica, com chamadas para ação claras.",
      },
      {
        title: "Site institucional",
        description:
          "Site com múltiplas seções (sobre, serviços, depoimentos, contato) para apresentar sua empresa ou trabalho de forma completa.",
      },
      {
        title: "E-commerce",
        description:
          "Vitrines de produtos e catálogos online, com estrutura preparada para evoluir para um fluxo de compra completo.",
      },
      {
        title: "Aplicações Web",
        description:
          "Sistemas web com React/Next.js e TypeScript — cadastros, painéis e ferramentas internas construídas sob medida.",
      },
      {
        title: "Manutenção e melhorias",
        description:
          "Ajustes, correções e evolução de sites já existentes: performance, responsividade, SEO ou novas funcionalidades.",
      },
    ],
  },
  about: {
    eyebrow: "Sobre mim",
    title: "Igor Lima — Front-End Developer",
    paragraphs: [
      "Sou Front-End Developer focado em construir interfaces web modernas, responsivas e com boa performance.",
      "Trabalho principalmente com React, Next.js e TypeScript, unindo qualidade visual, código organizado e atenção à experiência do usuário em cada projeto.",
      "Já desenvolvi sites institucionais para negócios reais, sempre buscando equilíbrio entre design, velocidade de carregamento e facilidade de manutenção.",
    ],
  },
  process: {
    eyebrow: "Processo",
    title: "Como funciona",
    steps: [
      {
        number: "01",
        title: "Entendimento",
        description:
          "Entendo o seu negócio, seu público e o objetivo do site antes de qualquer linha de código.",
      },
      {
        number: "02",
        title: "Planejamento",
        description:
          "Planejo a estrutura de páginas, o conteúdo necessário e o fluxo de navegação.",
      },
      {
        number: "03",
        title: "Desenvolvimento",
        description:
          "Desenvolvo o site com React/Next.js, cuidando de responsividade, performance e SEO técnico desde o início.",
      },
      {
        number: "04",
        title: "Revisão",
        description:
          "Reviso o site em diferentes tamanhos de tela e navegadores antes da publicação.",
      },
      {
        number: "05",
        title: "Publicação",
        description:
          "Publico o site e entrego pronto para uso, com orientações sobre como solicitar ajustes futuros.",
      },
    ],
  },
  contact: {
    eyebrow: "Contato",
    title: "Vamos criar seu próximo projeto?",
    subtitle:
      "Me conte um pouco sobre a sua ideia ou negócio — eu retorno com os próximos passos para colocar seu projeto no ar.",
    form: {
      name: "Nome",
      email: "E-mail",
      company: "Empresa",
      companyOptional: "opcional",
      projectType: "Tipo de projeto",
      projectTypeOptions: [
        "Website profissional",
        "Landing Page",
        "Site institucional",
        "E-commerce",
        "Aplicação Web",
        "Outro",
      ],
      message: "Mensagem",
      submit: "Enviar mensagem",
      note: "Ao enviar, seu e-mail padrão será aberto com a mensagem pronta para envio.",
    },
    directTitle: "Ou fale diretamente",
    email: "seuemail@exemplo.com",
    whatsapp: "+55 (00) 00000-0000",
    linkedin: "linkedin.com/in/igor-teixeira-4055232b8",
    placeholder: "em breve",
  },
  footer: {
    tagline: "Front-End Developer",
    rights: "Todos os direitos reservados.",
  },
};
