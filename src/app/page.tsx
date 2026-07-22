"use client";

import { useEffect, useRef, useState } from "react";
import { Composer } from "@/components/chat/Composer";
import { MessageList } from "@/components/chat/MessageList";
import { Sidebar } from "@/components/chat/Sidebar";
import { TopBar } from "@/components/chat/TopBar";
import { ChatApiResponse, ChatMessage, TokenUsage } from "@/components/chat/types";

const STORAGE_KEY = "gastoncode:chat:messages";
const SESSION_USAGE_STORAGE_KEY = "gastoncode:chat:session-usage";

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hola, soy tu asistente. ¿Qué quieres construir hoy?",
    createdAt: Date.now(),
  },
];

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const emptyUsage: TokenUsage = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
};

type SubmitEventHandler = (event: SubmitEvent) => void | Promise<void>;

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelName, setModelName] = useState("fallback-local");
  const [usage, setUsage] = useState<TokenUsage | null>(null);
  const [sessionUsage, setSessionUsage] = useState<TokenUsage>(emptyUsage);
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const skipPersistMessagesRef = useRef(true);
  const skipPersistSessionUsageRef = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMessages(parsed);
      }
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_USAGE_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<TokenUsage>;
      const promptTokens = Number(parsed.promptTokens ?? 0);
      const completionTokens = Number(parsed.completionTokens ?? 0);
      const totalTokens = Number(parsed.totalTokens ?? 0);

      if (
        Number.isFinite(promptTokens) &&
        Number.isFinite(completionTokens) &&
        Number.isFinite(totalTokens)
      ) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSessionUsage({
          promptTokens,
          completionTokens,
          totalTokens,
        });
      }
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    if (skipPersistMessagesRef.current) {
      skipPersistMessagesRef.current = false;
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // no-op
    }
  }, [messages]);

  useEffect(() => {
    if (skipPersistSessionUsageRef.current) {
      skipPersistSessionUsageRef.current = false;
      return;
    }

    try {
      localStorage.setItem(SESSION_USAGE_STORAGE_KEY, JSON.stringify(sessionUsage));
    } catch {
      // no-op
    }
  }, [sessionUsage]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const content = text.trim();
    if (!content || isLoading) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content,
      createdAt: Date.now(),
    };

    const next = [...messages, userMessage];
    const chatHistory = next.map(({ role, content }) => ({ role, content }));
    setMessages(next);
    setInput("");
    setError(null);
    setIsLoading(true);
    const startedAt = performance.now();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) {
        let details = "No se pudo obtener respuesta del servidor.";

        try {
          const errorBody = (await res.json()) as { error?: string; message?: string };
          details = errorBody.message || errorBody.error || details;
        } catch {
          // no-op: keep fallback error details when body is not JSON
        }

        throw new Error(`Error ${res.status}: ${details}`);
      }

      const data = (await res.json()) as ChatApiResponse;
      const elapsedMs = Math.round(performance.now() - startedAt);
      setResponseTimeMs(elapsedMs);

      setModelName(data.model || "fallback-local");

      const currentUsage =
        data.usage ?? {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        };

      setUsage(currentUsage);
      setSessionUsage((prev) => ({
        promptTokens: prev.promptTokens + currentUsage.promptTokens,
        completionTokens: prev.completionTokens + currentUsage.completionTokens,
        totalTokens: prev.totalTokens + currentUsage.totalTokens,
      }));

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: data.reply?.trim() || "No recibí contenido de respuesta.",
          createdAt: Date.now(),
        },
      ]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Hubo un problema al consultar la IA. Intentalo de nuevo.";

      setError(`No se pudo completar la solicitud. ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitEventHandler = async (e) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const onNewChat = () => {
    setMessages(initialMessages);
    setInput("");
    setIsLoading(false);
    setError(null);
    setUsage(null);
    setSessionUsage(emptyUsage);
    setResponseTimeMs(null);
  };

  const onClearHistory = () => {
    onNewChat();

    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_USAGE_STORAGE_KEY);
    } catch {
      // no-op
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <section className="mx-auto grid h-[90vh] max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl md:grid-cols-[320px_1fr]">
        <Sidebar
          onNewChat={onNewChat}
          onUsePrompt={sendMessage}
          usage={usage}
          sessionUsage={sessionUsage}
          responseTimeMs={responseTimeMs}
          modelName={modelName}
        />
        <div className="flex min-h-0 flex-col">
          <TopBar isLoading={isLoading} onClearHistory={onClearHistory} />
          {error && (
            <div
              className="border-b border-rose-900 bg-rose-950/50 px-4 py-2 text-sm text-rose-200 md:px-6"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}
          <MessageList messages={messages} isLoading={isLoading} endRef={endRef} />
          <Composer value={input} isLoading={isLoading} onChange={setInput} onSubmit={onSubmit} />
        </div>
      </section>
    </main>
  );
}