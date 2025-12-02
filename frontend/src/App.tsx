import { useState } from "react";
import type { Message, Page, Tooltip } from "./types";
import { BACKEND_URL } from "./utils/constants";
import { usePageData } from "./hooks/usePageData";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ChatView } from "./components/ChatView";
import { ListView } from "./components/ListView";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
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
    chatHistory,
    people,
    places,
    birthdays,
    isLoading,
    fetchPageData,
  } = usePageData();

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const textToSend = input.trim();
    setInput("");

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
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
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error sending chat request:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Error contacting backend server.",
          timestamp: new Date(),
        },
      ]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  function newChat() {
    setMessages([]);
    setInput("");
    handleNavigation("chat");
  }

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
    setMessages([]);
    setInput("");

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

  return (
    <div className="h-screen flex bg-white">
      <Sidebar
        isOpen={sidebarOpen}
        currentPage={currentPage}
        tooltip={tooltip}
        onToggleSidebar={() => setSidebarOpen((s) => !s)}
        onNewChat={newChat}
        onNavigation={handleNavigation}
        onShowTooltip={showTooltip}
        onHideTooltip={hideTooltip}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          currentPage={currentPage}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {currentPage === "chat" ? (
          <ChatView
            messages={messages}
            input={input}
            onInputChange={setInput}
            onSendMessage={sendMessage}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <>
            <section className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4 bg-gradient-to-b from-blue-50/30 to-white">
              <ListView
                page={currentPage}
                isLoading={isLoading}
                memories={memories}
                chatHistory={chatHistory}
                people={people}
                places={places}
                birthdays={birthdays}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
