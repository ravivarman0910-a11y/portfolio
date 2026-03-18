import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const PROJECTS = [
  {
    title: 'Portfolio Website',
    description:
      'This site — built to stay fast and clear, with a touch of animation and a lot of polish.',
    tech: 'react',
  },
  {
    title: 'Interactive Dashboard',
    description:
      'A dashboard I built to help teams explore data quickly without waiting for reloads.',
    tech: 'react',
  },
  {
    title: 'Design System',
    description:
      'Library of UI patterns and tokens that keeps things consistent across multiple pages.',
    tech: 'ui',
  },
  {
    title: 'Landing Page Animation',
    description:
      'A scroll-based micro-interaction experiment that’s fun to explore and easy to tweak.',
    tech: 'ui',
  },
  {
    title: 'Dev Toolkit',
    description: 'Scripts I use daily to scaffold new apps, run checks, and keep builds clean.',
    tech: 'tool',
  },
  {
    title: 'CSS Utility Library',
    description:
      'Small set of helpers I use when I want a quick layout without pulling in a whole framework.',
    tech: 'tool',
  },
];

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'react', label: 'React' },
  { id: 'ui', label: 'UI/UX' },
  { id: 'tool', label: 'Tooling' },
];

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [filter, setFilter] = useState('all');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVerified, setHasVerified] = useState(
    () => localStorage.getItem('contactFormVerified') === 'true',
  );
  const [showBack, setShowBack] = useState(false);

  const sectionRefs = useRef({});

  useEffect(() => {
    const onScroll = () => {
      const scrollPos = window.scrollY + 120;
      let found = activeSection;

      Object.keys(sectionRefs.current).forEach((key) => {
        const el = sectionRefs.current[key];
        if (!el) return;
        const { offsetTop, offsetHeight } = el;
        if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
          found = key;
        }
      });

      setActiveSection(found);
      setShowBack(window.scrollY > 300);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('load', onScroll);
    };
  }, [activeSection]);

  const filteredProjects = useMemo(() => {
    if (filter === 'all') return PROJECTS;
    return PROJECTS.filter((project) => project.tech === filter);
  }, [filter]);

  const scrollToSection = (id) => {
    const target = sectionRefs.current[id] || document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const values = {
      name: (data.get('name') || '').toString().trim(),
      email: (data.get('email') || '').toString().trim(),
      message: (data.get('message') || '').toString().trim(),
    };

    if (!values.name || !values.email || !values.message) {
      setFormMessage('Please fill in all fields before sending.');
      return;
    }

    setIsSubmitting(true);
    setFormMessage('Sending message…');

    const payload = new URLSearchParams({
      name: values.name,
      email: values.email,
      message: values.message,
      _captcha: 'false',
      _subject: `New message from ${values.name}`,
    });

    try {
      const res = await fetch('https://formsubmit.co/ajax/ravivarman0910@gmail.com', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: payload.toString(),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      if (!hasVerified) {
        setFormMessage(
          'Thanks! A verification email was just sent — please click the link to enable message delivery.',
        );
        localStorage.setItem('contactFormVerified', 'true');
        setHasVerified(true);
      } else {
        setFormMessage('Thanks! Your message was sent.');
      }

      form.reset();

      setTimeout(() => setFormMessage(''), 4800);
    } catch (error) {
      console.error('FormSubmit error:', error);
      setFormMessage('Oops! Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>RAVIVARMAN</h1>
        <nav aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeSection === item.id ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero">
        <h2>
          Hi, I'm <span>RAVIVARMAN</span>
        </h2>
        <p>
          I build frontends that feel smooth, make life easier, and stay easy to change —
          usually with React, a bit of CSS magic, and plenty of refactoring.
        </p>
        <button className="btn" type="button" onClick={() => scrollToSection('contact')}>
          Say Hello
        </button>
      </section>

      <section id="about" ref={(el) => (sectionRefs.current.about = el)} className="about">
        <h3>About Me</h3>
        <div className="section-divider" />
        <p>
          I'm a frontend engineer who likes keeping things simple and useful. Over the past
          few years I've been building interfaces in React and TypeScript, learning a lot
          from designers and real users along the way. Outside the screen, I sketch layouts
          in a notebook and tinker with keyboard shortcuts to stay productive.
        </p>
      </section>

      <section id="skills" ref={(el) => (sectionRefs.current.skills = el)} className="skills">
        <h3>Skills & Tools</h3>
        <div className="section-divider" />
        <div className="projects">
          <div className="card" data-tech="tool">
            <h4>React + TypeScript</h4>
            <p>
              I like building small pieces (components, hooks) that can be reused without
              surprise later.
            </p>
          </div>
          <div className="card" data-tech="tool">
            <h4>Design Systems</h4>
            <p>
              Creating a shared set of styles and patterns so products stay consistent as
              they grow.
            </p>
          </div>
          <div className="card" data-tech="tool">
            <h4>Performance</h4>
            <p>
              Quick load times matter; I use profiling to spot slow spots and keep things
              snappy.
            </p>
          </div>
          <div className="card" data-tech="tool">
            <h4>CI/CD & Tooling</h4>
            <p>
              Small automations (lint, tests, deploys) keep the codebase clean and deploys
              painless.
            </p>
          </div>
        </div>
      </section>

      <section id="projects" ref={(el) => (sectionRefs.current.projects = el)}>
        <h3>Projects</h3>
        <div className="section-divider" />
        <div className="project-filters" role="group" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="projects">
          {filteredProjects.map((project) => (
            <div key={project.title} className="card" data-tech={project.tech}>
              <h4>{project.title}</h4>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" ref={(el) => (sectionRefs.current.contact = el)} className="contact">
        <h3>Contact</h3>
        <div className="section-divider" />
        <div className="contact-grid">
          <div>
            <p>
              If you have a project idea, a tricky UI problem, or just want to chat about
              tools, feel free to reach out. I usually respond within a day.
            </p>
            <p>
              <strong>Phone:</strong> 9865427985
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:ravivarman0910@gmail.com">ravivarman0910@gmail.com</a>
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input name="name" type="text" placeholder="Your full name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" placeholder="you@example.com" required />
            </label>
            <label>
              Message
              <textarea
                name="message"
                placeholder="Tell me what you’re working on"
                rows={4}
                required
              />
            </label>

            <div className="form-note" aria-live="polite">
              {formMessage}
            </div>

            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </div>
      </section>

      <footer>
        <p>© 2026 RAVIVARMAN | Frontend Developer</p>
      </footer>

      <button
        type="button"
        className={`back-to-top ${showBack ? 'show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}

export default App;
