import { useState, useRef, useEffect } from "react";
import type { Message } from "../types";
import { ChatBubble } from "./ChatBubble";
import { Send } from "lucide-react";

interface MessagingPanelProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function MessagingPanel({
  messages,
  onSendMessage,
}: MessagingPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    onSendMessage(inputValue.trim());
    setInputValue("");
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div
        className="bg-white rounded-xl border overflow-hidden flex flex-col"
        style={{ height: "calc(100vh - 250px)" }}
      >
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Chưa có tin nhắn nào</p>
              <p className="text-sm mt-2">Gửi tin nhắn đầu tiên của bạn!</p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-gray-50 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập tin nhắn của bạn..."
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
