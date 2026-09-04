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
import { summarizeNotes } from "@/lib/assistant.functions";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Solstice" },
      {
        name: "description",
        content:
          "Turn messy meeting notes into key points, decisions, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Solstice" },
      {
        property: "og:description",
        content: "Key points, action items and deadlines extracted from your notes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NotesPage,
});

const TYPES = ["Standup", "Client call", "Project review", "1:1", "Workshop"] as const;

function NotesPage() {
  const call = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [meetingType, setMeetingType] = useState<string>(TYPES[1]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (notes.trim().length < 10) {
      setError("Paste your notes or transcript first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await call({ data: { notes, meetingType } });
      setText(result.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The summary could not be generated.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Meetings"
        title="Meeting Notes Summarizer"
        subtitle="Paste raw notes or a transcript. Get the summary, decisions, owners and deadlines."
      />
      <div className="grid gap-6 px-6 py-8 md:px-10 lg:grid-cols-2">
        <Card title="Raw notes" subtitle="Anything goes — bullets, transcript, scribbles">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <ChipGroup
              label="Meeting type"
              options={TYPES}
              value={meetingType}
              onChange={setMeetingType}
            />
            <Field label="Notes or transcript">
              <textarea
                rows={14}
                value={notes}
                placeholder="Jordan: launch slipped a week… Priya to ship beta Friday… sign-off due Jun 18…"
                onChange={(e) => setNotes(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </Field>
            <GenerateButton loading={loading} label="Summarize" loadingLabel="Summarizing…" />
          </form>
        </Card>

        <Card
          title="Summary"
          badge={
            <span className="rounded-full bg-amber/10 px-2.5 py-1 text-[11px] font-medium text-amber">
              {loading ? "Summarizing" : text ? "Ready" : "Idle"}
            </span>
          }
        >
          <OutputPanel
            loading={loading}
            error={error}
            text={text}
            emptyHint="Key points, decisions, action items and deadlines will appear here."
            onRegenerate={text ? () => void submit() : undefined}
          />
        </Card>
      </div>
    </AppShell>
  );
}
