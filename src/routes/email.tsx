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
import { generateEmail } from "@/lib/assistant.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Solstice" },
      {
        name: "description",
        content:
          "Draft professional work emails tuned to your audience, tone and length in seconds.",
      },
      { property: "og:title", content: "Smart Email Generator — Solstice" },
      {
        property: "og:description",
        content: "Tone and audience-aware email drafting for busy professionals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const AUDIENCES = ["Client", "Internal team", "Executive", "New prospect", "Vendor"] as const;
const TONES = ["Warm", "Formal", "Confident", "Diplomatic", "Direct"] as const;
const LENGTHS = ["Short (60 words)", "Standard (120 words)", "Detailed (200 words)"] as const;

function EmailPage() {
  const call = useServerFn(generateEmail);
  const [goal, setGoal] = useState(
    "Summarize our Q3 launch progress for the client and confirm the revised timeline.",
  );
  const [context, setContext] = useState("");
  const [audience, setAudience] = useState<string>(AUDIENCES[0]);
  const [tone, setTone] = useState<string>(TONES[0]);
  const [length, setLength] = useState<string>(LENGTHS[1]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (goal.trim().length < 3) {
      setError("Tell me what the email should achieve.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await call({ data: { goal, audience, tone, length, context } });
      setText(result.text);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "The draft could not be generated. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Writing"
        title="Smart Email Generator"
        subtitle="Say what the email needs to do. Pick the audience and tone, and get a send-ready draft."
      />
      <div className="grid gap-6 px-6 py-8 md:px-10 lg:grid-cols-2">
        <Card title="Brief" subtitle="Tone & audience-aware drafting">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <Field label="What should this email do?">
              <textarea
                rows={3}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChipGroup
                label="Audience"
                options={AUDIENCES}
                value={audience}
                onChange={setAudience}
              />
              <ChipGroup label="Tone" options={TONES} value={tone} onChange={setTone} />
            </div>
            <ChipGroup label="Length" options={LENGTHS} value={length} onChange={setLength} />
            <Field label="Extra context (optional)">
              <textarea
                rows={3}
                value={context}
                placeholder="Names, dates, numbers or the message you're replying to…"
                onChange={(e) => setContext(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </Field>
            <GenerateButton loading={loading} label="Generate draft" loadingLabel="Drafting…" />
          </form>
        </Card>

        <Card
          title="Draft"
          badge={
            <span className="rounded-full bg-amber/10 px-2.5 py-1 text-[11px] font-medium text-amber">
              {loading ? "Drafting" : text ? "Ready" : "Idle"}
            </span>
          }
        >
          <OutputPanel
            loading={loading}
            error={error}
            text={text}
            emptyHint="Your draft will appear here."
            onRegenerate={text ? () => void submit() : undefined}
          />
        </Card>
      </div>
    </AppShell>
  );
}
