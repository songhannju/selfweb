import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import SignalTape from './components/SignalTape';
import { trackView } from './lib/trackView';

// The blog pulls in Supabase and DOMPurify; keep them out of the first paint.
const Blog = lazy(() => import('./components/Blog'));
const BlogTicker = lazy(() => import('./components/BlogTicker'));

const EMAIL = 'songhannju@gmail.com';
const PHONE = '(864) 207-2627';

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

const facts = [
  { value: '8', unit: '+', label: 'years building production software' },
  { value: '22,000', unit: '+', label: 'subscribers migrated in a single run' },
  { value: '10–25', unit: '%', label: 'fewer bugs, year over year' },
  { value: '50', unit: '%', label: 'more efficient bug tracking' },
];

const work = [
  {
    title: 'Payee fraud validation',
    domain: 'Payments risk',
    org: 'Fiserv · CashFlow Central',
    detail: "Real-time payee screening for outbound payments. The service integrates Fiserv's internal Verify Now service so every payee is checked before funds move.",
    tags: ['C#', 'ASP.NET Core', 'REST APIs'],
  },
  {
    title: 'Checkpoint migration processor',
    domain: 'Data migration',
    org: 'Fiserv · CashFlow Central',
    detail: 'A fault-tolerant, checkpoint-based processor with idempotent retries and rollback, built to move subscribers between platforms without ever writing one twice.',
    tags: ['C#', 'Idempotency', 'Rollback'],
    caseStudy: true,
  },
  {
    title: 'Event-driven notifications',
    domain: 'Messaging',
    org: 'Fiserv · CashFlow Central',
    detail: 'Email notifications triggered by bank-account updates, package changes and promo changes, so clients hear about key account events as they happen.',
    tags: ['Event-driven', 'C#'],
  },
  {
    title: 'Check-clearing-date visibility',
    domain: 'Product',
    org: 'Fiserv · CashFlow Central',
    detail: 'Expected clear dates surfaced at payment time in the client payment view, giving small-business users a clearer picture of their cash flow.',
    tags: ['ASP.NET Core', 'Product'],
  },
  {
    title: 'Banking web-services automation',
    domain: 'Test automation',
    org: 'Fiserv',
    detail: 'SOAP and REST automation frameworks and suites, built with developers, test engineers and product owners. Bugs fell 10–25% year over year.',
    tags: ['SOAP', 'REST', 'Postman', 'SoapSonar'],
  },
  {
    title: 'Security-gateway migration',
    domain: 'Validation',
    org: 'Fiserv',
    detail: 'Designed and executed validation for a security-gateway migration across every impacted application and environment.',
    tags: ['Test design', 'Environments'],
  },
  {
    title: 'SQL Server consolidation',
    domain: 'Data',
    org: 'Computer Packages Inc.',
    detail: 'Migrated application systems from disparate data sources into SQL Server, covering analysis, mapping, conversion testing and data comparison.',
    tags: ['SQL Server', 'ASP.NET MVC'],
  },
];

const steps = [
  { title: 'Read a batch', text: 'Pull the next batch of subscribers from the source system.' },
  { title: 'Write a checkpoint', text: 'Record progress before anything is written, so a run always knows where it stands.' },
  { title: 'Migrate idempotently', text: 'Each subscriber is written with an idempotent operation. Running it twice changes nothing.' },
  { title: 'Retry or resume', text: 'A failure retries safely, or the run resumes from the last checkpoint.', loop: true },
  { title: 'Commit or roll back', text: 'The run finishes cleanly, or it is rolled back. Never left half done.' },
];

const experience = [
  {
    when: 'Dec 2022 – Sep 2026',
    role: 'Senior Software Engineer',
    org: 'Fiserv Inc. · Alpharetta, GA',
    points: [
      "Designed and shipped payee fraud validation for outbound payments, integrating Fiserv's internal Verify Now service.",
      'Built event-driven email notifications for account, package and promo changes.',
      'Built a checkpoint-based processor with idempotent retries and rollback, migrating 22,000+ subscribers per run.',
      'Partnered with product owners and platform teams on design and code reviews across CashFlow Central.',
    ],
  },
  {
    when: 'Jan 2021 – Dec 2022',
    role: 'Senior QA Automation Engineer',
    org: 'Fiserv Inc.',
    points: [
      'Built banking web-services automation frameworks for SOAP and REST APIs, reducing bugs 10–25% year over year.',
      'Consolidated defect backlogs and reported resolution metrics to IT management, improving bug-tracking efficiency by 50%.',
      'Designed and executed validation for a security-gateway migration.',
    ],
  },
  {
    when: 'Jul 2018 – Dec 2020',
    role: 'QA Automation Engineer',
    org: 'Fiserv Inc.',
    points: ['Designed, implemented and maintained automated test suites with developers, test engineers and product owners.'],
  },
  {
    when: 'May 2017 – Jun 2018',
    role: 'Web Developer',
    org: 'Computer Packages Inc. · Rockville, MD',
    points: [
      'Developed client-server web applications with ASP.NET MVC, C#, JavaScript, HTML and CSS.',
      'Migrated application systems from disparate data sources into SQL Server.',
    ],
  },
];

const skillGroups = [
  { title: 'Languages', items: ['C#', 'Java', 'JavaScript', 'Python', 'SQL', 'HTML'], core: ['C#', 'SQL'] },
  { title: 'Backend', items: ['ASP.NET Core', 'ASP.NET MVC', 'RESTful APIs', 'SOAP', 'Microservices', 'NoSQL'], core: ['ASP.NET Core', 'RESTful APIs'] },
  { title: 'Cloud & delivery', items: ['Azure', 'Docker', 'Jenkins', 'Harness', 'GitHub', 'GitLab'], core: ['Azure'] },
  { title: 'Testing & tools', items: ['Postman', 'SoapSonar', 'Jira', 'Visual Studio', 'GitHub Copilot', 'React'], core: [] },
];

const education = [
  { deg: 'M.S.', field: 'Computer Science', school: 'Clemson University' },
  { deg: 'M.S.', field: 'Electrical Engineering', school: 'Clemson University' },
  { deg: 'B.S.', field: 'Biochemistry', school: 'Nanjing University' },
];

export default function App() {
  const [activeView, setActiveView] = useState('resume');
  const [pendingSection, setPendingSection] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  function navigateToSection(sectionId) {
    setMenuOpen(false);
    setActiveView('resume');
    setPendingSection(sectionId);
  }

  function openBlog() {
    setMenuOpen(false);
    setActiveView('blog');
  }

  useEffect(() => {
    if (activeView !== 'resume' || !pendingSection) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const section = document.getElementById(pendingSection);
      if (section) {
        window.history.replaceState(null, '', pendingSection === 'home' ? window.location.pathname : `#${pendingSection}`);
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setPendingSection(null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeView, pendingSection]);

  useEffect(() => {
    if (activeView === 'blog') window.scrollTo({ top: 0, behavior: 'instant' });
    trackView(activeView);
  }, [activeView]);

  // scroll-spy for the nav
  useEffect(() => {
    if (activeView !== 'resume') return undefined;
    const sections = ['home', ...navItems.map((item) => item.id)].map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [activeView]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (!menuOpen) return undefined;
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="scroll-progress" aria-hidden="true" />
      <SiteNav
        activeView={activeView}
        activeSection={activeSection}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onNavigate={navigateToSection}
        onBlog={openBlog}
      />

      {activeView === 'blog' ? (
        <div className="view" key="blog" id="main">
          <Suspense fallback={<div style={{ minHeight: '100svh' }} />}>
            <Blog onBack={() => navigateToSection('home')} />
          </Suspense>
        </div>
      ) : (
        <main className="view" key="resume" id="main">
          <Hero onWork={() => navigateToSection('projects')} />
          <About onOpenBlog={openBlog} />
          <Work />
          <Experience />
          <Skills />
          <Education />
          <Contact />
        </main>
      )}

      <footer className="footer">
        <div className="wrap footer__inner">
          <span>© 2026 Han Song. Built with care in Alpharetta, Georgia.</span>
          <button className="footer__top" type="button" onClick={() => navigateToSection('home')}>
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </footer>
    </>
  );
}

function SiteNav({ activeView, activeSection, menuOpen, onToggleMenu, onNavigate, onBlog }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;height:8px;width:1px;pointer-events:none;';
    document.body.prepend(sentinel);
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  const isCurrent = (id) => activeView === 'resume' && activeSection === id;

  return (
    <>
      <header className={`nav ${scrolled || menuOpen ? 'is-scrolled' : ''}`}>
        <nav className="wrap nav__inner" aria-label="Primary">
          <button className="nav__mark" type="button" onClick={() => onNavigate('home')} aria-label="Han Song, back to top">
            <span className="nav__glyph" aria-hidden="true">HS</span>
            <span>Han Song</span>
          </button>
          <ul className="nav__links">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  className="nav__link"
                  href={`#${item.id}`}
                  aria-current={isCurrent(item.id) ? 'true' : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(item.id);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <button className="nav__link nav__link--blog" type="button" aria-current={activeView === 'blog' ? 'true' : undefined} onClick={onBlog}>
                <span className="nav__dot" aria-hidden="true" />
                Blog
              </button>
            </li>
          </ul>
          <button className="nav__menu-btn" type="button" aria-expanded={menuOpen} aria-controls="site-menu" onClick={onToggleMenu}>
            {menuOpen ? 'Close' : 'Menu'}
            <span className="nav__burger" aria-hidden="true" />
          </button>
        </nav>
      </header>

      <div className={`menu ${menuOpen ? 'is-open' : ''}`} id="site-menu" aria-hidden={!menuOpen} inert={!menuOpen}>
        <ul className="menu__list">
          {navItems.map((item, index) => (
            <li className="menu__item" style={{ '--i': index }} key={item.id}>
              <a
                className="menu__link"
                href={`#${item.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.id);
                }}
              >
                {item.label}
                <span className="mono">0{index + 1}</span>
              </a>
            </li>
          ))}
          <li className="menu__item" style={{ '--i': navItems.length }}>
            <button className="menu__link" type="button" onClick={onBlog}>
              Blog
              <span className="mono">Notes</span>
            </button>
          </li>
        </ul>
        <div className="menu__foot mono">
          <a className="link" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <span>Alpharetta, GA</span>
        </div>
      </div>
    </>
  );
}

function LocalTime() {
  const [time, setTime] = useState(() => formatTime());

  useEffect(() => {
    const timer = window.setInterval(() => setTime(formatTime()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  return <time className="mono">{time}</time>;
}

function formatTime() {
  return `${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' }).format(new Date())} ET`;
}

function Hero({ onWork }) {
  return (
    <section id="home" className="hero" aria-labelledby="hero-name">
      <div className="wrap hero__meta">
        <p className="hero__status">
          <span className="pulse" aria-hidden="true" />
          Senior .NET Engineer
        </p>
        <p>
          <span className="hero__where">Alpharetta, GA <span aria-hidden="true">·</span> </span><LocalTime />
        </p>
      </div>

      <SignalTape />

      <div className="wrap hero__foot">
        <h1 className="hero__name" id="hero-name">
          <span className="hero__name-line"><span style={{ '--d': '80ms' }}>Han</span></span>{' '}
          <span className="hero__name-line"><span style={{ '--d': '180ms' }}>Song</span></span>
        </h1>
        <div className="hero__aside">
          <p className="hero__lede">
            I build payment backends where a <em>retry is always safe.</em>
          </p>
          <div className="hero__actions">
            <a
              className="btn btn--primary"
              href="#projects"
              onClick={(event) => {
                event.preventDefault();
                onWork();
              }}
            >
              Selected work <span className="btn__arrow btn__arrow--down" aria-hidden="true">↓</span>
            </a>
            <a className="btn" href="/resume.txt" download="Han-Song-Resume.txt">
              Résumé <span className="btn__arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children, count }) {
  return (
    <h2 className="section__label">
      {children}
      {count ? <sup>{count}</sup> : null}
    </h2>
  );
}

function About({ onOpenBlog }) {
  return (
    <section id="about" className="section" aria-label="About">
      <div className="wrap">
        <dl className="facts">
          {facts.map((fact) => (
            <div className="fact" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>
                {fact.value}
                <small>{fact.unit}</small>
              </dd>
            </div>
          ))}
        </dl>

        <div className="section__grid" style={{ marginTop: 'clamp(5rem, 10vw, 8rem)' }}>
          <SectionLabel>About</SectionLabel>
          <div>
            <p className="statement">
              Eight years building backend systems, distributed services and cloud-native applications.{' '}
              <span className="dim">Most recently on Fiserv&apos;s CashFlow Central platform.</span>
            </p>
            <div className="about__body">
              <div className="about__text">
                <p>
                  My work sits where reliability matters most: screening payees <strong>before money moves</strong>, notifications clients depend on, and migrations that have to finish cleanly every time.
                </p>
                <p>
                  Before backend engineering I spent four years building test automation for banking web services. That still shapes how I design. Every service I ship comes with the checks that prove it works.
                </p>
              </div>
              <dl className="kv">
                <div><dt>Based in</dt><dd>Alpharetta, Georgia</dd></div>
                <div><dt>Works in</dt><dd>C#, ASP.NET Core, Azure</dd></div>
                <div><dt>Email</dt><dd><a className="link" href={`mailto:${EMAIL}`}>{EMAIL}</a></dd></div>
                <div><dt>Phone</dt><dd><a className="link" href="tel:+18642072627">{PHONE}</a></dd></div>
              </dl>
            </div>
            <Suspense fallback={null}>
              <BlogTicker onOpenBlog={onOpenBlog} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}

function Work() {
  const [open, setOpen] = useState(1);

  return (
    <section id="projects" className="section" aria-labelledby="work-title">
      <div className="wrap section__grid">
        <SectionLabel count={work.length}>Selected work</SectionLabel>
        <div>
          <h3 className="section__title" id="work-title">
            Systems that move money, <span className="dim">and the tests that keep them honest.</span>
          </h3>
          <ul className="work">
            {work.map((item, index) => {
              const isOpen = open === index;
              return (
                <li className="work__item" key={item.title}>
                  <button
                    className="work__row"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`work-panel-${index}`}
                    onClick={() => setOpen(isOpen ? null : index)}
                  >
                    <span className="work__domain">{item.domain}</span>
                    <span className="work__title">{item.title}</span>
                    <span className="work__org">{item.org}</span>
                    <span className="work__toggle" aria-hidden="true" />
                  </button>
                  <div className={`work__panel ${isOpen ? 'is-open' : ''}`} id={`work-panel-${index}`} role="region" aria-label={item.title}>
                    <div>
                      <div className="work__detail">
                        <p>
                          {item.detail}{' '}
                          {item.caseStudy ? <a className="link work__more" href="#case-study">How it works ↓</a> : null}
                        </p>
                        <ul className="tags" aria-label="Stack">
                          {item.tags.map((tag) => <li className="tag" key={tag}>{tag}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <CaseStudy />
        </div>
      </div>
    </section>
  );
}

function CaseStudy() {
  return (
    <article className="case" id="case-study" aria-labelledby="case-title">
      <div>
        <p className="case__kicker">In depth · Checkpoint migration processor</p>
        <h3 className="case__title" id="case-title">A migration that can stop anywhere and pick up exactly where it left off.</h3>
        <p className="case__text">
          Moving subscribers between platforms is the kind of job that fails halfway on a bad night. So the processor was designed around one rule: any step can be repeated without changing the result.
        </p>
        <div className="case__figure">
          <strong>22,000+</strong>
          <span>subscribers migrated per run</span>
        </div>
      </div>
      <ol className="steps" aria-label="How the processor works, simplified">
        {steps.map((step) => (
          <li className={`step ${step.loop ? 'step--loop' : ''}`} key={step.title}>
            <div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              {step.loop ? (
                <span className="step__loop">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M10 6a4 4 0 1 1-1.2-2.85M10 1.5v2.2H7.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  back to step 2, safely
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}

function Experience() {
  const listRef = useRef(null);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll('.xp__item') ?? [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) entry.target.classList.add('is-passed');
          else entry.target.classList.remove('is-passed');
        });
      },
      { rootMargin: '0px 0px -40% 0px' },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="section" aria-labelledby="xp-title">
      <div className="wrap section__grid">
        <SectionLabel count={experience.length}>Experience</SectionLabel>
        <div>
          <h3 className="section__title" id="xp-title">
            Web developer, then test automation, <span className="dim">then the backend it was testing.</span>
          </h3>
          <div className="xp" ref={listRef}>
            <span className="xp__rail" aria-hidden="true"><span className="xp__rail-fill" /></span>
            <ol className="xp__items">
            {experience.map((job) => (
              <li className="xp__item" key={job.role}>
                <span className="xp__dot" aria-hidden="true" />
                <p className="xp__when mono">{job.when}</p>
                <div>
                  <h4 className="xp__role">{job.role}</h4>
                  <p className="xp__org">{job.org}</p>
                  <ul className="xp__list">
                    {job.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                </div>
              </li>
            ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="wrap section__grid">
        <SectionLabel>Skills</SectionLabel>
        <div>
          <h3 className="section__title" id="skills-title">
            The tools, <span className="dim">grouped by where they sit in the stack.</span>
          </h3>
          <div className="skills">
            {skillGroups.map((group) => (
              <div className="skills__group" key={group.title}>
                <h4>{group.title}</h4>
                <ul>
                  {group.items.map((item) => (
                    <li className={group.core.includes(item) ? 'is-core' : undefined} key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="skills__key">Daily drivers</p>
        </div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section id="education" className="section" aria-labelledby="edu-title">
      <div className="wrap section__grid">
        <SectionLabel>Education</SectionLabel>
        <div>
          <h3 className="section__title" id="edu-title">
            Two master&apos;s degrees, <span className="dim">and a start in the lab.</span>
          </h3>
          <ul className="edu">
            {education.map((item) => (
              <li key={item.field}>
                <span className="edu__deg">{item.deg}</span>
                <span className="edu__field">{item.field}</span>
                <span className="edu__school">{item.school}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const sectionRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('is-in');
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }

  return (
    <section id="contact" className="contact" ref={sectionRef} aria-labelledby="contact-title">
      <div className="wrap">
        <div className="section__grid">
          <SectionLabel>Contact</SectionLabel>
          <h3 className="contact__lead" id="contact-title">Hiring for backend, payments or platform work? I&apos;d like to hear about it.</h3>
        </div>
        <a className="contact__mail" href={`mailto:${EMAIL}`} aria-label={`Email ${EMAIL}`}>
          {EMAIL.split('@').map((part, partIndex) => (
            <span className="contact__mail-part" key={part}>
              {(partIndex ? `@${part}` : part).split('').map((char, index) => (
                <span className="ch" style={{ '--i': index + partIndex * 10 }} aria-hidden="true" key={`${char}-${index}`}>{char}</span>
              ))}
            </span>
          ))}
        </a>
        <div className="contact__row">
          <a className="btn btn--primary" href={`mailto:${EMAIL}`}>
            Write an email <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
          <button className="btn copy-btn" type="button" onClick={copyEmail} data-copied={copied}>
            {copied ? 'Copied' : 'Copy address'}
          </button>
          <span className="sr-only" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
        </div>
        <div className="contact__meta">
          <p><span>Phone</span><a className="link" href="tel:+18642072627">{PHONE}</a></p>
          <p><span>Location</span>Alpharetta, Georgia</p>
          <p><span>Résumé</span><a className="link" href="/resume.txt" download="Han-Song-Resume.txt">Download (.txt)</a></p>
        </div>
      </div>
    </section>
  );
}
