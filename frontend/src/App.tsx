import { useCallback, useEffect, useRef, useState } from "react";
import type { Conversation, Message, Page, Tooltip } from "./types";
import { BACKEND_URL } from "./utils/constants";
import { usePageData } from "./hooks/usePageData";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ChatView } from "./components/ChatView";
import { ListView } from "./components/ListView";
import { Overview } from "./components/Overview";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>("chat");
  const [tooltip, setTooltip] = useState<Tooltip>({
    text: "",
    x: 0,
    y: 0,
    visible: false,
  });

  const {
    memories,
    people,
    places,
    birthdays,
    journals,
    isLoading,
    fetchPageData,
    addJournalEntry,
  } = usePageData();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const fetchMessages = useCallback(
    async (conversationId: number, opts: { silent?: boolean } = {}) => {
      if (!opts.silent) {
        setIsMessagesLoading(true);
      }
      try {
        const res = await fetch(`${BACKEND_URL}/conversations/${conversationId}/messages`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const msgs = (data.messages ?? []).map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        })) as Message[];
        setMessages(msgs);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error fetching messages:", err);
        setMessages([]);
      } finally {
        if (!opts.silent) {
          setIsMessagesLoading(false);
        }
      }
    },
    []
  );

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/conversations`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const convs: Conversation[] = data.conversations ?? [];
      setConversations(convs);

      setActiveConversationId((current) => {
        if (current && convs.some((c) => c.id === current)) {
          return current;
        }
        return convs[0]?.id ?? null;
      });

      if (!convs[0]) {
        setMessages([]);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error loading conversations:", err);
      setConversations([]);
      setActiveConversationId(null);
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!activeConversationId) return;
    void fetchMessages(activeConversationId);
  }, [activeConversationId, fetchMessages]);

  const createConversation = useCallback(async (title?: string) => {
    const res = await fetch(`${BACKEND_URL}/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(title ? { title } : {}),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
    }

    const conv: Conversation = await res.json();
    setConversations((prev) => [conv, ...prev]);
    setActiveConversationId(conv.id);
    return conv;
  }, []);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    let conversationId = activeConversationId;
    if (!conversationId) {
      try {
        const conv = await createConversation();
        conversationId = conv.id;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error creating conversation:", err);
        setIsSending(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            role: "assistant",
            content: "Couldn't start a new conversation. Please try again.",
            timestamp: new Date().toISOString(),
          },
        ]);
        return;
      }
    }

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, conversation_id: conversationId }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
      }

      const data = await res.json();

      const botMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
      await fetchMessages(conversationId, { silent: true });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error sending chat request:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Error contacting backend server.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !isSending) {
      sendMessage();
    }
  }

  // Continuous chat: do not clear messages when navigating back to chat

  function showTooltip(
    text: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    if (sidebarOpen) return; // Only show tooltips when collapsed
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      text,
      x: rect.right + 8,
      y: rect.top + rect.height / 2,
      visible: true,
    });
  }

  function hideTooltip() {
    setTooltip((prev) => ({ ...prev, visible: false }));
  }

  async function handleNavigation(page: Page) {
    setCurrentPage(page);

    try {
      await fetchPageData(page);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error fetching data:", err);
    }

    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }

  function handleSelectConversation(conversationId: number) {
    setActiveConversationId(conversationId);
  }

  async function handleNewConversation() {
    try {
      await createConversation();
      setMessages([]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error starting new conversation:", err);
    }
  }

  return (
    <div className="h-screen flex bg-white">
      <Sidebar
        isOpen={sidebarOpen}
        currentPage={currentPage}
        tooltip={tooltip}
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
        onNavigation={handleNavigation}
        onShowTooltip={showTooltip}
        onHideTooltip={hideTooltip}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          currentPage={currentPage}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {currentPage === "overview" ? (
          <Overview />
        ) : currentPage === "chat" ? (
          <ChatView
            messages={messages}
            conversations={conversations}
            activeConversationId={activeConversationId}
            isLoadingMessages={isMessagesLoading}
            isSending={isSending}
            input={input}
            onInputChange={setInput}
            onSendMessage={sendMessage}
            onKeyDown={handleKeyDown}
            inputRef={inputRef}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
          />
        ) : (
          <>
            <section className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 bg-gradient-to-b from-blue-50/30 to-white">
              <ListView
                page={currentPage}
                isLoading={isLoading}
                memories={memories}
                people={people}
                places={places}
                birthdays={birthdays}
                journals={journals}
                onAddJournal={addJournalEntry}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
