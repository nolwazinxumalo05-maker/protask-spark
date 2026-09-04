import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import mark from "@/assets/solstice-mark.png";
import { createThread, readThreads } from "@/lib/chat-store";

export const Route = createFileRoute("/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    const existing = readThreads();
    const target = existing[0] ?? createThread();
    void navigate({ to: "/chat/$threadId", params: { threadId: target.id }, replace: true });
  }, [navigate]);

  return (
    <div className="grid min-h-[60vh] place-items-center px-6 py-16 text-center">
      <div>
        <img
          src={mark}
          alt="Solstice"
          width={512}
          height={512}
          loading="lazy"
          className="mx-auto size-12 object-contain"
        />
        <p className="mt-4 text-sm text-ink-soft">Opening your conversation…</p>
      </div>
    </div>
  );
}
