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
    proof: string;
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
    caseLabel: string;
    labels: {
      objective: string;
      tech: string;
      solution: string;
      result: string;
    };
    items: Record<
      ProjectSlug,
      {
        name: string;
        category: string;
        description: string;
        objective: string;
        solution: string;
        result: string;
      }
    >;
  };
  whyMe: {
    eyebrow: string;
    title: string;
    items: { title: string; description: string }[];
  };
  services: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; description: string }[];
    ctaText: string;
    ctaLink: string;
  };
  about: {
    eyebrow: string;
    title: string;
    lead: string;
    paragraphs: string[];
    principlesLabel: string;
    principles: string[];
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
    whatsappMessage: string;
    linkedin: string;
  };
  footer: {
    tagline: string;
    rights: string;
  };
};

export const pt: Dictionary = {
  meta: {
    title: "Igor Lima Teixeira | Front-End Developer",
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
    proof: "3 sites reais, publicados e no ar",
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
    viewProject: "Visitar o site",
    viewCode: "Ver código no GitHub",
    otherProjects: "Outros projetos técnicos no GitHub",
    caseLabel: "Case",
    labels: {
      objective: "Objetivo",
      tech: "Tecnologias",
      solution: "Solução desenvolvida",
      result: "Resultado",
    },
    items: {
      "site-leo": {
        name: "Leonardo Pessanha — Psicólogo",
        category: "Site institucional",
        description:
          "Site institucional para um psicólogo clínico em Serra/ES, com blog, agendamento via WhatsApp e SEO técnico completo.",
        objective:
          "Dar presença profissional online a um psicólogo clínico, facilitando o agendamento de sessões sem depender apenas de redes sociais.",
        solution:
          "Site em Next.js com blog institucional, seções de abordagem e depoimentos, e botões de agendamento que abrem o WhatsApp com uma mensagem pronta.",
        result:
          "Site publicado e no ar, com SEO técnico configurado (metadados, sitemap e Open Graph) para indexação em buscadores.",
      },
      clickcola: {
        name: "Click Cola Instalações",
        category: "Site institucional",
        description:
          "Site institucional para uma empresa de instalação de pisos em Colatina/ES, com galeria de obras e assistente de agendamento via WhatsApp.",
        objective:
          "Apresentar o portfólio de obras de uma empresa de instalação de pisos e transformar visitas em pedidos de orçamento.",
        solution:
          "Site em Next.js com galeria de mais de 35 fotos reais de obras e um assistente virtual que conduz o visitante até um pedido de orçamento pelo WhatsApp.",
        result:
          "Site publicado e no ar, com um canal de contato direto funcionando via WhatsApp.",
      },
      refriar: {
        name: "Refriar",
        category: "Site institucional",
        description:
          "Site institucional para uma empresa de climatização e assistência técnica, com formulário de orçamento integrado ao WhatsApp.",
        objective:
          "Criar uma página institucional simples para uma empresa de climatização e assistência técnica, com um jeito fácil de pedir orçamento.",
        solution:
          "Site estático em HTML, CSS e JavaScript com um formulário que monta automaticamente uma mensagem de orçamento e abre o WhatsApp da empresa.",
        result: "Site publicado e no ar, pronto para gerar contatos comerciais.",
      },
    },
  },
  whyMe: {
    eyebrow: "Por que trabalhar comigo",
    title: "O que você recebe em cada projeto",
    items: [
      {
        title: "Contato direto, sem intermediários",
        description:
          "Você fala comigo diretamente do início ao fim do projeto — sem gerente de conta, sem repasse de informação.",
      },
      {
        title: "SEO técnico desde o primeiro commit",
        description:
          "Metadados, Open Graph, sitemap e estrutura semântica fazem parte do site desde o início, não são um adicional de última hora.",
      },
      {
        title: "Stack moderna e sustentável",
        description:
          "React, Next.js e TypeScript: tecnologias amplamente usadas no mercado, fáceis de manter e evoluir no futuro, com qualquer desenvolvedor.",
      },
      {
        title: "Site testado antes da entrega",
        description:
          "Cada projeto é conferido em celular, tablet e desktop antes de ir ao ar — não só no meu monitor.",
      },
    ],
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
    ctaText: "Não sabe qual serviço encaixa no seu projeto? Fale comigo",
    ctaLink: "#contact",
  },
  about: {
    eyebrow: "Sobre mim",
    title: "Igor Lima Teixeira — Front-End Developer",
    lead: "Sou Front-End Developer focado em construir interfaces web modernas, responsivas e com boa performance.",
    paragraphs: [
      "Trabalho principalmente com React, Next.js e TypeScript, unindo qualidade visual, código organizado e atenção à experiência do usuário em cada projeto.",
      "Já desenvolvi sites institucionais para negócios reais, sempre buscando equilíbrio entre design, velocidade de carregamento e facilidade de manutenção.",
    ],
    principlesLabel: "Como eu trabalho",
    principles: [
      "Comunicação direta pelo WhatsApp, do orçamento à entrega.",
      "Site publicado e testado em diferentes telas antes da entrega final.",
      "Código organizado, pensado para ser mantido e ampliado depois.",
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
    email: "igorlimateixeira10@gmail.com",
    whatsapp: "+55 (27) 99653-0514",
    whatsappMessage: "Olá! Vim pelo portfólio e gostaria de conversar sobre um projeto.",
    linkedin: "linkedin.com/in/igor-teixeira-4055232b8",
  },
  footer: {
    tagline: "Front-End Developer",
    rights: "Todos os direitos reservados.",
  },
};
