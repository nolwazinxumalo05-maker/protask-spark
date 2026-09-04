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
import { planTasks } from "@/lib/assistant.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Solstice" },
      {
        name: "description",
        content:
          "Turn a messy task list into a prioritized, time-blocked plan that fits your day.",
      },
      { property: "og:title", content: "AI Task Planner — Solstice" },
      {
        property: "og:description",
        content: "Prioritization and scheduling for your available focus hours.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

const HOURS = ["3 hours", "5 hours", "6 hours", "8 hours"] as const;
const STYLES = ["Impact first", "Urgency first", "Quick wins first", "Deep work first"] as const;

function PlannerPage() {
  const call = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState<string>(HOURS[1]);
  const [priorityStyle, setPriorityStyle] = useState<string>(STYLES[0]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (tasks.trim().length < 5) {
      setError("Add a few tasks to plan.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await call({ data: { tasks, hours, priorityStyle } });
      setText(result.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The plan could not be generated.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Planning"
        title="AI Task Planner"
        subtitle="Dump everything on your plate. Get it ranked, estimated and slotted into your day."
      />
      <div className="grid gap-6 px-6 py-8 md:px-10 lg:grid-cols-2">
        <Card title="Your tasks" subtitle="One per line, with any deadlines you know">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <Field label="Tasks">
              <textarea
                rows={10}
                value={tasks}
                placeholder={
                  "Finalize Q3 launch brief\nReview client onboarding feedback (due Wed)\nDraft weekly research digest\nBook venue for offsite"
                }
                onChange={(e) => setTasks(e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChipGroup label="Focus hours today" options={HOURS} value={hours} onChange={setHours} />
              <ChipGroup
                label="Prioritize by"
                options={STYLES}
                value={priorityStyle}
                onChange={setPriorityStyle}
              />
            </div>
            <GenerateButton loading={loading} label="Build my plan" loadingLabel="Planning…" />
          </form>
        </Card>

        <Card
          title="Plan"
          badge={
            <span className="rounded-full bg-amber/10 px-2.5 py-1 text-[11px] font-medium text-amber">
              {loading ? "Planning" : text ? "Ready" : "Idle"}
            </span>
          }
        >
          <OutputPanel
            loading={loading}
            error={error}
            text={text}
            emptyHint="Your prioritized, time-blocked day will appear here."
            onRegenerate={text ? () => void submit() : undefined}
          />
        </Card>
      </div>
    </AppShell>
  );
}
