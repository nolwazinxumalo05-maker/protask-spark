import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Compass, MailPlus, MessagesSquare, NotebookPen } from "lucide-react";
import { AppShell, Disclaimer, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solstice — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft emails, summarize meetings, plan your day and research decisions with one warm, focused AI workspace.",
      },
      { property: "og:title", content: "Solstice — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Five AI helpers for the daily work that eats your calendar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TOOLS = [
  {
    to: "/email" as const,
    icon: MailPlus,
    name: "Smart Email Generator",
    blurb: "Send-ready drafts shaped to your audience, tone and length.",
    tag: "Writing",
  },
  {
    to: "/meeting-notes" as const,
    icon: NotebookPen,
    name: "Meeting Notes Summarizer",
    blurb: "Key points, decisions, owners and deadlines from raw notes.",
    tag: "Meetings",
  },
  {
    to: "/planner" as const,
    icon: CalendarCheck,
    name: "AI Task Planner",
    blurb: "A ranked, time-blocked day that fits the hours you actually have.",
    tag: "Planning",
  },
  {
    to: "/research" as const,
    icon: Compass,
    name: "AI Research Assistant",
    blurb: "Structured briefings with trade-offs and what to verify.",
    tag: "Research",
  },
  {
    to: "/chat" as const,
    icon: MessagesSquare,
    name: "Assistant Chat",
    blurb: "Think out loud. Conversations are saved in your browser.",
    tag: "Chat",
  },
];

const STATS = [
  { label: "Helpers ready", value: "5" },
  { label: "Setup needed", value: "None" },
  { label: "Typical draft", value: "~10s" },
];

function Index() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Good day, Ruha"
        title="Your workday, one step lighter"
        subtitle="Pick a helper below. Each one asks a few focused questions and returns something you can use straight away."
      />

      <div className="space-y-8 px-6 py-8 md:px-10">
        <section className="overflow-hidden rounded-2xl bg-gradient-dusk p-6 shadow-dusk md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/70">
            Start here
          </p>
          <h2 className="font-display mt-2 max-w-xl text-2xl leading-tight text-cream md:text-3xl">
            Write the email you have been putting off since Tuesday.
          </h2>
          <Link
            to="/email"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            Open the email generator <ArrowRight className="size-4" />
          </Link>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-sand-200 bg-cream px-5 py-4 shadow-card"
            >
              <p className="font-display text-2xl text-ink">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-soft">{stat.label}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="font-display text-lg text-ink">Helpers</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="group flex flex-col rounded-2xl border border-sand-200 bg-cream p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-amber/40 hover:shadow-glow"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-amber-soft text-amber">
                    <tool.icon className="size-5" />
                  </span>
                  <span className="rounded-full bg-sand-200/70 px-2.5 py-1 text-[11px] font-medium text-ink-soft">
                    {tool.tag}
                  </span>
                </div>
                <h3 className="font-display mt-4 text-base text-ink">{tool.name}</h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-soft">{tool.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-terra">
                  Open <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <Disclaimer />
      </div>
    </AppShell>
  );
}
