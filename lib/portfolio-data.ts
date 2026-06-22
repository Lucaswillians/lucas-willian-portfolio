export type BillboardSection = {
  id: string
  kind: "intro" | "experience" | "education" | "project" | "outro"
  tag: string
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
    value: "lucaswillian@email.com",
    href: "mailto:lucaswillian@email.com",
    kind: "email",
  },
  {
    label: "Telefone",
    value: "+55 (47) 99999-9999",
    href: "tel:+5547999999999",
    kind: "phone",
  },
  {
    label: "GitHub",
    value: "github.com/lucaswillian",
    href: "https://github.com/lucaswillian",
    kind: "github",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/lucaswillian",
    href: "https://linkedin.com/in/lucaswillian",
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
    tag: "PORTFÓLIO",
    title: "LUCAS WILLIAN",
    subtitle: "Engenheiro de Software · Full-Stack",
    lines: [
      "Bem-vindo à minha estrada.",
      "Construo produtos do front-end",
      "à infraestrutura.",
      "",
      "Use as SETAS do teclado para",
      "dirigir e conhecer minha jornada.",
    ],
    tech: ["TypeScript", "React", "Node.js", "Cloud"],
    accent: CYAN,
    side: "right",
    t: 0.05,
  },
  {
    id: "exp-sizebay",
    kind: "experience",
    tag: "EXPERIÊNCIA · 01",
    title: "Sizebay",
    subtitle: "Desenvolvedor · Joinville/SC · 2023 — 2024",
    lines: [
      "Integração de serviços em sites",
      "utilizando JavaScript e",
      "estilização com HTML e CSS.",
      "Desenvolvimento de Lambdas na",
      "AWS com Node.js.",
    ],
    tech: ["JavaScript", "HTML/CSS", "AWS Lambda", "Node.js"],
    accent: PINK,
    side: "left",
    t: 0.14,
  },
  {
    id: "exp-martinelli",
    kind: "experience",
    tag: "EXPERIÊNCIA · 02",
    title: "Martinelli Labs",
    subtitle: "Desenvolvedor de Software · Joinville/SC · 2024",
    lines: [
      "Desenvolvimento de interfaces",
      "web em React e TypeScript.",
      "Implementação de Design Systems",
      "e consumo de APIs com",
      "React Query.",
    ],
    tech: ["React", "TypeScript", "Design System", "React Query"],
    accent: PINK,
    side: "right",
    t: 0.22,
  },
  {
    id: "exp-freela",
    kind: "experience",
    tag: "EXPERIÊNCIA · 03",
    title: "Freelancer",
    subtitle: "Desenvolvedor Full Stack · 2024 — Atual",
    lines: [
      "APIs e sistemas web com Node.js",
      "e NestJS, usando MySQL e",
      "PostgreSQL.",
      "Autenticação e segurança: JWT,",
      "OAuth, MFA e criptografia.",
    ],
    tech: ["Node.js", "NestJS", "PostgreSQL", "JWT / OAuth"],
    accent: PINK,
    side: "left",
    t: 0.3,
  },
  {
    id: "exp-docspider",
    kind: "experience",
    tag: "EXPERIÊNCIA · 04",
    title: "Docspider",
    subtitle: "Desenvolvedor Full Stack · Joinville/SC · 2025 — Atual",
    lines: [
      "Interfaces web utilizando C#",
      "com o padrão MVC.",
      "Lógica de negócio no back-end,",
      "integrando APIs e camadas de",
      "dados. SQL Server e Oracle.",
    ],
    tech: ["C#", "MVC", "SQL Server", "Oracle"],
    accent: PINK,
    side: "right",
    t: 0.38,
  },
  {
    id: "edu-1",
    kind: "education",
    tag: "FORMAÇÃO · 01",
    title: "Ciência da Computação",
    subtitle: "Bacharelado",
    lines: [
      "Formação com foco em",
      "desenvolvimento de software,",
      "estruturas de dados,",
      "algoritmos e engenharia",
      "de sistemas.",
    ],
    tech: ["Algoritmos", "Estruturas de Dados"],
    accent: YELLOW,
    side: "left",
    t: 0.48,
  },
  {
    id: "edu-2",
    kind: "education",
    tag: "FORMAÇÃO · 02",
    title: "Desenvolvimento Web",
    subtitle: "Especializações & Cursos",
    lines: [
      "Aprofundamento em front-end",
      "moderno, back-end com Node.js",
      "e C#, bancos de dados",
      "relacionais e práticas de",
      "segurança de aplicações.",
    ],
    tech: ["Full Stack", "Cloud", "Segurança"],
    accent: YELLOW,
    side: "right",
    t: 0.57,
  },
  {
    id: "proj-1",
    kind: "project",
    tag: "PROJETO · 01",
    title: "Aurora Dashboard",
    subtitle: "Analytics em tempo real",
    lines: [
      "Visualização de métricas ao",
      "vivo com atualização via",
      "WebSockets e gráficos",
      "interativos em React.",
    ],
    tech: ["Next.js", "WebSockets", "TypeScript"],
    link: "https://github.com/lucaswillian/aurora-dashboard",
    accent: CYAN,
    side: "left",
    t: 0.68,
  },
  {
    id: "proj-2",
    kind: "project",
    tag: "PROJETO · 02",
    title: "PixPay API",
    subtitle: "Gateway de pagamentos",
    lines: [
      "API de processamento de",
      "transações Pix com NestJS,",
      "filas resilientes e",
      "observabilidade completa.",
    ],
    tech: ["NestJS", "PostgreSQL", "Redis"],
    link: "https://github.com/lucaswillian/pixpay-api",
    accent: GREEN,
    side: "right",
    t: 0.78,
  },
  {
    id: "proj-3",
    kind: "project",
    tag: "PROJETO · 03",
    title: "Design System UI",
    subtitle: "Biblioteca de componentes",
    lines: [
      "Design System em React e",
      "TypeScript com componentes",
      "acessíveis, documentação e",
      "consumo de APIs via React Query.",
    ],
    tech: ["React", "TypeScript", "Design System"],
    link: "https://github.com/lucaswillian/design-system-ui",
    accent: PURPLE,
    side: "left",
    t: 0.88,
  },
  {
    id: "outro",
    kind: "outro",
    tag: "FIM DA ESTRADA",
    title: "Obrigado pela viagem!",
    subtitle: "Vamos construir algo juntos?",
    lines: [
      "Estou aberto a novos desafios.",
      "",
      "Use os botões abaixo para",
      "entrar em contato comigo.",
    ],
    tech: ["Disponível para projetos"],
    accent: CYAN,
    side: "right",
    t: 0.97,
  },
]
