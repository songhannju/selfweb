import SoftAurora from './components/SoftAurora';

const skills = ['C#', 'Python', 'SQL', 'TypeScript', '.NET / .NET Core', 'System Design', 'Distributed Systems', 'Message Queues', 'Model Serving', 'Inference Optimization', 'Kubernetes', 'LLM Systems', 'Docker', 'CI/CD'];

const projects = [
  {
    type: 'Enterprise Platform',
    title: 'Payments & Settlement System',
    description: 'Backend services for high-stakes payment and settlement flows, with transaction integrity and dependable integrations across systems.',
    stack: 'C# · .NET · SQL · APIs',
  },
  {
    type: 'Business Workflow',
    title: 'Operations Automation Platform',
    description: 'Internal tooling that reduced manual coordination, improved operational visibility, and brought consistency to repetitive workflows.',
    stack: '.NET · Web APIs · DB · CI/CD',
  },
  {
    type: 'AI Infrastructure',
    title: 'LLM Serving Exploration',
    description: 'Model service patterns, deployment pipelines, and observability strategies for stable, production-ready AI capabilities.',
    stack: 'Python · Docker · Kubernetes · LLM APIs',
  },
];

export default function App() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#f3efe9] text-[#171717]">
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-[#f3efe9]/75 backdrop-blur-xl">
        <nav className="mx-auto flex min-h-18 w-[min(1080px,calc(100%-48px))] items-center justify-between">
          <a className="grid size-11 place-items-center rounded-full border border-black/10 bg-white/60 font-semibold tracking-[-0.08em] shadow-sm" href="#home" aria-label="Han Song home">HS</a>
          <div className="hidden items-center gap-7 text-[0.78rem] uppercase tracking-[0.14em] text-[#5f5a56] md:flex">
            {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => <a className="transition-colors hover:text-[#2f5d54]" href={`#${item.toLowerCase()}`} key={item}>{item}</a>)}
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden">
          <SoftAurora />
          <div className="relative mx-auto grid min-h-[calc(100svh-72px)] w-[min(1080px,calc(100%-48px))] items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#2f5d54]">Backend Engineer · AI Infrastructure Explorer</p>
              <h1 className="max-w-xl font-serif text-[clamp(3.5rem,8vw,6.7rem)] leading-[0.94] tracking-[-0.075em]">Han Song</h1>
              <p className="mt-7 max-w-xl text-xl leading-8 text-[#1d403a]">Building reliable systems for the AI era.</p>
              <p className="mt-5 max-w-xl text-[1.05rem] leading-8 text-[#5f5a56]">I design dependable backend systems and bring that engineering discipline into AI infrastructure, model serving, and production-ready intelligent platforms.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a className="rounded-full bg-[#2f5d54] px-5 py-3 font-semibold text-[#f7faf7] shadow-[0_14px_30px_rgba(47,93,84,0.18)] transition-transform hover:-translate-y-0.5" href="#projects">View Projects</a>
                <a className="rounded-full border border-black/10 bg-white/30 px-5 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-white/60" href="/resume.txt" download>Download Resume</a>
              </div>
            </div>

            <div className="relative mx-auto h-[31rem] w-full max-w-md">
              <div className="absolute left-2 top-10 rounded-2xl border border-black/10 bg-white/70 p-4 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1"><span className="block text-[0.65rem] uppercase tracking-[0.14em] text-[#5f5a56]">System Design</span><strong className="mt-1 block">High-availability APIs</strong></div>
              <div className="absolute right-0 top-28 rounded-2xl border border-black/10 bg-white/70 p-4 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1"><span className="block text-[0.65rem] uppercase tracking-[0.14em] text-[#5f5a56]">Data Flow</span><strong className="mt-1 block">Reliable processing</strong></div>
              <div className="absolute bottom-12 left-20 rounded-2xl border border-black/10 bg-white/70 p-4 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1"><span className="block text-[0.65rem] uppercase tracking-[0.14em] text-[#5f5a56]">AI Infra</span><strong className="mt-1 block">Serving + orchestration</strong></div>
              <div className="absolute inset-x-16 bottom-10 top-20 grid place-items-center rounded-[2.25rem] border border-black/10 bg-white/50 shadow-[0_35px_80px_rgba(23,23,23,0.1)] backdrop-blur-sm"><span className="font-serif text-8xl tracking-[-0.1em] text-[#2f5d54]">HS</span></div>
            </div>
          </div>
        </section>

        <section id="about" className="border-t border-black/[0.05] py-24">
          <div className="mx-auto w-[min(820px,calc(100%-48px))]">
            <SectionHeading eyebrow="About" title="Engineering systems that are dependable, scalable, and useful." />
            <div className="grid gap-10 md:grid-cols-[1.6fr_0.7fr]">
              <div className="space-y-5 text-[#5f5a56]"><p>I’m a backend engineer with a strong foundation in C# and .NET, building enterprise systems that prioritize maintainability, performance, and operational resilience.</p><p>My work spans service design, system integration, workflow automation, and business-critical data flows. I enjoy solving the hard problems behind reliable products: consistency, scale, observability, and systems that stay stable under real-world pressure.</p><p>I’m now expanding into AI infrastructure, especially model serving, inference optimization, and the engineering foundations that help AI capabilities move from experiments into durable, production-ready systems.</p></div>
              <aside className="h-fit rounded-2xl border border-black/10 bg-white/55 p-5 text-sm leading-7 text-[#5f5a56] shadow-sm"><p><strong className="text-[#171717]">Location:</strong> China</p><p><strong className="text-[#171717]">Focus:</strong> Backend Engineering, AI Infrastructure</p><p><strong className="text-[#171717]">Looking for:</strong> AI Infrastructure Engineer opportunities</p></aside>
            </div>
          </div>
        </section>

        <section id="skills" className="border-t border-black/[0.05] py-24"><div className="mx-auto w-[min(820px,calc(100%-48px))]"><SectionHeading eyebrow="Skills" title="Core strengths and growing expertise." /><div className="flex flex-wrap gap-2.5">{skills.map((skill) => <span className="rounded-full border border-black/10 bg-white/45 px-4 py-2 text-sm text-[#3c3a38] transition hover:-translate-y-0.5 hover:border-[#2f5d54]/25 hover:bg-[#edf4f1]" key={skill}>{skill}</span>)}</div></div></section>

        <section id="projects" className="border-t border-black/[0.05] py-24"><div className="mx-auto w-[min(1080px,calc(100%-48px))]"><SectionHeading eyebrow="Projects" title="Selected work and technical experiments." /><div className="grid gap-5 md:grid-cols-3">{projects.map((project) => <article className="flex min-h-72 flex-col rounded-3xl border border-black/10 bg-white/60 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl" key={project.title}><p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#2f5d54]">{project.type}</p><h3 className="mt-5 font-serif text-2xl tracking-[-0.035em]">{project.title}</h3><p className="mt-4 flex-1 text-sm leading-7 text-[#5f5a56]">{project.description}</p><p className="mt-6 text-xs font-medium text-[#3c3a38]">{project.stack}</p><a className="mt-5 font-semibold text-[#2f5d54] transition hover:translate-x-1" href="#contact">View Details →</a></article>)}</div></div></section>

        <section id="experience" className="border-t border-black/[0.05] py-24"><div className="mx-auto w-[min(820px,calc(100%-48px))]"><SectionHeading eyebrow="Experience" title="Career timeline." /><div className="space-y-5 border-l border-[#2f5d54]/25 pl-6"><article className="relative rounded-2xl border border-black/10 bg-white/55 p-5 shadow-sm before:absolute before:-left-[2rem] before:top-7 before:size-3 before:rounded-full before:border-2 before:border-[#2f5d54] before:bg-[#f3efe9]"><p className="text-xs uppercase tracking-[0.12em] text-[#5f5a56]">2022 — Present</p><h3 className="mt-2 font-serif text-2xl">Backend Engineer</h3><p className="mt-1 font-semibold text-[#3c3a38]">Enterprise Systems · Product & Platform Engineering</p><p className="mt-3 text-sm leading-7 text-[#5f5a56]">Designed and maintained backend services with a focus on reliability, maintainability, and data integrity across core business operations.</p></article><article className="relative rounded-2xl border border-black/10 bg-white/55 p-5 shadow-sm before:absolute before:-left-[2rem] before:top-7 before:size-3 before:rounded-full before:border-2 before:border-[#2f5d54] before:bg-[#f3efe9]"><p className="text-xs uppercase tracking-[0.12em] text-[#5f5a56]">2020 — 2022</p><h3 className="mt-2 font-serif text-2xl">Software Engineer</h3><p className="mt-1 font-semibold text-[#3c3a38]">Application Development · Business Automation</p><p className="mt-3 text-sm leading-7 text-[#5f5a56]">Built service-oriented applications and internal automation workflows with emphasis on API design and operational efficiency.</p></article></div></div></section>

        <section id="contact" className="border-t border-black/[0.05] py-24"><div className="mx-auto w-[min(820px,calc(100%-48px))]"><SectionHeading eyebrow="Contact" title="Let’s talk about backend engineering and AI infrastructure." /><div className="rounded-3xl border border-black/10 bg-white/60 p-6 shadow-sm"><div className="grid gap-3 text-sm text-[#5f5a56] md:grid-cols-2"><a className="transition hover:text-[#2f5d54]" href="mailto:hello@hansong.dev">hello@hansong.dev</a><a className="transition hover:text-[#2f5d54]" href="https://www.linkedin.com" target="_blank" rel="noreferrer">linkedin.com/in/hansong</a><a className="transition hover:text-[#2f5d54]" href="https://github.com" target="_blank" rel="noreferrer">github.com/hansong</a><span>Shanghai, China</span></div></div></div></section>
      </main>
      <footer className="border-t border-black/[0.06] py-8 text-center text-xs text-[#5f5a56]">© 2026 Han Song. Built with care.</footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title }) {
  return <div className="mb-9 max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#2f5d54]">{eyebrow}</p><h2 className="font-serif text-4xl leading-tight tracking-[-0.045em] md:text-5xl">{title}</h2></div>;
}
