import { RefObject } from "react";
import { ChatMessage } from "./types";
import { MessageBubble } from "./MessageBubble";

type MessageListProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  endRef: RefObject<HTMLDivElement | null>;
};

export function MessageList({ messages, isLoading, endRef }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-slate-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
              <span>Pensando...</span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>
    </div>
  );
}