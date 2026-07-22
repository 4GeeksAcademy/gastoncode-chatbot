import { NextResponse } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

type InputMessage = { role: "user" | "assistant"; content: string };
type ModelMessage = InputMessage | { role: "system"; content: string };

type Usage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

const KNOWLEDGE_FILE_PATH = path.join(process.cwd(), "conocimiento", "conocimiento.txt");

let knowledgeCache: string | null = null;
let knowledgeCacheMtimeMs = -1;

const BASE_SYSTEM_PROMPT =
  "Eres el asistente de GastonCode. Responde en espanol, con claridad y precision. Si el usuario pregunta por informacion del negocio o reglas operativas, prioriza el documento de conocimiento cargado. Si no hay datos suficientes en ese documento, dilo explicitamente y pide el dato faltante.";

async function loadKnowledgeText() {
  try {
    const fileStat = await stat(KNOWLEDGE_FILE_PATH);
    if (fileStat.mtimeMs === knowledgeCacheMtimeMs) return knowledgeCache;

    const raw = await readFile(KNOWLEDGE_FILE_PATH, "utf8");
    const text = raw.trim();
    knowledgeCacheMtimeMs = fileStat.mtimeMs;
    knowledgeCache = text.length > 0 ? text : null;
  } catch {
    knowledgeCacheMtimeMs = -1;
    knowledgeCache = null;
  }

  return knowledgeCache;
}

async function buildModelMessages(messages: InputMessage[]) {
  const modelMessages: ModelMessage[] = [{ role: "system", content: BASE_SYSTEM_PROMPT }, ...messages];

  const knowledgeText = await loadKnowledgeText();
  if (knowledgeText) {
    modelMessages.splice(1, 0, {
      role: "system",
      content:
        "Documento de conocimiento (fuente de verdad institucional). Prioriza esta informacion para responder consultas del liceo:\n\n" +
        knowledgeText,
    });
  }

  return modelMessages;
}

function estimateTokens(text: string) {
  // estimación simple para fallback local
  return Math.max(1, Math.ceil(text.length / 4));
}

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getKnowledgeBasedFallback(query: string, knowledgeText: string) {
  const normalizedQuery = normalizeText(query);
  const queryTerms = normalizedQuery
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length >= 3)
    .slice(0, 15);

  const lines = knowledgeText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && (line.startsWith("-") || line.includes(":")));

  const scored = lines
    .map((line) => {
      const normalizedLine = normalizeText(line);
      const overlap = queryTerms.reduce((sum, term) => {
        return sum + (normalizedLine.includes(term) ? 1 : 0);
      }, 0);

      const keywordBoost =
        (normalizedQuery.includes("telefono") && normalizedLine.includes("telefono") ? 2 : 0) +
        (normalizedQuery.includes("correo") && normalizedLine.includes("correo") ? 2 : 0) +
        (normalizedQuery.includes("direccion") && normalizedLine.includes("direccion") ? 2 : 0) +
        (normalizedQuery.includes("horario") && normalizedLine.includes("horario") ? 2 : 0) +
        (normalizedQuery.includes("turno") && normalizedLine.includes("turno") ? 2 : 0) +
        (normalizedQuery.includes("profesor") && normalizedLine.includes("prof") ? 2 : 0);

      return { line, score: overlap + keywordBoost };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  if (scored.length === 0) return null;

  return `Segun la base de conocimiento:\n${scored.map((entry) => entry.line).join("\n")}`;
}

function fallbackReply(text: string, knowledgeText: string | null) {
  if (knowledgeText) {
    const knowledgeAnswer = getKnowledgeBasedFallback(text, knowledgeText);
    if (knowledgeAnswer) return knowledgeAnswer;
  }

  const t = text.toLowerCase();

  if (t.includes("next") || t.includes("react")) {
    return "Puedes empezar con componentes reutilizables, rutas claras y estado local para el MVP.";
  }
  if (t.includes("typescript") || t.includes("ts")) {
    return "Tipa interfaces primero y usa `strict` para detectar errores temprano.";
  }
  if (t.includes("tailwind")) {
    return "Define estructura base con `flex/grid` y tokens de color consistentes.";
  }

  return "Entendido. Dame más contexto y te respondo con mayor precisión.";
}

function buildFallbackResponse(userText: string, knowledgeText: string | null) {
  const reply = fallbackReply(userText, knowledgeText);
  const promptTokens = estimateTokens(userText);
  const completionTokens = estimateTokens(reply);

  return {
    reply,
    model: "fallback-local",
    usage: {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    } satisfies Usage,
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: InputMessage[] };
    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m): m is InputMessage => {
        return (m.role === "user" || m.role === "assistant") && typeof m.content === "string";
      })
      .map((m) => ({ role: m.role, content: m.content }));
    const userText = [...messages].reverse().find((m) => m.role === "user")?.content?.trim() || "";
    const knowledgeText = await loadKnowledgeText();
    const modelMessages = await buildModelMessages(messages);

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json(buildFallbackResponse(userText, knowledgeText));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.1-8b-instant",
        messages: modelMessages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) return NextResponse.json(buildFallbackResponse(userText, knowledgeText));

    const data = (await response.json()) as {
      model?: string;
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      };
      choices?: Array<{ message?: { content?: string } }>;
    };

    const reply =
      data.choices?.[0]?.message?.content?.trim() || fallbackReply(userText, knowledgeText);

    const promptTokens = data.usage?.prompt_tokens ?? estimateTokens(userText);
    const completionTokens = data.usage?.completion_tokens ?? estimateTokens(reply);
    const totalTokens = data.usage?.total_tokens ?? promptTokens + completionTokens;

    return NextResponse.json({
      reply,
      model: data.model ?? (process.env.GROQ_MODEL ?? "llama-3.1-8b-instant"),
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
      } satisfies Usage,
    });
  } catch {
    return NextResponse.json(buildFallbackResponse("", null), { status: 200 });
  }
}