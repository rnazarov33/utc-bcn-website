export default function App() {
  const links = {
    join: "#join",
    events: "#events",
    referrals: "#referrals",
    about: "#about",
    telegram: "https://t.me/+sksFxTZOGEQ4MTQ6",
    instagram: "https://www.instagram.com/utc.barca/",
    linkedin: "https://www.linkedin.com/company/utc-barcelona/",
    luma: "https://lu.ma/utc-events",
    ideaForm: "https://tally.so/r/your-idea-form",
    issueForm: "https://tally.so/r/your-issue-form",
    referralForm: "https://docs.google.com/forms/d/e/1FAIpQLSdAH8n78Clqrqz9P7mjZ8qlViqQqu9nKsdoU8tAIdOmVnzCIw/viewform",
    email: "mailto:hello@utcbarcelona.com",
  };

  const stats = [
    { value: "2024", label: "founded" },
    { value: "60+", label: "community events" },
    { value: "1200+", label: "people connected offline" },
    { value: "15–115", label: "people per event" },
  ];

  const features = [
    {
      title: "Curated Network",
      text: "Meet a high-intent group of Ukrainians across tech, business, and creative industries. Professional, warm, and vetted.",
    },
    {
      title: "Active Events",
      text: "From focused meetups to large community gatherings — offline moments that feel worth leaving home for.",
    },
    {
      title: "Trusted Advice",
      text: "Practical advice from people who've actually solved it. No noise, just helpful community members helping you feel at home.",
    },
  ];

  const communityChats = {
    main: {
      title: "UTC Main Chat",
      text: "The heart of the community. Ask questions, share updates, meet people, and stay in the loop with everything happening in UTC Barcelona.",
      cta: "Join the main chat",
      href: links.telegram,
    },
    channels: [
      {
        title: "Designers",
        text: "UI/UX, brand, and visual creatives.",
        href: "https://t.me/+epTOB0y6Xm5iYzgy",
      },
      {
        title: "Engineers",
        text: "Backend, frontend, mobile, and infra.",
        href: "https://t.me/+9SwiupnOvOhkYmI6",
      },
      {
        title: "Product",
        text: "PMs, analysts, and strategists.",
        href: "https://t.me/+LHRi3Xw31o04MzZi",
      },
      {
        title: "Chaos",
        text: "Off-topic, memes, and random vibes.",
        href: "https://t.me/utcdiscuss",
      },
      {
        title: "Housing",
        text: "Apartments, roommates, and tips.",
        href: "https://t.me/+Vrbn21TcRyEwMGVi",
      },
      {
        title: "Hub Digest",
        text: "Weekly updates from the UTC Hub.",
        href: "https://t.me/utc_hub_digest",
      },
    ],
  };

  const initiatives = [
    {
      title: "UTC Referrals",
      text: "Help each other with trusted recommendations, jobs, services, and opportunities.",
    },
    {
      title: "Ukrainian Businesses",
      text: "Discover and support Ukrainian founders and businesses in Barcelona.",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Header links={links} />
      <main>
        <Hero links={links} />
        <StatsSection stats={stats} />
        <FeatureSection features={features} />
        <EventsSection links={links} />
        <JoinChatsSection chats={communityChats} />
        <ReferralsSection links={links} />
        <FeedbackSection links={links} />
        <AboutSection />
        <JoinSection links={links} />
      </main>
      <Footer links={links} />
    </div>
  );
}

function Header({ links }) {
  const navItems = [
    { label: "Events", href: links.events },
    { label: "Referrals", href: links.referrals },
    { label: "About", href: links.about },
    { label: "Join", href: links.join },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-sm font-semibold text-white shadow-sm">
            UTC
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-slate-950">UTC Barcelona</div>
            <div className="text-xs text-slate-500">Community website</div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={links.telegram}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Join community
        </a>
      </div>
    </header>
  );
}

function Hero({ links }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.18),_transparent_28%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="mb-4 inline-flex w-fit items-center rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-sm text-sky-700 shadow-sm">
            Ukrainians and friends in Barcelona
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            A curated community to call home
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            UTC is a high-intent community of Ukrainians and friends in Barcelona. We connect vetted professionals 
            across tech, business, and creative fields through events, professional circles, and trust-based networks.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={links.telegram}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Join the community
            </a>
            <a
              href={links.events}
              className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-stone-100"
            >
              Explore events
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Warm people. Real events. Practical community.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[2rem] border border-white/70 bg-white p-5 shadow-lg shadow-slate-200/70">
            <div className="mb-4 aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <img 
                src="/hero.png" 
                alt="UTC Barcelona community gathering" 
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-sm font-medium text-slate-700">Offline events that feel worth leaving home for</p>
          </div>
          <div className="mt-8 rounded-[2rem] border border-white/70 bg-white p-5 shadow-lg shadow-slate-200/70 sm:mt-14 text-center">
            <div className="mb-4 flex aspect-[4/5] items-center justify-center rounded-[1.5rem] bg-[linear-gradient(160deg,#ecfccb,#e0f2fe)] p-8">
              <div className="text-sm leading-6 text-slate-600">
                <p className="font-semibold text-slate-900">Add your community moments here</p>
                <p className="mt-2">Real faces, real energy, real connection.</p>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-700">A real place, not just a group chat</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection({ stats }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <SectionIntro eyebrow="Traction" title="What we’ve built together" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</div>
            <div className="mt-2 text-sm text-slate-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureSection({ features }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <SectionIntro
        eyebrow="Why UTC"
        title="More than a community"
        description="UTC brings together people, events, and a real shared place in Barcelona."
      />
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-4 h-12 w-12 rounded-2xl bg-sky-100" />
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">{feature.title}</h3>
            <p className="mt-3 text-base leading-7 text-slate-600">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EventsSection({ links }) {
  return (
    <section id="events" className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <SectionIntro
              eyebrow="Upcoming events"
              title="See what’s happening next"
              description="Meetups, talks, gatherings, and community moments in Barcelona."
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://luma.com/utc-events?period=past"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-stone-100"
              >
                See past events
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm">
            <iframe
              src="https://luma.com/embed/calendar/cal-XVqyCLhYYcyGZ8v/events"
              width="100%"
              height="600"
              frameBorder="0"
              style={{ border: "none" }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

function JoinChatsSection({ chats }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <SectionIntro
        eyebrow="Join high-trust circles"
        title="Find your specific crowd"
        description="UTC is a vetted network. Join our professional circles to connect with founders, engineers, and creators solving similar problems."
      />

      {/* Main Chat — prominent */}
      <a
        href={chats.main.href}
        target="_blank"
        rel="noreferrer"
        className="mt-8 block rounded-[2rem] border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-8 shadow-sm transition hover:border-sky-300 hover:shadow-md"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950">{chats.main.title}</h3>
            <p className="mt-2 max-w-xl text-base leading-7 text-slate-600">{chats.main.text}</p>
          </div>
          <span className="inline-flex shrink-0 items-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            {chats.main.cta} →
          </span>
        </div>
      </a>

      {/* Secondary chats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chats.channels.map((ch) => (
          <a
            key={ch.title}
            href={ch.href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"
          >
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">{ch.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{ch.text}</p>
            <span className="mt-4 inline-flex text-sm font-semibold text-sky-700 group-hover:text-sky-800">
              Join →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function ReferralsSection({ links }) {
  return (
    <section id="referrals" className="bg-slate-900 py-16 text-white lg:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="text-sm font-medium uppercase tracking-[0.18em] text-sky-300">UTC Referrals</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Skip the screening. Get referred.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
          Get referred to companies in Barcelona by UTC members. Many offer local Spanish contracts — great for settling in.
        </p>
        {/* Company logos — replace src with real logos in /public/logos/ */}
        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {["Revolut", "Glovo", "Typeform", "N26", "Factorial", "Wallapop"].map((name) => (
            <img
              key={name}
              src={`/logos/${name.toLowerCase()}.svg`}
              alt={name}
              className="h-9 object-contain opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ))}
        </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={links.telegram}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Browse companies
            </a>
            <a
              href={links.referralForm}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Add your company
            </a>
          </div>
      </div>
    </section>
  );
}


function FeedbackSection({ links }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <SectionIntro
        eyebrow="Feedback"
        title="Help us improve UTC"
        description="UTC is built with the community, not just for the community."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">Share an idea</h3>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Suggest an event, format, initiative, partnership, or any improvement you’d love to see.
          </p>
          <a
            href={links.ideaForm}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Share an idea
          </a>
        </div>
        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">Report an issue</h3>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Seen something broken, confusing, or not working well? Tell us and we’ll take a look.
          </p>
          <a
            href={links.issueForm}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-stone-100"
          >
            Report an issue
          </a>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="bg-stone-100 py-12 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionIntro eyebrow="About" title="How it started" />
        <div className="mt-6 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-base leading-8 text-slate-700">
            UTC began in April 2024 with a simple mission: to connect high-intent people offline.
          </p>
          <p className="mt-5 text-base leading-8 text-slate-700">
            We focus on intentional growth and curation, ensuring that every member can find real value 
            and trusted connections. It’s about quality over quantity.
          </p>
          <p className="mt-5 text-base leading-8 text-slate-700">
            Today, UTC is a living infrastructure for Ukrainians and their friends in Barcelona — 
            helping professionals meet, grow, and build something together in a place that feels like home.
          </p>
        </div>
      </div>
    </section>
  );
}

function JoinSection({ links }) {
  return (
    <section id="join" className="py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.25rem] bg-slate-900 px-6 py-10 text-white shadow-xl sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <div className="max-w-3xl">
            <div className="text-sm font-medium uppercase tracking-[0.18em] text-sky-300">Join UTC</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Whether you just arrived or have been here for years, you don’t have to figure it out alone
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Meet people. Discover events. Work alongside a trusted community. Feel at home faster.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={links.telegram}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Join the community
            </a>
            <a
              href={links.ideaForm}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Report an idea
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ links }) {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="text-base font-semibold text-slate-950">UTC Barcelona</div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            A place to feel at home in Barcelona.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-950">Explore</div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <a href={links.events}>Events</a>
            <a href={links.referrals}>Referrals</a>
            <a href={links.about}>About</a>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-950">Links</div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <a href={links.telegram} target="_blank" rel="noreferrer">Telegram</a>
            <a href={links.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={links.luma} target="_blank" rel="noreferrer">Luma</a>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-950">Contact</div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
            <a href={links.email}>hello@utcbarcelona.com</a>
            <a href={links.ideaForm} target="_blank" rel="noreferrer">Report an idea</a>
            <a href={links.issueForm} target="_blank" rel="noreferrer">Report an issue</a>
          </div>
        </div>
      </div>
      <div className="border-t border-stone-200 px-4 py-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
        Built with the community in Barcelona.
      </div>
    </footer>
  );
}

function SectionIntro({ eyebrow, title, description }) {
  return (
    <div>
      {eyebrow ? (
        <div className="text-sm font-medium uppercase tracking-[0.18em] text-sky-700">{eyebrow}</div>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p> : null}
    </div>
  );
}
