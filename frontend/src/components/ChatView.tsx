import { useEffect, useRef } from "react";
import {
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import type { Message } from "../types";

interface ChatViewProps {
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function ChatView({
  messages,
  input,
  onInputChange,
  onSendMessage,
  onKeyDown,
}: ChatViewProps) {
  const messagesRef = useRef<HTMLDivElement | null>(null);

  function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Auto-scroll to latest message
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    try {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } catch (e) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Messages Area */}
      <section
        ref={messagesRef}
        className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 bg-gradient-to-b from-blue-50/30 to-white"
        id="messages"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            } gap-3 min-w-0`}
          >
            {/* Avatar - Assistant on left */}
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
              </div>
            )}

            {/* Message Group */}
            <div
              className={`flex flex-col min-w-0 ${
                m.role === "user" ? "items-end" : "items-start"
              } gap-1`}
            >
              <div
                className={`inline-block max-w-[80ch] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm border border-gray-200"
                }`}
              >
                {m.content}
              </div>
              <span className="text-xs text-gray-400">
                {formatTime(m.timestamp)}
              </span>
            </div>

            {/* Avatar - User on right */}
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                <UserCircleIcon className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <ChatBubbleOvalLeftEllipsisIcon className="w-12 h-12 text-gray-400" />
            <p className="text-center text-gray-400 text-sm">
              Start a conversation...
            </p>
            <p className="text-center text-gray-300 text-xs max-w-xs">
              Try asking me to remember something, like "Remember that my
              birthday is on March 15th"
            </p>
          </div>
        )}
      </section>

      {/* Input Bar */}
      <div className="p-4 flex items-center gap-3 bg-white border-t border-gray-200">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message…"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-gray-800 text-sm outline-none border border-gray-300 focus:border-blue-500 focus:bg-white transition-colors placeholder:text-gray-400"
        />

        <button
          onClick={onSendMessage}
          className="px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
        >
          <PaperAirplaneIcon className="w-4 h-4 rotate-45" />
          <span>Send</span>
        </button>
      </div>
    </>
  );
}
