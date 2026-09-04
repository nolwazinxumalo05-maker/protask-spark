import type { UIMessage } from "ai";

export type ChatThread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const KEY = "solstice.chat.threads.v1";

const isBrowser = () => typeof window !== "undefined";

export function newThreadId() {
  return isBrowser() && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);
}

export function readThreads(): ChatThread[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatThread[];
    if (!Array.isArray(parsed)) return [];
    return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function writeThreads(threads: ChatThread[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(threads));
  } catch {
    /* storage unavailable — chat still works for this session */
  }
}

export function readThread(id: string): ChatThread | undefined {
  return readThreads().find((t) => t.id === id);
}

export function createThread(): ChatThread {
  const thread: ChatThread = {
    id: newThreadId(),
    title: "New conversation",
    updatedAt: Date.now(),
    messages: [],
  };
  writeThreads([thread, ...readThreads()]);
  return thread;
}

export function saveThreadMessages(id: string, messages: UIMessage[]) {
  const threads = readThreads();
  const existing = threads.find((t) => t.id === id);
  const title = deriveTitle(messages) ?? existing?.title ?? "New conversation";
  const updated: ChatThread = { id, title, updatedAt: Date.now(), messages };
  writeThreads([updated, ...threads.filter((t) => t.id !== id)]);
}

export function deleteThread(id: string) {
  writeThreads(readThreads().filter((t) => t.id !== id));
}

function deriveTitle(messages: UIMessage[]): string | undefined {
  const first = messages.find((m) => m.role === "user");
  if (!first) return undefined;
  const text = messageText(first).trim();
  if (!text) return undefined;
  return text.length > 48 ? `${text.slice(0, 48)}…` : text;
}

export function messageText(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
}
