# Igor Lima — Portfólio

Portfólio profissional de Igor Lima, Front-End Developer, com apresentação em português e inglês, projetos em destaque, serviços oferecidos e formulário de contato.

## Sobre o projeto

Site de vitrine profissional, feito para apresentar os serviços de desenvolvimento front-end a clientes no Brasil e no exterior: sites institucionais, landing pages, aplicações web e e-commerce. Reúne os projetos comerciais reais já entregues, com descrição, tecnologias e link para cada site publicado.

## Principais funcionalidades

- Conteúdo completo em português e inglês, com rotas próprias (`/pt` e `/en`) e metadados de SEO por idioma.
- Seção de projetos em destaque com os cases comerciais reais (nome, categoria, tecnologias, screenshot, link do site e do repositório).
- Seção de cases detalhando objetivo, solução e resultado de cada projeto.
- Seção de serviços, processo de trabalho e apresentação profissional.
- Formulário de contato (sem backend): monta a mensagem e abre o e-mail padrão do visitante pronto para envio.
- SEO técnico: metadados, Open Graph, `sitemap.xml`, `robots.txt` e favicon gerado dinamicamente.

## Tecnologias

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Design e responsividade

Layout construído mobile-first com Tailwind CSS, testado em larguras de celular (390px) e desktop (1440px). Menu de navegação colapsa para um menu mobile abaixo de 768px. Sem bibliotecas de animação: as transições de entrada são feitas em CSS puro.

## Deploy

Site publicado em: https://portfolio-igorlima-pi.vercel.app

## Desenvolvimento

```bash
npm install
npm run dev
```

Defina a variável de ambiente `NEXT_PUBLIC_SITE_URL` com a URL final de produção antes do deploy, para os metadados de SEO (Open Graph, sitemap) apontarem para o domínio correto.

---

## English

# Igor Lima — Portfolio

Professional portfolio for Igor Lima, Front-End Developer, presented in Portuguese and English, with featured projects, services offered and a contact form.

### About the project

A professional showcase site built to present front-end development services to clients in Brazil and abroad: institutional websites, landing pages, web applications and e-commerce. It brings together the real commercial projects already delivered, with description, technologies and a link to each live site.

### Key features

- Full content in Portuguese and English, with dedicated routes (`/pt` and `/en`) and per-language SEO metadata.
- Featured projects section with real commercial cases (name, category, technologies, screenshot, live link and repository link).
- Case studies detailing the objective, solution and result of each project.
- Services, work process and professional bio sections.
- Contact form (no backend): builds the message and opens the visitor's default email app ready to send.
- Technical SEO: metadata, Open Graph, `sitemap.xml`, `robots.txt` and a dynamically generated favicon.

### Technologies

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

### Design and responsiveness

Built mobile-first with Tailwind CSS, tested at phone (390px) and desktop (1440px) widths. The navigation collapses into a mobile menu below 768px. No animation libraries: entrance transitions are done in plain CSS.

### Deployment

Live at: https://portfolio-igorlima-pi.vercel.app

### Development

```bash
npm install
npm run dev
```

Set the `NEXT_PUBLIC_SITE_URL` environment variable to the final production URL before deploying, so SEO metadata (Open Graph, sitemap) points to the right domain.
