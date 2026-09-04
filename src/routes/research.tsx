import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import {
  Card,
  ChipGroup,
  Field,
  GenerateButton,
  OutputPanel,
  inputClass,
} from "@/components/ToolWorkspace";
import { researchBrief } from "@/lib/assistant.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Solstice" },
      {
        name: "description",
        content:
          "Get a structured briefing on any work topic: insights, trade-offs and open questions.",
      },
      { property: "og:title", content: "AI Research Assistant — Solstice" },
      {
        property: "og:description",
        content: "Insights and summaries written for the audience you choose.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Quick scan", "Working brief", "Deep dive"] as const;
const AUDIENCES = ["Yourself", "Your team", "Leadership", "A client"] as const;

function ResearchPage() {
  const call = useServerFn(researchBrief);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<string>(DEPTHS[1]);
  const [audience, setAudience] = useState<string>(AUDIENCES[1]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (topic.trim().length < 3) {
      setError("What should I look into?");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await call({ data: { topic, depth, audience } });
      setText(result.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The briefing could not be generated.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Research"
        title="AI Research Assistant"
        subtitle="Ask about a market, tool or decision. Get a briefing you can act on, with what to verify."
      />
      <div className="grid gap-6 px-6 py-8 md:px-10 lg:grid-cols-2">
        <Card title="Question" subtitle="Insights, trade-offs and open questions">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <Field label="Topic or question">
              <textarea
                rows={4}
                value={topic}
                placeholder="How are mid-market SaaS teams handling onboarding automation in 2026?"
                onChange={(e) => setTopic(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChipGroup label="Depth" options={DEPTHS} value={depth} onChange={setDepth} />
              <ChipGroup
                label="Written for"
                options={AUDIENCES}
                value={audience}
                onChange={setAudience}
              />
            </div>
            <GenerateButton loading={loading} label="Brief me" loadingLabel="Researching…" />
          </form>
        </Card>

        <Card
          title="Briefing"
          badge={
            <span className="rounded-full bg-amber/10 px-2.5 py-1 text-[11px] font-medium text-amber">
              {loading ? "Researching" : text ? "Ready" : "Idle"}
            </span>
          }
        >
          <OutputPanel
            loading={loading}
            error={error}
            text={text}
            emptyHint="Your briefing will appear here."
            onRegenerate={text ? () => void submit() : undefined}
          />
        </Card>
      </div>
    </AppShell>
  );
}
