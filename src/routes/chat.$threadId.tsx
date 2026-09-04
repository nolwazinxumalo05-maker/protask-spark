import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Copy, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Disclaimer } from "@/components/AppShell";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { messageText, readThread, saveThreadMessages } from "@/lib/chat-store";

export const Route = createFileRoute("/chat/$threadId")({
  component: ChatThreadPage,
});

const STARTERS = [
  "Draft a polite nudge for an overdue client approval",
  "Help me prep three talking points for my 1:1",
  "Turn these notes into a status update for leadership",
];

function ChatThreadPage() {
  const { threadId } = Route.useParams();
  const initial = useMemo<UIMessage[]>(() => readThread(threadId)?.messages ?? [], [threadId]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return <div className="min-h-[60vh]" />;
  }

  return <ChatThread key={threadId} threadId={threadId} initial={initial} />;
}

function ChatThread({ threadId, initial }: { threadId: string; initial: UIMessage[] }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: initial,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  useEffect(() => {
    if (status === "streaming" || status === "submitted") return;
    if (messages.length === 0) return;
    saveThreadMessages(threadId, messages);
  }, [messages, status, threadId]);

  const busy = status === "submitted" || status === "streaming";

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    void sendMessage({ text: trimmed });
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-[560px] flex-col">
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<Sparkles className="size-5 text-amber" />}
              title="What are we working on?"
              description="Ask for a draft, a plan, or a second opinion. Conversations stay in this browser."
            >
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => send(starter)}
                    className="rounded-full border border-sand-200 bg-cream px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-amber/40 hover:text-ink"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((message) => {
              const text = messageText(message);
              return (
                <Message key={message.id} from={message.role}>
                  <MessageContent>
                    {message.role === "assistant" ? (
                      <MessageResponse>{text}</MessageResponse>
                    ) : (
                      <p className="whitespace-pre-wrap">{text}</p>
                    )}
                    {message.role === "assistant" && text.length > 0 && (
                      <MessageActions className="mt-2">
                        <MessageAction
                          tooltip="Copy"
                          label="Copy reply"
                          onClick={() => void navigator.clipboard.writeText(text)}
                        >
                          <Copy className="size-3.5" />
                        </MessageAction>
                      </MessageActions>
                    )}
                  </MessageContent>
                </Message>
              );
            })
          )}

          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>Thinking…</Shimmer>
              </MessageContent>
            </Message>
          )}

          {error && (
            <p className="rounded-lg border border-terra/30 bg-terra/5 px-3 py-2 text-sm text-terra">
              Something went wrong. Please send that again.
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-sand-200 bg-cream/70 px-4 py-4 md:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <PromptInput
            onSubmit={(message, event) => {
              event.preventDefault();
              send(message.text ?? input);
            }}
          >
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your assistant anything…"
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit status={status} />
            </PromptInputFooter>
          </PromptInput>
          <div className="mt-3">
            <Disclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}
