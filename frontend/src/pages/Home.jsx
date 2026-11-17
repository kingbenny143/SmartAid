import { Link } from 'react-router-dom'
import Disclaimer from '../components/Disclaimer.jsx'

const Home = () => {
  const cards = [
    {
      title: 'Symptom Checker',
      to: '/symptom-checker',
      description:
        'Select common symptoms and receive an informational assessment with general self-care guidance and awareness.',
      tag: 'Awareness',
      tagStyle: 'text-teal-700 bg-teal-50 border-teal-100',
      iconGradient: 'from-teal-500 to-teal-700',
      iconShadow: 'shadow-teal-500/20',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
    {
      title: 'First Aid Guides',
      to: '/first-aid',
      description:
        'Educational first-aid steps for minor, common situations including cuts, burns, sprains, and nosebleeds.',
      tag: 'Education',
      tagStyle: 'text-amber-800 bg-amber-50 border-amber-100',
      iconGradient: 'from-amber-500 to-orange-600',
      iconShadow: 'shadow-orange-500/20',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      ),
    },
    {
      title: 'Smart Aid Assistant',
      to: '/assistant',
      description:
        'Chat-based preventive health support — ask general questions about common symptoms and wellness habits.',
      tag: 'Support',
      tagStyle: 'text-sky-800 bg-sky-50 border-sky-100',
      iconGradient: 'from-sky-500 to-indigo-600',
      iconShadow: 'shadow-indigo-500/20',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ]

  const steps = [
    {
      num: '01',
      title: 'Share Symptoms',
      desc: 'Select the symptoms you are experiencing along with duration and perceived severity.',
    },
    {
      num: '02',
      title: 'Receive Guidance',
      desc: 'Get an informational assessment with possible categories, self-care tips, and safety red flags.',
    },
    {
      num: '03',
      title: 'Learn First Aid',
      desc: 'Explore educational first-aid guides for common everyday situations.',
    },
    {
      num: '04',
      title: 'Chat with AI',
      desc: 'Ask follow-up questions and learn about healthy preventive habits.',
    },
  ]

  const provides = [
    'AI-assisted health awareness',
    'Informational symptom guidance',
    'Preventive health support',
    'First-aid education',
    'Everyday wellness information',
  ]

  const doesNotDo = [
    'Does NOT diagnose medical conditions',
    'Does NOT prescribe medication',
    'Does NOT replace professional medical advice',
    'Does NOT guarantee clinical outcomes',
  ]

  return (
    <div className="home-root">
      {/* ========== HERO ========== */}
      <section className="home-hero">
        <div className="home-container">
          <div className="home-hero-grid">
            <div className="home-hero-copy">
              <span className="home-badge">
                <span className="home-badge-dot" aria-hidden="true" />
                AI-Assisted Health Awareness
              </span>

              <h1 className="home-hero-title">
                AI-Assisted Health Awareness,
                <span className="home-hero-title-break">Within Everyone's Reach</span>
              </h1>

              <p className="home-hero-lead">
                Understand health information, learn first-aid basics, and get
                preventive guidance through a simple AI-assisted experience.
              </p>

              <div className="home-hero-actions">
                <Link to="/symptom-checker" className="home-btn home-btn-primary home-btn-lg">
                  Check Symptoms
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link to="/first-aid" className="home-btn home-btn-secondary home-btn-lg">
                  Explore First Aid
                </Link>
              </div>

              <div className="home-hero-disclaimer">
                <Disclaimer tone="subtle" />
              </div>
            </div>

            <div className="home-hero-visual" aria-hidden="false">
              <div className="home-hero-glow" aria-hidden="true" />

              <div className="home-preview-card">
                <div className="home-preview-card-glow" aria-hidden="true" />

                {/* Preview Header */}
                <div className="home-preview-header">
                  <div className="home-preview-header-main">
                    <div className="home-preview-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 2a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5z" />
                      </svg>
                    </div>
                    <div className="home-preview-header-text">
                      <div className="home-preview-title">Health Snapshot</div>
                      <div className="home-preview-subtitle">Real-time informational view</div>
                    </div>
                  </div>
                  <span className="home-preview-status">
                    <span className="home-preview-status-dot" aria-hidden="true" />
                    Ready
                  </span>
                </div>

                {/* Preview Stat Tiles */}
                <div className="home-preview-stats">
                  <div className="home-preview-tile home-preview-tile-teal">
                    <div className="home-preview-tile-label">Awareness</div>
                    <div className="home-preview-tile-value">3 Features</div>
                    <div className="home-preview-tile-meta">Checker · Guide · Chat</div>
                  </div>
                  <div className="home-preview-tile home-preview-tile-sky">
                    <div className="home-preview-tile-label">First Aid</div>
                    <div className="home-preview-tile-value">12 Guides</div>
                    <div className="home-preview-tile-meta">Step-by-step guides</div>
                  </div>
                </div>

                {/* Preview Flow Steps */}
                <div className="home-preview-flow">
                  {[
                    { label: 'Select Symptoms', color: 'bg-teal-500' },
                    { label: 'Informational Analysis', color: 'bg-sky-500' },
                    { label: 'Guidance & Next Steps', color: 'bg-emerald-500' },
                  ].map((item, i) => (
                    <div key={i} className="home-preview-flow-item">
                      <span className={`home-preview-flow-dot ${item.color}`} aria-hidden="true" />
                      <span className="home-preview-flow-label">{item.label}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="home-preview-flow-check" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ))}
                </div>

                {/* Preview Footer */}
                <div className="home-preview-footer">
                  <div className="home-preview-avatars" aria-hidden="true">
                    <span className="home-preview-avatar home-preview-avatar-1" />
                    <span className="home-preview-avatar home-preview-avatar-2" />
                    <span className="home-preview-avatar home-preview-avatar-3" />
                  </div>
                  <span className="home-preview-footer-text">
                    Designed for everyday awareness
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CORE FEATURES ========== */}
      <section className="home-section" id="features">
        <div className="home-container">
          <div className="home-section-heading">
            <span className="home-badge home-badge-muted">Core Features</span>
            <h2 className="home-section-title">
              Everything you need for everyday health awareness
            </h2>
            <p className="home-section-subtitle">
              Three focused tools built for clarity, trust, and preventive understanding.
            </p>
          </div>

          <div className="home-features-grid">
            {cards.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="home-feature-card"
              >
                <div className="home-feature-card-top">
                  <div className={`home-feature-icon bg-gradient-to-br ${c.iconGradient} shadow-md ${c.iconShadow}`}>
                    {c.icon}
                  </div>
                  <span className={`home-feature-tag ${c.tagStyle}`}>
                    {c.tag}
                  </span>
                </div>

                <div className="home-feature-card-body">
                  <h3 className="home-feature-title">{c.title}</h3>
                  <p className="home-feature-desc">{c.description}</p>
                </div>

                <div className="home-feature-card-bottom">
                  <span className="home-feature-cta">Get started</span>
                  <span className="home-feature-arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="home-section home-section-muted" id="how-it-works">
        <div className="home-container">
          <div className="home-section-heading">
            <span className="home-badge home-badge-muted">How It Works</span>
            <h2 className="home-section-title">
              A simple four-step process
            </h2>
            <p className="home-section-subtitle">
              From symptom selection to preventive guidance — in under a minute.
            </p>
          </div>

          <div className="home-process">
            {steps.map((s, idx) => (
              <div key={s.num} className="home-process-item-wrap">
                {idx < steps.length - 1 && <div className="home-process-connector" aria-hidden="true" />}
                <div className="home-process-card">
                  <div className="home-process-num-wrap">
                    <span className="home-process-num">{s.num}</span>
                  </div>
                  <h3 className="home-process-title">{s.title}</h3>
                  <p className="home-process-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TRUST / SAFETY ========== */}
      <section className="home-section" id="safety">
        <div className="home-container">
          <div className="home-section-heading">
            <span className="home-badge home-badge-muted">Trust &amp; Safety</span>
            <h2 className="home-section-title">
              Clear boundaries you can rely on
            </h2>
            <p className="home-section-subtitle">
              Transparency is the foundation of every health conversation.
            </p>
          </div>

          <div className="home-safety-grid">
            {/* Left - Provides */}
            <div className="home-safety-card home-safety-card-provides">
              <div className="home-safety-icon home-safety-icon-check">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="home-safety-title">What Smart Aid Provides</h3>
              <ul className="home-safety-list">
                {provides.map((item) => (
                  <li key={item} className="home-safety-list-item">
                    <span className="home-safety-bullet home-safety-bullet-check" aria-hidden="true" />
                    <span className="home-safety-list-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - Does NOT Do */}
            <div className="home-safety-card home-safety-card-warn">
              <div className="home-safety-icon home-safety-icon-warn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h3 className="home-safety-title">What Smart Aid Does NOT Do</h3>
              <ul className="home-safety-list">
                {doesNotDo.map((item) => (
                  <li key={item} className="home-safety-list-item">
                    <span className="home-safety-bullet home-safety-bullet-warn" aria-hidden="true" />
                    <span className="home-safety-list-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="home-section home-section-cta">
        <div className="home-container">
          <div className="home-cta-banner">
            <div className="home-cta-glow home-cta-glow-1" aria-hidden="true" />
            <div className="home-cta-glow home-cta-glow-2" aria-hidden="true" />

            <div className="home-cta-content">
              <h2 className="home-cta-title">
                Start Your Health Awareness Journey
              </h2>
              <p className="home-cta-subtitle">
                Explore symptoms, learn first-aid basics, and understand your next step.
              </p>
              <Link to="/symptom-checker" className="home-btn home-btn-light home-btn-lg">
                Check Symptoms Now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
