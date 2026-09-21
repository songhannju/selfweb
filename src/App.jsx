import { useEffect, useState } from 'react';
import SoftAurora from './components/SoftAurora';
import Blog from './components/Blog';
import BlogTicker from './components/BlogTicker';

const skills = ['Java', 'C#', 'JavaScript', 'HTML', 'Azure', 'Jira', 'SQL', 'ASP.NET', 'Postman', 'SoapSonar', 'Harness', 'GitHub'];

const experienceHighlights = [
  {
    type: 'Senior Software Engineer · Fiserv Inc.',
    title: 'CashFlow Central platform',
    description: "Designed and shipped payee fraud validation using Fiserv's internal Verify Now service, event-driven email notifications, checkpoint-based subscriber migration with idempotent retries and rollback, and check-clearing-date visibility for small-business users.",
    stack: 'Alpharetta, GA · Dec 2022 – Sep 2026',
  },
  {
    type: 'Senior QA Automation Engineer · Fiserv Inc.',
    title: 'Banking web-services automation',
    description: 'Built SOAP and REST API automation frameworks and automated test suites, reducing bugs 10–25% year over year. Improved defect-tracking efficiency by 50% and validated a security-gateway migration.',
    stack: 'Jan 2021 – Dec 2022',
  },
  {
    type: 'Web Developer · Computer Packages Inc.',
    title: 'Client-server web applications',
    description: 'Developed and maintained ASP.NET MVC applications and migrated disparate data sources into SQL Server through analysis, mapping, conversion testing, and data comparison.',
    stack: 'Rockville, MD · May 2017 – Jun 2018',
  },
];

export default function App() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeView, setActiveView] = useState('resume');
  const [pendingSection, setPendingSection] = useState(null);

  function navigateToSection(sectionId) {
    setActiveView('resume');
    setPendingSection(sectionId);
  }

  useEffect(() => {
    if (activeView !== 'resume' || !pendingSection) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const section = document.getElementById(pendingSection);
      if (section) {
        const top = section.getBoundingClientRect().top + window.scrollY - 88;
        window.history.replaceState(null, '', `#${pendingSection}`);
        window.scrollTo({ top, behavior: 'smooth' });
      }
      setPendingSection(null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeView, pendingSection]);

  useEffect(() => {
    if (activeView === 'blog') window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeView]);

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
  }, [activeView]);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#0d1110] text-[#e8ece8]">
      <GlassReveal isRevealed={isRevealed} onReveal={() => setIsRevealed(true)} />
      <ScrollProgress />
      <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#0d1110]/80 backdrop-blur-xl">
        <nav className="mx-auto flex min-h-18 w-[min(1080px,calc(100%-48px))] items-center justify-between">
          <button className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] font-semibold tracking-[-0.08em] shadow-sm" type="button" onClick={() => navigateToSection('home')} aria-label="Han Song home">HS</button>
          <div className="flex max-w-[calc(100%-60px)] items-center gap-4 overflow-x-auto py-3 text-[0.68rem] uppercase tracking-[0.12em] text-[#8d9890] [scrollbar-width:none] md:gap-7 md:text-[0.78rem] md:tracking-[0.14em]">
            {['About', 'Skills', 'Projects', 'Experience', 'Education', 'Contact'].map((item) => <a className="transition-colors hover:text-[#8fc2af]" href={`#${item.toLowerCase()}`} onClick={(event) => { event.preventDefault(); navigateToSection(item.toLowerCase()); }} key={item}>{item}</a>)}
            <button className={`transition-colors hover:text-[#e8b66b] ${activeView === 'blog' ? 'text-[#e8b66b]' : ''}`} type="button" onClick={() => setActiveView('blog')}>BLOG</button>
          </div>
        </nav>
      </header>

      {activeView === 'blog' ? <Blog onBack={() => setActiveView('resume')} /> : <main>
        <section id="home" className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden">
          <SoftAurora />
          <div className="relative mx-auto grid min-h-[calc(100svh-72px)] w-[min(1080px,calc(100%-48px))] items-center gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="hero-copy max-w-2xl">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[#8fc2af]">Senior .NET Engineer · 8+ Years Experience</p>
              <h1 className="max-w-xl font-serif text-[clamp(3.5rem,8vw,6.7rem)] leading-[0.94] tracking-[-0.075em]">Han Song</h1>
              <p className="mt-7 max-w-xl text-xl leading-8 text-[#b4d6c7]">Building scalable backend systems and cloud-native applications.</p>
              <p className="mt-5 max-w-xl text-[1.05rem] leading-8 text-[#9aa59d]">Senior .NET Engineer with 8+ years of experience designing and building scalable backend systems, distributed services, and cloud-native applications. Deep expertise in C#, ASP.NET Core, REST APIs, Azure Cloud, and CI/CD automation.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a className="rounded-full bg-[#4e8f78] px-5 py-3 font-semibold text-[#07100c] shadow-[0_14px_30px_rgba(78,143,120,0.2)] transition-transform hover:-translate-y-0.5" href="#projects">View Projects</a>
                <a className="rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 font-semibold text-[#dfe7e1] transition hover:-translate-y-0.5 hover:bg-white/[0.12]" href="/resume.txt" download>Download Resume</a>
              </div>
            </div>

            <CapabilitySphere />
          </div>
        </section>

        <section id="about" data-reveal className="reveal-section border-t border-white/[0.07] py-24">
          <div className="mx-auto w-[min(820px,calc(100%-48px))]">
            <SectionHeading eyebrow="Professional Summary" title="Scalable systems, distributed services, and cloud-native applications." />
            <div className="grid gap-10 md:grid-cols-[1.6fr_0.7fr]">
              <div className="space-y-5 text-[#9aa59d]"><p>Senior .NET Engineer with 8+ years of experience designing and building scalable backend systems, distributed services, and cloud-native applications.</p><p>Deep expertise in C#, ASP.NET Core, REST APIs, Azure Cloud, and CI/CD automation.</p><p>Strong track record of improving system reliability, reducing defects, and delivering secure, high-performance enterprise software.</p></div>
              <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-sm leading-7 text-[#9aa59d] shadow-sm"><p><strong className="text-[#e8ece8]">Location:</strong> Alpharetta, Georgia</p><p><strong className="text-[#e8ece8]">Email:</strong> songhannju@gmail.com</p><p><strong className="text-[#e8ece8]">Phone:</strong> (864) 207-2627</p></aside>
            </div>
            <BlogTicker onOpenBlog={() => setActiveView('blog')} />
          </div>
        </section>

        <section id="skills" data-reveal className="reveal-section border-t border-white/[0.07] py-24"><div className="mx-auto w-[min(820px,calc(100%-48px))]"><SectionHeading eyebrow="Skills" title="Languages, technologies, and engineering tools." /><div className="flex flex-wrap gap-2.5">{skills.map((skill, index) => <span className="skill-pill rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-[#c2cbc4] transition hover:-translate-y-0.5 hover:border-[#8fc2af]/30 hover:bg-[#8fc2af]/10" style={{ '--delay': `${index * 35}ms` }} key={skill}>{skill}</span>)}</div></div></section>

        <section id="projects" data-reveal className="reveal-section border-t border-white/[0.07] py-24"><div className="mx-auto w-[min(1080px,calc(100%-48px))]"><SectionHeading eyebrow="Experience Highlights" title="Selected engineering work from the resume." /><div className="grid gap-5 md:grid-cols-3">{experienceHighlights.map((project, index) => <article className="project-card flex min-h-72 flex-col rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#8fc2af]/20 hover:bg-white/[0.08] hover:shadow-xl" style={{ '--delay': `${index * 90}ms` }} key={project.title}><p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#8fc2af]">{project.type}</p><h3 className="mt-5 font-serif text-2xl tracking-[-0.035em]">{project.title}</h3><p className="mt-4 flex-1 text-sm leading-7 text-[#9aa59d]">{project.description}</p><p className="mt-6 text-xs font-medium text-[#c2cbc4]">{project.stack}</p></article>)}</div></div></section>

        <section id="experience" data-reveal className="reveal-section border-t border-white/[0.07] py-24"><div className="mx-auto w-[min(820px,calc(100%-48px))]"><SectionHeading eyebrow="Work Experience" title="A career in enterprise software and quality engineering." /><div className="space-y-5 border-l border-[#8fc2af]/25 pl-6"><article className="timeline-card relative rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-sm before:absolute before:-left-[2rem] before:top-7 before:size-3 before:rounded-full before:border-2 before:border-[#8fc2af] before:bg-[#0d1110]"><p className="text-xs uppercase tracking-[0.12em] text-[#8d9890]">Dec 2022 – Sep 2026 · Alpharetta, GA</p><h3 className="mt-2 font-serif text-2xl">Senior Software Engineer</h3><p className="mt-1 font-semibold text-[#c2cbc4]">Fiserv Inc.</p><p className="mt-3 text-sm leading-7 text-[#9aa59d]">Designed and shipped payee fraud validation, event-driven notifications, a fault-tolerant checkpoint processor migrating over 22,000 subscribers per run, and check-clearing-date visibility across the CashFlow Central platform.</p></article><article className="timeline-card relative rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-sm before:absolute before:-left-[2rem] before:top-7 before:size-3 before:rounded-full before:border-2 before:border-[#8fc2af] before:bg-[#0d1110]"><p className="text-xs uppercase tracking-[0.12em] text-[#8d9890]">Jan 2021 – Dec 2022</p><h3 className="mt-2 font-serif text-2xl">Senior QA Automation Engineer</h3><p className="mt-1 font-semibold text-[#c2cbc4]">Fiserv Inc.</p><p className="mt-3 text-sm leading-7 text-[#9aa59d]">Built banking web-services automation frameworks for SOAP and REST APIs, reducing bugs 10–25% year over year, improving bug-tracking efficiency by 50%, and validating a security-gateway migration.</p></article><article className="timeline-card relative rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-sm before:absolute before:-left-[2rem] before:top-7 before:size-3 before:rounded-full before:border-2 before:border-[#8fc2af] before:bg-[#0d1110]"><p className="text-xs uppercase tracking-[0.12em] text-[#8d9890]">Jul 2018 – Dec 2021</p><h3 className="mt-2 font-serif text-2xl">QA Automation Engineer</h3><p className="mt-1 font-semibold text-[#c2cbc4]">Fiserv Inc.</p><p className="mt-3 text-sm leading-7 text-[#9aa59d]">Built and maintained automated test suites in partnership with developers, test engineers, and product owners.</p></article><article className="timeline-card relative rounded-2xl border border-white/10 bg-white/[0.05] p-5 shadow-sm before:absolute before:-left-[2rem] before:top-7 before:size-3 before:rounded-full before:border-2 before:border-[#8fc2af] before:bg-[#0d1110]"><p className="text-xs uppercase tracking-[0.12em] text-[#8d9890]">May 2017 – Jun 2018 · Rockville, MD</p><h3 className="mt-2 font-serif text-2xl">Web Developer</h3><p className="mt-1 font-semibold text-[#c2cbc4]">Computer Packages Inc.</p><p className="mt-3 text-sm leading-7 text-[#9aa59d]">Developed ASP.NET MVC client-server applications and migrated application systems from disparate data sources into SQL Server.</p></article></div></div></section>

        <section id="education" data-reveal className="reveal-section border-t border-white/[0.07] py-24"><div className="mx-auto w-[min(820px,calc(100%-48px))]"><SectionHeading eyebrow="Education" title="Academic foundation." /><div className="grid gap-3 text-[#c2cbc4]"><p><strong className="text-[#e8ece8]">M.S., Computer Science</strong> — Clemson University</p><p><strong className="text-[#e8ece8]">M.S., Electrical Engineering</strong> — Clemson University</p><p><strong className="text-[#e8ece8]">B.S., Biochemistry</strong> — Nanjing University</p></div></div></section>

        <section id="contact" data-reveal className="reveal-section border-t border-white/[0.07] py-24"><div className="mx-auto w-[min(820px,calc(100%-48px))]"><SectionHeading eyebrow="Contact" title="Connect with Han Song." /><div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-sm"><div className="grid gap-3 text-sm text-[#9aa59d] md:grid-cols-2"><a className="transition hover:text-[#8fc2af]" href="mailto:songhannju@gmail.com">songhannju@gmail.com</a><a className="transition hover:text-[#8fc2af]" href="tel:+18642072627">(864) 207-2627</a><span>Alpharetta, Georgia</span></div></div></div></section>
      </main>}
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
      <div className="pointer-events-none absolute inset-0 bg-[#0d1110]/90 opacity-95 [background-image:linear-gradient(115deg,rgba(230,241,234,0.12)_0%,transparent_38%,rgba(91,130,111,0.08)_100%),url('data:image/svg+xml,%3Csvg viewBox=%220 0 160 160%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.18%22/%3E%3C/svg%3E)]" />
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

function CapabilitySphere() {
  const [rotation, setRotation] = useState({ x: -7, y: 0 });
  const [autoRotation, setAutoRotation] = useState(0);
  const nodes = [
    { label: 'Backend Systems', value: 'Scalable services', x: -8, y: -126, z: 58, size: 'large' },
    { label: 'Cloud Native', value: 'Azure + CI/CD', x: 126, y: -48, z: -34, size: 'small' },
    { label: 'API & Integrations', value: 'Secure connections', x: -128, y: -30, z: -48, size: 'small' },
    { label: 'Reliability Engineering', value: 'Fault-tolerant services', x: 84, y: 82, z: 52, size: 'medium' },
    { label: 'Quality Engineering', value: '10–25% fewer bugs', x: -82, y: 100, z: -54, size: 'small' },
    { label: 'Data & SQL', value: 'Clear decisions', x: 18, y: 12, z: -112, size: 'small' },
    { label: 'Distributed Systems', value: 'Resilient architecture', x: 50, y: -102, z: -72, size: 'medium' },
    { label: 'Testing & QA', value: 'Confident releases', x: -66, y: -70, z: 92, size: 'small' },
  ];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame;
    const animate = (time) => {
      setAutoRotation((time * 0.006) % 360);
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function handlePointerMove(event) {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    setRotation({ x: (0.5 - y) * 20, y: (x - 0.5) * 24 });
  }

  const totalY = autoRotation + rotation.y;
  return <div className="capability-sphere" onPointerMove={handlePointerMove} onMouseMove={handlePointerMove} onPointerLeave={() => setRotation({ x: -7, y: 0 })} onMouseLeave={() => setRotation({ x: -7, y: 0 })} style={{ transform: `rotateX(${rotation.x}deg) rotateY(${totalY}deg)` }} aria-label="Interactive engineering capabilities"><div className="sphere-globe" aria-hidden="true"><span className="globe-line globe-line-latitude-top" /><span className="globe-line globe-line-latitude-middle" /><span className="globe-line globe-line-latitude-bottom" /><span className="globe-line globe-line-longitude-left" /><span className="globe-line globe-line-longitude-center" /><span className="globe-line globe-line-longitude-right" /></div>{nodes.map((node) => { const depthScale = 0.88 + ((node.z + 60) / 120) * 0.1; return <div className={`capability-card capability-card-${node.size} absolute rounded-2xl border border-white/10 bg-[#17201c]/90 shadow-xl backdrop-blur-md`} style={{ left: '50%', top: '50%', transform: `translate3d(calc(-50% + ${node.x}px), calc(-50% + ${node.y}px), ${node.z}px) scale(${depthScale}) rotateY(${-totalY}deg) rotateX(${-rotation.x}deg)` }} key={node.label}><span className="block uppercase tracking-[0.14em] text-[#8d9890]">{node.label}</span><strong className="mt-1 block">{node.value}</strong></div>; })}</div>;
}
