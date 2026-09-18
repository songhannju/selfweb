import { useEffect, useState } from 'react';
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
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const revealItems = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${isRevealed ? 'min-h-screen' : 'h-screen overflow-hidden'} overflow-x-clip bg-[#0d1110] text-[#e8ece8]`}>
      <GlassReveal isRevealed={isRevealed} onReveal={() => setIsRevealed(true)} />
      <ScrollProgress />
      <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#0d1110]/80 backdrop-blur-xl">
        <nav className="mx-auto flex min-h-18 w-[min(1080px,calc(100%-48px))] items-center justify-between">
          <a className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] font-semibold tracking-[-0.08em] shadow-sm" href="#home" aria-label="Han Song home">HS</a>
          <div className="hidden items-center gap-7 text-[0.78rem] uppercase tracking-[0.14em] text-[#8d9890] md:flex">
            {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map((item) => <a className="transition-colors hover:text-[#8fc2af]" href={`#${item.toLowerCase()}`} key={item}>{item}</a>)}
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden">
          <SoftAurora />
          <div className="relative mx-auto grid min-h-[calc(100svh-72px)] w-[min(1080px,calc(100%-48px))] items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="hero-copy max-w-2xl">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#8fc2af]">Backend Engineer · AI Infrastructure Explorer</p>
              <h1 className="max-w-xl font-serif text-[clamp(3.5rem,8vw,6.7rem)] leading-[0.94] tracking-[-0.075em]">Han Song</h1>
              <p className="mt-7 max-w-xl text-xl leading-8 text-[#b4d6c7]">Building reliable systems for the AI era.</p>
              <p className="mt-5 max-w-xl text-[1.05rem] leading-8 text-[#9aa59d]">I design dependable backend systems and bring that engineering discipline into AI infrastructure, model serving, and production-ready intelligent platforms.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a className="rounded-full bg-[#4e8f78] px-5 py-3 font-semibold text-[#07100c] shadow-[0_14px_30px_rgba(78,143,120,0.2)] transition-transform hover:-translate-y-0.5" href="#projects">View Projects</a>
                <a className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 font-semibold text-[#dfe7e1] transition hover:-translate-y-0.5 hover:bg-white/[0.12]" href="/resume.txt" download>Download Resume</a>
              </div>
            </div>

            <div className="relative mx-auto h-[31rem] w-full max-w-md">
              <div className="absolute left-2 top-10 rounded-2xl border border-white/10 bg-[#17201c]/80 p-4 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1"><span className="block text-[0.65rem] uppercase tracking-[0.14em] text-[#8d9890]">System Design</span><strong className="mt-1 block">High-availability APIs</strong></div>
              <div className="absolute right-0 top-28 rounded-2xl border border-white/10 bg-[#17201c]/80 p-4 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1"><span className="block text-[0.65rem] uppercase tracking-[0.14em] text-[#8d9890]">Data Flow</span><strong className="mt-1 block">Reliable processing</strong></div>
              <div className="absolute bottom-12 left-20 rounded-2xl border border-white/10 bg-[#17201c]/80 p-4 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1"><span className="block text-[0.65rem] uppercase tracking-[0.14em] text-[#8d9890]">AI Infra</span><strong className="mt-1 block">Serving + orchestration</strong></div>
              <div className="absolute inset-x-16 bottom-10 top-20 grid place-items-center rounded-[2.25rem] border border-white/10 bg-white/[0.04] shadow-[0_35px_80px_rgba(0,0,0,0.32)] backdrop-blur-sm"><span className="font-serif text-8xl tracking-[-0.1em] text-[#8fc2af]">HS</span></div>
            </div>
          </div>
        </section>

        <section id="about" data-reveal className="reveal-section border-t border-white/[0.07] py-24">
          <div className="mx-auto w-[min(820px,calc(100%-48px))]">
            <SectionHeading eyebrow="About" title="Engineering systems that are dependable, scalable, and useful." />
            <div className="grid gap-10 md:grid-cols-[1.6fr_0.7fr]">
              <div className="space-y-5 text-[#9aa59d]"><p>I’m a backend engineer with a strong foundation in C# and .NET, building enterprise systems that prioritize maintainability, performance, and operational resilience.</p><p>My work spans service design, system integration, workflow automation, and business-critical data flows. I enjoy solving the hard problems behind reliable products: consistency, scale, observability, and systems that stay stable under real-world pressure.</p><p>I’m now expanding into AI infrastructure, especially model serving, inference optimization, and the engineering foundations that help AI capabilities move from experiments into durable, production-ready systems.</p></div>
              <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-sm leading-7 text-[#9aa59d] shadow-sm"><p><strong className="text-[#e8ece8]">Location:</strong> China</p><p><strong className="text-[#e8ece8]">Focus:</strong> Backend Engineering, AI Infrastructure</p><p><strong className="text-[#e8ece8]">Looking for:</strong> AI Infrastructure Engineer opportunities</p></aside>
            </div>
          </div>
        </section>

        <section id="skills" data-reveal className="reveal-section border-t border-white/[0.07] py-24"><div className="mx-auto w-[min(820px,calc(100%-48px))]"><SectionHeading eyebrow="Skills" title="Core strengths and growing expertise." /><div className="flex flex-wrap gap-2.5">{skills.map((skill, index) => <span className="skill-pill rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-[#c2cbc4] transition hover:-translate-y-0.5 hover:border-[#8fc2af]/30 hover:bg-[#8fc2af]/10" style={{ '--delay': `${index * 35}ms` }} key={skill}>{skill}</span>)}</div></div></section>

        <section id="projects" data-reveal className="reveal-section border-t border-white/[0.07] py-24"><div className="mx-auto w-[min(1080px,calc(100%-48px))]"><SectionHeading eyebrow="Projects" title="Selected work and technical experiments." /><div className="grid gap-5 md:grid-cols-3">{projects.map((project, index) => <article className="project-card flex min-h-72 flex-col rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#8fc2af]/20 hover:bg-white/[0.08] hover:shadow-xl" style={{ '--delay': `${index * 90}ms` }} key={project.title}><p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#8fc2af]">{project.type}</p><h3 className="mt-5 font-serif text-2xl tracking-[-0.035em]">{project.title}</h3><p className="mt-4 flex-1 text-sm leading-7 text-[#9aa59d]">{project.description}</p><p className="mt-6 text-xs font-medium text-[#c2cbc4]">{project.stack}</p><a className="mt-5 font-semibold text-[#8fc2af] transition hover:translate-x-1" href="#contact">View Details →</a></article>)}</div></div></section>

        <section id="experience" data-reveal className="reveal-section border-t border-white/[0.07] py-24"><div className="mx-auto w-[min(820px,calc(100%-48px))]"><SectionHeading eyebrow="Experience" title="Career timeline." /><div className="space-y-5 border-l border-[#8fc2af]/25 pl-6"><article className="timeline-card relative rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-sm before:absolute before:-left-[2rem] before:top-7 before:size-3 before:rounded-full before:border-2 before:border-[#8fc2af] before:bg-[#0d1110]"><p className="text-xs uppercase tracking-[0.12em] text-[#8d9890]">2022 — Present</p><h3 className="mt-2 font-serif text-2xl">Backend Engineer</h3><p className="mt-1 font-semibold text-[#c2cbc4]">Enterprise Systems · Product & Platform Engineering</p><p className="mt-3 text-sm leading-7 text-[#9aa59d]">Designed and maintained backend services with a focus on reliability, maintainability, and data integrity across core business operations.</p></article><article className="timeline-card relative rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-sm before:absolute before:-left-[2rem] before:top-7 before:size-3 before:rounded-full before:border-2 before:border-[#8fc2af] before:bg-[#0d1110]"><p className="text-xs uppercase tracking-[0.12em] text-[#8d9890]">2020 — 2022</p><h3 className="mt-2 font-serif text-2xl">Software Engineer</h3><p className="mt-1 font-semibold text-[#c2cbc4]">Application Development · Business Automation</p><p className="mt-3 text-sm leading-7 text-[#9aa59d]">Built service-oriented applications and internal automation workflows with emphasis on API design and operational efficiency.</p></article></div></div></section>

        <section id="contact" data-reveal className="reveal-section border-t border-white/[0.07] py-24"><div className="mx-auto w-[min(820px,calc(100%-48px))]"><SectionHeading eyebrow="Contact" title="Let’s talk about backend engineering and AI infrastructure." /><div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-sm"><div className="grid gap-3 text-sm text-[#9aa59d] md:grid-cols-2"><a className="transition hover:text-[#8fc2af]" href="mailto:hello@hansong.dev">hello@hansong.dev</a><a className="transition hover:text-[#8fc2af]" href="https://www.linkedin.com" target="_blank" rel="noreferrer">linkedin.com/in/hansong</a><a className="transition hover:text-[#8fc2af]" href="https://github.com" target="_blank" rel="noreferrer">github.com/hansong</a><span>Shanghai, China</span></div></div></div></section>
      </main>
      <footer className="border-t border-white/[0.07] py-8 text-center text-xs text-[#8d9890]">© 2026 Han Song. Built with care.</footer>
    </div>
  );
}

function ScrollProgress() {
  useEffect(() => {
    const progress = document.querySelector('[data-scroll-progress]');
    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      progress.style.width = `${scrollPercent}%`;
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return <div data-scroll-progress className="fixed left-0 top-0 z-[60] h-0.5 w-0 bg-[#8fc2af] shadow-[0_0_16px_rgba(143,194,175,0.6)] transition-[width] duration-100" aria-hidden="true" />;
}

function GlassReveal({ isRevealed, onReveal }) {
  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#b9cec2]/[0.08] backdrop-blur-[30px] transition-[opacity,backdrop-filter] duration-1000 ease-out ${isRevealed ? 'pointer-events-none opacity-0 backdrop-blur-0' : 'opacity-100'}`}
      aria-hidden={isRevealed}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(115deg,rgba(230,241,234,0.12)_0%,transparent_38%,rgba(91,130,111,0.08)_100%),url('data:image/svg+xml,%3Csvg viewBox=%220 0 160 160%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.18%22/%3E%3C/svg%3E)]" />
      <button
        className="group relative grid size-48 place-items-center rounded-full border border-white/20 bg-[#17221d]/55 text-center shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl transition duration-500 hover:scale-[1.03] hover:border-[#8fc2af]/50 focus:outline-none focus:ring-2 focus:ring-[#8fc2af]/60"
        type="button"
        onClick={onReveal}
        aria-label="Reveal Han Song portfolio"
      >
        <span className="absolute inset-3 rounded-full border border-white/10 transition duration-700 group-hover:rotate-45 group-hover:scale-90" />
        <span>
          <span className="block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#8fc2af]">Han Song</span>
          <span className="mt-3 block font-serif text-2xl tracking-[-0.04em] text-[#e8ece8]">Enter</span>
          <span className="mt-2 block text-xs text-[#9aa59d]">Click to reveal</span>
        </span>
      </button>
    </div>
  );
}

function SectionHeading({ eyebrow, title }) {
  return <div className="mb-9 max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#8fc2af]">{eyebrow}</p><h2 className="font-serif text-4xl leading-tight tracking-[-0.045em] text-[#e8ece8] md:text-5xl">{title}</h2></div>;
}
