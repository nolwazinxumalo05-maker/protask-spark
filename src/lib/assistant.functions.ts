import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import {
  createLovableAiGatewayProvider,
  requireLovableApiKey,
  WORKPLACE_MODEL,
} from "./ai-gateway.server";
import {
  emailPrompt,
  notesPrompt,
  plannerPrompt,
  researchPrompt,
} from "./prompts";

async function run(system: string, prompt: string) {
  const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
  const result = streamText({
    model: gateway(WORKPLACE_MODEL),
    system,
    prompt,
  });
  const text = await result.text;
  return { text };
}

const emailSchema = z.object({
  goal: z.string().min(3),
  audience: z.string().min(1),
  tone: z.string().min(1),
  length: z.string().min(1),
  context: z.string().optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => emailSchema.parse(input))
  .handler(async ({ data }) => {
    const { system, prompt } = emailPrompt(data);
    return run(system, prompt);
  });

const notesSchema = z.object({
  notes: z.string().min(10),
  meetingType: z.string().min(1),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => notesSchema.parse(input))
  .handler(async ({ data }) => {
    const { system, prompt } = notesPrompt(data);
    return run(system, prompt);
  });

const plannerSchema = z.object({
  tasks: z.string().min(5),
  hours: z.string().min(1),
  priorityStyle: z.string().min(1),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => plannerSchema.parse(input))
  .handler(async ({ data }) => {
    const { system, prompt } = plannerPrompt(data);
    return run(system, prompt);
  });

const researchSchema = z.object({
  topic: z.string().min(3),
  depth: z.string().min(1),
  audience: z.string().min(1),
});

export const researchBrief = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => researchSchema.parse(input))
  .handler(async ({ data }) => {
    const { system, prompt } = researchPrompt(data);
    return run(system, prompt);
  });
