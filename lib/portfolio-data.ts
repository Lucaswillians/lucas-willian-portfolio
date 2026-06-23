export type BillboardSection = {
  id: string
  kind: "intro" | "experience" | "education" | "project" | "outro"
  tag?: string
  title: string
  subtitle?: string
  lines: string[]
  tech?: string[] // tecnologias / palavras-chave exibidas no rodapé da placa
  link?: string // link do projeto (abre em nova aba)
  accent: string // neon color
  side: "left" | "right"
  t: number // position along the road curve (0..1)
}

export type Contact = {
  label: string
  value: string
  href: string
  kind: "email" | "phone" | "github" | "linkedin"
}

// Contatos exibidos no fim da estrada (edite com seus dados reais).
export const CONTACTS: Contact[] = [
  {
    label: "E-mail",
    value: "lucaswilianserpa@gmail.com",
    href: "mailto:lucaswilianserpa@gmail.com",
    kind: "email",
  },
  {
    label: "Telefone",
    value: "+55 (47) 99283-1500",
    href: "tel:+5547992831500",
    kind: "phone",
  },
  {
    label: "GitHub",
    value: "github.com/lucas-willian",
    href: "https://github.com/Lucaswillians",
    kind: "github",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/lucaswillian",
    href: "https://www.linkedin.com/in/lucas-willian-22a437240/",
    kind: "linkedin",
  },
]

// Neon palette
const PINK = "#ff2d95"
const CYAN = "#00f0ff"
const PURPLE = "#b14aff"
const YELLOW = "#ffd23f"
const GREEN = "#22ff9c"

export const SECTIONS: BillboardSection[] = [
  {
    id: "intro",
    kind: "intro",
    title: "LUCAS WILLIAN",
    subtitle: "Engenheiro de Software · Full Stack",
    lines: [
      "Engenheiro de Software, atuando principalmente com Node.js e react.js na construção de sistemas escaláveis, seguras e de alta performance. Experiência com bancos de dados relacionais e não relacionais, autenticação, integração com serviços externos e boas práticas de engenharia com arquitetura SOLID. Fique a vontade para explorar meu portfólio e conhecer meus projetos, experiências e habilidades.",
      "",
      "Boa viagem!"
    ],
    tech: ["TypeScript", "Node.js", "NestJS", "React", "Python"],
    accent: CYAN,
    side: "right",
    t: 0.05,
  },

  {
    id: "exp-sizebay",
    kind: "experience",
    title: "Sizebay",
    subtitle: "Desenvolvedor · Joinville/SC · 2023 — 2024",
    lines: [
      "Integração de serviços e widgets em plataformas de e-commerce utilizando JavaScript, HTML e CSS. Desenvolvimento e manutenção de AWS Lambda com Node.js, aplicando boas práticas de back-end como manipulação de dados, criação de rotinas assíncronas, consumo de APIs externas e automação de processos. Atuação em correção de bugs, otimização de performance e suporte a integrações com clientes e sistemas parceiros.",
    ],
    tech: ["JavaScript", "HTML/CSS", "AWS Lambda", "Node.js"],
    accent: PINK,
    side: "left",
    t: 0.14,
  },

  {
    id: "exp-martinelli",
    kind: "experience",
    title: "Martinelli Labs",
    subtitle: "Desenvolvedor de Software · Joinville/SC · 2024",
    lines: [
      "Desenvolvimento de interfaces web em React e TypeScript com foco em performance e escalabilidade. Criação e manutenção de Design Systems, componentes reutilizáveis e integração com APIs REST utilizando React Query para gerenciamento de estado e cache de dados. Implementação de boas práticas de front-end como componentização, reutilização de lógica, otimização de renderização e organização de arquitetura de UI. Participação na evolução de produtos digitais com foco em UX, performance e manutenibilidade.",
    ],
    tech: ["React", "TypeScript", "Design System", "React Query"],
    accent: PINK,
    side: "right",
    t: 0.22,
  },

  {
    id: "exp-freela",
    kind: "experience",
    title: "Freelancer",
    subtitle: "Desenvolvedor Full Stack · 2024 — Atual",
    lines: [
      "Desenvolvimento de APIs REST com Node.js e NestJS, focado em arquitetura limpa, segurança e boas práticas de back-end. Implementação de autenticação e autorização com JWT, OAuth e MFA, além de criptografia e controle de acesso. Modelagem de bancos de dados (PostgreSQL e MySQL), integrações com serviços externos e automações com web scraping e processamento de dados. Desenvolvimento de interfaces com React e Next.js integradas às APIs.",
    ],
    tech: ["Node.js", "NestJS", "PostgreSQL", "Python"],
    accent: PINK,
    side: "left",
    t: 0.3,
  },

  {
    id: "exp-docspider",
    kind: "experience",
    title: "Docspider",
    subtitle: "Desenvolvedor Full Stack · Joinville/SC · 2025 — Atual",
    lines: [
      "Desenvolvimento de aplicações web utilizando C# com padrão MVC, atuando em regras de negócio, manutenção de módulos corporativos e features. Foco em consistência de dados e comunicação entre serviços do próprio ecossistema. Criação e otimização de queries em SQL Server e Oracle, com atenção a performance, modelagem de dados e confiabilidade, além de suporte à manutenção e evolução de sistemas legados.",
    ],
    tech: ["C#", "MVC", "JavaScript", "ASP"],
    accent: PINK,
    side: "right",
    t: 0.38,
  },

  {
    id: "edu-1",
    kind: "education",
    title: "Engenharia de Software",
    subtitle: "Bacharelado",
    lines: [
      "Formação com foco em engenharia de software, incluindo estruturas de dados, algoritmos, matemática computacional, inteligência artificial, arquitetura de sistemas, engenharia de requisitos, modelagem de software (UML), bancos de dados, padrões de projeto e desenvolvimento de sistemas com base em fundamentos teóricos e práticos para construção de soluções computacionais escaláveis."
    ],
    tech: ["Algoritmos", "Estruturas de Dados", "IA"],
    accent: YELLOW,
    side: "left",
    t: 0.48,
  },

  {
    id: "edu-2",
    kind: "education",
    title: "Back-end (NestJS / APIs)",
    subtitle: "Estudos e Especializações",
    lines: [
      "Estudos em desenvolvimento back-end com foco em arquitetura de software e APIs escaláveis, utilizando NestJS, Node.js, PostgreSQL e TypeORM. Experiência com modelagem de dados, migrations, autenticação com JWT, criptografia com Bcrypt, cache com Redis, mensageria, logging e monitoramento de aplicações. Uso de Docker para padronização de ambientes, além de práticas de segurança, performance, SOLID e padrões de projeto aplicados em sistemas reais."
    ],
    tech: ["NestJS", "PostgreSQL", "Redis", "Docker"],
    accent: YELLOW,
    side: "right",
    t: 0.57,
  },

  {
    id: "proj-1",
    kind: "project",
    title: "Vanguard - Backend",
    subtitle: "API de gestão e planejamento de viagens",
    lines: [
      "API responsável por regras críticas de negócio como controle financeiro, autenticação, segurança, gestão de viagens e cálculos de remuneração. Desenvolvida com NestJS, TypeORM e MySQL, utilizando arquitetura modular e boas práticas de engenharia de software. Implementação de autenticação JWT, 2FA, bcrypt e reCAPTCHA, além de proteção de rotas e controle de acesso. Integração com APIs externas para suporte a funcionalidades do sistema, uso de Docker para padronização do ambiente, CI/CD, e monitoramento de logs e qualidade de código com SonarCloud."
    ],
    tech: ["NestJS", "MySQL", "CI/CD", "Segurança"],
    link: "https://github.com/Lucaswillians/vanguard-back-end",
    accent: GREEN,
    side: "right",
    t: 0.65,
  },

  {
    id: "proj-2",
    kind: "project",
    title: "Vanguard - Frontend",
    subtitle: "Sistema de gestão de viagens e turismo",
    lines: [
      "Frontend do sistema Vanguard desenvolvido com React, TypeScript, Tailwind CSS e shadcn/ui, consumindo APIs do backend e seguindo arquitetura orientada a componentes. Utilização de React Query para gerenciamento de estado, cache e sincronização de dados em tempo real. Foco em performance, responsividade e experiência do usuário na gestão de viagens, motoristas, orçamentos e processos financeiros, com interfaces modernas e bem estruturadas."
    ],
    tech: ["React", "TypeScript", "Tailwind", "CI/CD"],
    link: "https://github.com/Lucaswillians/vanguard-front-end",
    accent: PURPLE,
    side: "left",
    t: 0.75,
  },

  {
    id: "proj-3",
    kind: "project",
    title: "Payflow API",
    subtitle: "Sistema de transferências financeiras",
    lines: [
      "API de pagamentos desenvolvida com NestJS e MySQL para transferências entre usuários e lojistas, com validação de saldo, transações atômicas e consistência de dados. Implementação de autenticação com bcrypt, controle de acesso e segurança das operações financeiras. Uso de Redis para cache e otimização de performance, além de integração com serviços externos para autorização e notificações. Arquitetura baseada em boas práticas como SOLID e Event Sourcing, visando escalabilidade e confiabilidade do sistema."
    ],
    tech: ["NestJS", "Redis", "Docker"],
    link: "https://github.com/Lucaswillians/payflow",
    accent: PURPLE,
    side: "right",
    t: 0.85,
  },

  {
    id: "outro",
    kind: "outro",
    title: "Obrigado pela visita!",
    subtitle: "Vamos construir algo juntos?",
    lines: [
      "Sou movido por desafios em engenharia de software, com foco em construção de sistemas escaláveis, APIs de alta performance e aplicações web modernas. Atuo principalmente com desenvolvimento full stack utilizando Node.js, NestJS, React e Next.js, sempre buscando boas práticas, arquitetura limpa e soluções eficientes. Acredito em código bem estruturado, segurança, performance e evolução contínua de sistemas em produção.",
      "Para contato, basta se aproximar :D"
    ],
    tech: ["Desenvolvimento de Software"],
    accent: CYAN,
    side: "left",
    t: 0.95,
  },
];