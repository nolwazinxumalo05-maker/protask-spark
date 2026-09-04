import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { MessageSquarePlus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  createThread,
  deleteThread,
  readThreads,
  type ChatThread,
} from "@/lib/chat-store";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Solstice" },
      {
        name: "description",
        content:
          "Chat with your workplace assistant about anything, with conversations saved in your browser.",
      },
      { property: "og:title", content: "AI Chat — Solstice" },
      {
        property: "og:description",
        content: "A workplace AI chat with saved conversations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatLayout,
});

function ChatLayout() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const refresh = useCallback(() => setThreads(readThreads()), []);

  useEffect(() => {
    refresh();
  }, [refresh, pathname]);

  useEffect(() => {
    const onChange = () => refresh();
    window.addEventListener("solstice:threads", onChange);
    return () => window.removeEventListener("solstice:threads", onChange);
  }, [refresh]);

  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-0px)] flex-col lg:flex-row">
        <div className="border-b border-sand-200 bg-cream/60 p-4 lg:w-[260px] lg:shrink-0 lg:border-b-0 lg:border-r">
          <button
            type="button"
            onClick={() => {
              const thread = createThread();
              refresh();
              void navigate({ to: "/chat/$threadId", params: { threadId: thread.id } });
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-sun px-3 py-2 text-sm font-semibold text-cream shadow-glow"
          >
            <MessageSquarePlus className="size-4" /> New conversation
          </button>

          <p className="mt-5 px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft">
            Conversations
          </p>
          <ul className="mt-2 space-y-1">
            {threads.length === 0 && (
              <li className="px-1 py-2 text-xs text-ink-soft">Nothing saved yet.</li>
            )}
            {threads.map((thread) => (
              <li key={thread.id} className="group flex items-center gap-1">
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: thread.id }}
                  className="min-w-0 flex-1 truncate rounded-lg px-2.5 py-2 text-sm text-ink-soft transition-colors hover:bg-sand-200/60 data-[status=active]:bg-sand-200 data-[status=active]:font-medium data-[status=active]:text-ink"
                >
                  {thread.title}
                </Link>
                <button
                  type="button"
                  aria-label={`Delete ${thread.title}`}
                  onClick={() => {
                    deleteThread(thread.id);
                    const remaining = readThreads();
                    setThreads(remaining);
                    if (pathname.endsWith(thread.id)) void navigate({ to: "/chat" });
                  }}
                  className="grid size-7 shrink-0 place-items-center rounded-md text-ink-soft/60 transition-colors hover:bg-sand-200 hover:text-terra"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </AppShell>
  );
}
