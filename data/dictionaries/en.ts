import type { Dictionary } from "@/data/dictionaries/pt";

export const en: Dictionary = {
  meta: {
    title: "Igor Lima | Front-End Developer",
    description:
      "Front-End Developer specialized in React, Next.js and TypeScript. I build professional websites, landing pages and web applications for businesses in Brazil and abroad.",
  },
  nav: {
    home: "Home",
    projects: "Projects",
    services: "Services",
    about: "About",
    contact: "Contact",
    cta: "Request a quote",
  },
  hero: {
    eyebrow: "Front-End Developer",
    title: "Professional websites and modern web applications for companies and brands.",
    subtitle:
      "I build institutional websites, landing pages and web systems with React, Next.js and TypeScript — fast, responsive and ready to represent your business online.",
    ctaPrimary: "View projects",
    ctaSecondary: "Request a quote",
    availability: "Available for new projects",
  },
  techStack: {
    eyebrow: "Stack",
    title: "Technologies I use day to day",
  },
  projects: {
    eyebrow: "Work",
    title: "Featured projects",
    subtitle:
      "Real institutional websites, built and shipped for businesses across different industries.",
    viewProject: "View project",
    viewCode: "View code",
    otherProjects: "More technical projects on GitHub",
    items: {
      "site-leo": {
        name: "Leonardo Pessanha — Psychologist",
        category: "Institutional website",
        description:
          "Institutional website for a clinical psychologist based in Serra, Brazil, with a blog, WhatsApp booking and full technical SEO.",
      },
      clickcola: {
        name: "Click Cola Instalações",
        category: "Institutional website",
        description:
          "Institutional website for a flooring installation company in Colatina, Brazil, with a project gallery and a WhatsApp booking assistant.",
      },
      refriar: {
        name: "Refriar",
        category: "Institutional website",
        description:
          "Institutional website for an air conditioning and technical support company, with a quote form integrated with WhatsApp.",
      },
    },
  },
  cases: {
    eyebrow: "Cases",
    title: "How each project was solved",
    labels: {
      objective: "Objective",
      tech: "Technologies",
      solution: "Solution",
      result: "Result",
    },
    items: {
      "site-leo": {
        objective:
          "Give a clinical psychologist a professional online presence and make it easy to book sessions without relying only on social media.",
        solution:
          "A Next.js site with an institutional blog, approach and testimonials sections, and booking buttons that open WhatsApp with a ready-made message.",
        result:
          "Site published and live, with technical SEO in place (metadata, sitemap and Open Graph) for search engine indexing.",
      },
      clickcola: {
        objective:
          "Showcase a flooring installation company's portfolio and turn visits into quote requests.",
        solution:
          "A Next.js site with a gallery of 35+ real project photos and a virtual assistant that guides visitors toward a WhatsApp quote request.",
        result: "Site published and live, with a working direct WhatsApp contact channel.",
      },
      refriar: {
        objective:
          "Create a simple institutional page for an air conditioning and technical support company, with an easy way to request a quote.",
        solution:
          "A static HTML, CSS and JavaScript site with a form that automatically builds a quote message and opens the company's WhatsApp.",
        result: "Site published and live, ready to generate business contacts.",
      },
    },
  },
  services: {
    eyebrow: "Services",
    title: "Services",
    subtitle: "What's included in each type of project.",
    items: [
      {
        title: "Professional website",
        description:
          "A tailor-made site for your business, with responsive design, technical SEO best practices and a structure built to convey credibility.",
      },
      {
        title: "Landing Page",
        description:
          "A single, conversion-focused page to promote a specific product, service or campaign, with clear calls to action.",
      },
      {
        title: "Institutional website",
        description:
          "A multi-section site (about, services, testimonials, contact) to present your company or work in full.",
      },
      {
        title: "E-commerce",
        description:
          "Product showcases and online catalogs, structured to grow into a complete purchase flow.",
      },
      {
        title: "Web Applications",
        description:
          "Web systems built with React/Next.js and TypeScript — forms, dashboards and internal tools built to spec.",
      },
      {
        title: "Maintenance & improvements",
        description:
          "Fixes and improvements to existing websites: performance, responsiveness, SEO or new features.",
      },
    ],
  },
  about: {
    eyebrow: "About me",
    title: "Igor Lima — Front-End Developer",
    paragraphs: [
      "I'm a Front-End Developer focused on building modern, responsive and high-performing web interfaces.",
      "I work mainly with React, Next.js and TypeScript, combining visual quality, clean code and attention to user experience in every project.",
      "I've built institutional websites for real businesses, always aiming for a balance between design, load speed and long-term maintainability.",
    ],
  },
  process: {
    eyebrow: "Process",
    title: "How it works",
    steps: [
      {
        number: "01",
        title: "Understanding",
        description:
          "I get to know your business, your audience and the site's goal before writing a single line of code.",
      },
      {
        number: "02",
        title: "Planning",
        description: "I plan the page structure, the content needed and the navigation flow.",
      },
      {
        number: "03",
        title: "Development",
        description:
          "I build the site with React/Next.js, taking care of responsiveness, performance and technical SEO from the start.",
      },
      {
        number: "04",
        title: "Review",
        description: "I review the site across different screen sizes and browsers before launch.",
      },
      {
        number: "05",
        title: "Launch",
        description:
          "I publish the site and hand it over ready to use, with guidance on requesting future changes.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's build your next project?",
    subtitle:
      "Tell me a bit about your idea or business — I'll get back to you with the next steps to bring your project to life.",
    form: {
      name: "Name",
      email: "Email",
      company: "Company",
      companyOptional: "optional",
      projectType: "Project type",
      projectTypeOptions: [
        "Professional website",
        "Landing Page",
        "Institutional website",
        "E-commerce",
        "Web Application",
        "Other",
      ],
      message: "Message",
      submit: "Send message",
      note: "Sending this will open your default email app with the message ready to send.",
    },
    directTitle: "Or reach out directly",
    email: "youremail@example.com",
    whatsapp: "+55 (00) 00000-0000",
    linkedin: "linkedin.com/in/igor-teixeira-4055232b8",
    placeholder: "coming soon",
  },
  footer: {
    tagline: "Front-End Developer",
    rights: "All rights reserved.",
  },
};
