export default function UTCBarcelonaWebsite() {
  const links = {
    join: "#join",
    events: "#events",
    hub: "#hub",
    community: "#community",
    initiatives: "#initiatives",
    about: "#about",
    telegram: "https://t.me/your_telegram",
    instagram: "https://instagram.com/your_instagram",
    linkedin: "https://linkedin.com/company/your-linkedin",
    luma: "https://lu.ma/your-page",
    ideaForm: "https://tally.so/r/your-idea-form",
    issueForm: "https://tally.so/r/your-issue-form",
    hubForm: "https://tally.so/r/your-hub-form",
    email: "mailto:hello@utcbarcelona.com",
  };

  const stats = [
    { value: "40+", label: "community events" },
    { value: "800+", label: "people connected offline" },
    { value: "15–115", label: "people per event" },
    { value: "1", label: "real hub in Barcelona" },
  ];

  const features = [
    {
      title: "People",
      text: "Meet Ukrainians and friends across tech, business, and creative industries. Build real connections, not just contacts.",
    },
    {
      title: "Events",
      text: "From small meetups to large gatherings — practical, warm, and worth attending.",
    },
    {
      title: "Hub",
      text: "A physical space where people work, meet, and spend time together. Not just coworking — a shared home.",
    },
  ];

  const starterCards = [
    {
      title: "Join chats",
      text: "Stay connected in the community day to day.",
      cta: "Join Telegram",
      href: links.telegram,
    },
    {
      title: "Attend events",
      text: "Discover upcoming meetups and gatherings.",
      cta: "Explore events",
      href: links.events,
    },
    {
      title: "Work from the Hub",
      text: "Cowork, connect, and spend time offline.",
      cta: "Explore Hub",
      href: links.hub,
    },
    {
      title: "Get involved",
      text: "Support or join community initiatives.",
      cta: "See initiatives",
      href: links.initiatives,
    },
  ];

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
        <StartHereSection cards={starterCards} />
        <HubSection links={links} />
        <CommunitySection links={links} />
        <InitiativesSection initiatives={initiatives} links={links} />
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
    { label: "Hub", href: links.hub },
    { label: "Community", href: links.community },
    { label: "Initiatives", href: links.initiatives },
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
            <div className="text-sm font-semibold tracking-tight">UTC Barcelona</div>
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
            A place to feel at home in Barcelona
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            UTC is a community of Ukrainians and friends in Barcelona — connecting people across tech,
            business, and creative fields through events, conversations, and a shared space to work and grow together.
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
            <div className="mb-4 aspect-[4/5] rounded-[1.5rem] bg-[linear-gradient(135deg,#dbeafe,#fef3c7)] p-4">
              <div className="flex h-full items-end rounded-[1.25rem] bg-white/60 p-4 text-sm text-slate-700 backdrop-blur">
                Replace this with a real event photo full of faces and energy.
              </div>
            </div>
            <p className="text-sm font-medium text-slate-700">Offline events that feel worth leaving home for</p>
          </div>
          <div className="mt-8 rounded-[2rem] border border-white/70 bg-white p-5 shadow-lg shadow-slate-200/70 sm:mt-14">
            <div className="mb-4 aspect-[4/5] rounded-[1.5rem] bg-[linear-gradient(160deg,#ecfccb,#e0f2fe)] p-4">
              <div className="flex h-full items-end rounded-[1.25rem] bg-white/60 p-4 text-sm text-slate-700 backdrop-blur">
                Replace this with a real Hub photo that shows work, coffee, and community.
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
            <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
              Replace the placeholder on the right with your real Luma embed. Keep this section near the top so people can instantly see activity.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={links.luma}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                View all events
              </a>
              <a
                href={links.telegram}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-stone-100"
              >
                Join Telegram
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-50 shadow-sm">
            <div className="border-b border-stone-200 px-5 py-4 text-sm font-medium text-slate-700">
              Luma embed placeholder
            </div>
            <div className="aspect-[4/3] w-full bg-[linear-gradient(135deg,#f8fafc,#ecfeff)] p-4">
              <div className="flex h-full items-center justify-center rounded-[1.5rem] border border-dashed border-stone-300 bg-white/80 p-8 text-center text-sm leading-6 text-slate-500">
                Paste your Luma embed iframe or widget here.
                <br />
                Example: upcoming events feed from your UTC Luma page.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StartHereSection({ cards }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <SectionIntro
        eyebrow="Start here"
        title="Everything you need to plug into UTC in minutes"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.title} className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold tracking-tight text-slate-950">{card.title}</h3>
            <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{card.text}</p>
            <a href={card.href} className="mt-6 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-800">
              {card.cta} →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function HubSection({ links }) {
  return (
    <section id="hub" className="bg-slate-900 py-12 text-white lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="text-sm font-medium uppercase tracking-[0.18em] text-sky-300">UTC Hub</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A real place, not just a chat</h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            UTC Hub is where the community comes to life. We work here, host events here, meet people here, and create the feeling of home in a new city.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={links.hubForm}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Become a resident
            </a>
            <a
              href={links.email}
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Visit the hub
            </a>
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="aspect-[16/10] rounded-[1.5rem] bg-[linear-gradient(140deg,#0f172a,#1e293b,#0ea5e9)] p-4">
            <div className="flex h-full items-end rounded-[1.25rem] bg-white/10 p-5 text-sm text-slate-200">
              Replace this area with real Hub images, opening hours, or a short gallery.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunitySection({ links }) {
  return (
    <section id="community" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionIntro
            eyebrow="Community"
            title="Why people stay"
            description="Because it’s not about networking. It’s about feeling understood."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "Find your circle",
            "Speak your language",
            "Share real experience",
            "Build something together",
          ].map((item) => (
            <div key={item} className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm">
              <div className="text-base font-semibold text-slate-900">{item}</div>
            </div>
          ))}
          <div className="sm:col-span-2 rounded-[1.5rem] border border-sky-200 bg-sky-50 p-6 shadow-sm">
            <p className="text-sm leading-7 text-slate-700">
              UTC also lives online through chats and small communities where people ask for help, share opportunities, organize meetups, and stay connected daily.
            </p>
            <a
              href={links.telegram}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Join Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function InitiativesSection({ initiatives, links }) {
  return (
    <section id="initiatives" className="bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Built by the community"
          title="Initiatives that make UTC useful"
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {initiatives.map((item) => (
            <div key={item.title} className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-6 shadow-sm">
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <a href={links.telegram} className="inline-flex text-sm font-semibold text-sky-700 hover:text-sky-800">
            See initiatives →
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
            Report an idea
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
            UTC began in April 2024 as a simple idea: bring people together.
          </p>
          <p className="mt-5 text-base leading-8 text-slate-700">
            Since then, it has grown into a living community with events, a physical hub, and hundreds of people connecting every week.
          </p>
          <p className="mt-5 text-base leading-8 text-slate-700">
            We’re building a place where Ukrainians and their friends in Barcelona can meet, grow, support each other, and feel at home.
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
            <a href={links.hub}>Hub</a>
            <a href={links.community}>Community</a>
            <a href={links.initiatives}>Initiatives</a>
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
