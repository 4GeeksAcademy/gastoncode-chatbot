import { NextResponse } from "next/server";

type InputMessage = { role: "user" | "assistant"; content: string };

type Usage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

function estimateTokens(text: string) {
  // estimación simple para fallback local
  return Math.max(1, Math.ceil(text.length / 4));
}

function fallbackReply(text: string) {
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

function buildFallbackResponse(userText: string) {
  const reply = fallbackReply(userText);
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
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const userText = [...messages].reverse().find((m) => m.role === "user")?.content?.trim() || "";

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json(buildFallbackResponse(userText));

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature: 0.7,
      }),
    });

    if (!response.ok) return NextResponse.json(buildFallbackResponse(userText));

    const data = (await response.json()) as {
      model?: string;
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      };
      choices?: Array<{ message?: { content?: string } }>;
    };

    const reply = data.choices?.[0]?.message?.content?.trim() || fallbackReply(userText);

    const promptTokens = data.usage?.prompt_tokens ?? estimateTokens(userText);
    const completionTokens = data.usage?.completion_tokens ?? estimateTokens(reply);
    const totalTokens = data.usage?.total_tokens ?? promptTokens + completionTokens;

    return NextResponse.json({
      reply,
      model: data.model ?? (process.env.OPENAI_MODEL ?? "gpt-4o-mini"),
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
      } satisfies Usage,
    });
  } catch {
    return NextResponse.json(buildFallbackResponse(""), { status: 200 });
  }
}