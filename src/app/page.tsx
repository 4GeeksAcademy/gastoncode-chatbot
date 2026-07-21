"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Composer } from "@/components/chat/Composer";
import { MessageList } from "@/components/chat/MessageList";
import { Sidebar } from "@/components/chat/Sidebar";
import { TopBar } from "@/components/chat/TopBar";
import { ChatApiResponse, ChatMessage, TokenUsage } from "@/components/chat/types";
import { UsagePanel } from "@/components/chat/UsagePanel";

const STORAGE_KEY = "gastoncode:chat:messages";

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

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modelName, setModelName] = useState("fallback-local");
  const [usage, setUsage] = useState<TokenUsage | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ChatMessage[];
      if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // no-op
    }
  }, [messages]);

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
    setMessages(next);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });

      if (!res.ok) throw new Error("API error");

      const data = (await res.json()) as ChatApiResponse;

      setModelName(data.model || "fallback-local");
      setUsage(
        data.usage ?? {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: data.reply?.trim() || "No recibí contenido de respuesta.",
          createdAt: Date.now(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: "Hubo un problema al consultar la IA. Inténtalo de nuevo.",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const onNewChat = () => {
    setMessages(initialMessages);
    setInput("");
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <section className="mx-auto grid h-[90vh] max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl md:grid-cols-[288px_1fr]">
        <Sidebar onNewChat={onNewChat} onUsePrompt={sendMessage} />
        <div className="flex min-h-0 flex-col">
          <TopBar isLoading={isLoading} onNewChat={onNewChat} modelName={modelName} />
          <UsagePanel usage={usage} />
          <MessageList messages={messages} isLoading={isLoading} endRef={endRef} />
          <Composer value={input} isLoading={isLoading} onChange={setInput} onSubmit={onSubmit} />
        </div>
      </section>
    </main>
  );
}