import React, { useState, useEffect, useRef } from "react";
import { FaPhone, FaFacebookMessenger, FaArrowUp, FaRobot } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { OpenAI } from "openai";
import { OPENAI_API_KEY } from "../config/ai";

const getOpenAIClient = () => {
  if (!OPENAI_API_KEY) {
    console.warn("Missing OpenAI API key. Set REACT_APP_OPENAI_KEY in your .env file.");
    return null;
  }

  return new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });
};

const Icon: React.FC<{ icon: any; className?: string }> = ({ icon: I, className }) => (
  <I className={className} />
);

interface Message {
  role: "user" | "assistant";
  content: string;
}

const FloatingActionButtons: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showChatAI, setShowChatAI] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Xin chào! Mình là trợ lý AI, bạn cần hỗ trợ gì hôm nay? 😊" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    const openai = getOpenAIClient();
    if (!openai) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Hệ thống AI chưa được cấu hình API key. Vui lòng liên hệ quản trị viên để bật tính năng này.",
        },
      ]);
      return;
    }

    setLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // rẻ nhất + nhanh nhất 2025
        messages: [
          { role: "system", content: "Bạn là trợ lý mua sắm thông minh, nhiệt tình, trả lời ngắn gọn, thân thiện bằng tiếng Việt." },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
      });

      const aiReply = completion.choices[0]?.message?.content || "Xin lỗi, mình chưa hiểu...";
      setMessages(prev => [...prev, { role: "assistant", content: aiReply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Oops! Mình đang hơi mệt, thử lại sau 5s nhé 😅" }]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        {/* KHUNG CHAT AI */}
        {showChatAI && (
          <div className="absolute bottom-20 right-0 w-80 md:w-96 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon icon={FaRobot} className="text-2xl" />
                <div>
                  <p className="font-bold">Trợ lý AI</p>
                  <p className="text-xs opacity-90">Đang online • Trả lời ngay</p>
                </div>
              </div>
              <button onClick={() => setShowChatAI(false)} className="text-white hover:bg-white/20 rounded-full p-1 text-2xl">
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-white border"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border px-4 py-3 rounded-2xl text-sm">
                    <span className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 rounded-full hover:opacity-90 disabled:opacity-50"
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NÚT CHAT AI */}
        <button
          onClick={() => setShowChatAI(!showChatAI)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl transition-all hover:scale-110"
        >
          <Icon icon={FaRobot} className="text-3xl" />
          <span className="absolute right-full mr-3 whitespace-nowrap rounded bg-black px-3 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
            Chat với AI
          </span>
        </button>

        {/* Hotline */}
        <a href="tel:0903073939" className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl transition-all hover:scale-110 hover:bg-red-700">
          <Icon icon={FaPhone} className="text-2xl" />
          <span className="absolute right-full mr-3 whitespace-nowrap rounded bg-black px-3 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
            Gọi 09.0307.3939
          </span>
        </a>

        {/* Zalo */}
        <a href="https://zalo.me/0903073939" target="_blank" rel="noopener noreferrer" className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition-all hover:scale-110 hover:bg-blue-700">
          <Icon icon={SiZalo} className="text-4xl" />
          <span className="absolute right-full mr-3 whitespace-nowrap rounded bg-black px-3 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
            Chat qua Zalo
          </span>
        </a>

        {/* Messenger */}
        <a href="https://m.me/your_fanpage_id" target="_blank" rel="noopener noreferrer" className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0084ff] text-white shadow-2xl transition-all hover:scale-110 hover:bg-[#0066cc]">
          <Icon icon={FaFacebookMessenger} className="text-3xl" />
          <span className="absolute right-full mr-3 whitespace-nowrap rounded bg-black px-3 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
            Chat Messenger
          </span>
        </a>

        {/* Lên đầu trang */}
        <button
          onClick={scrollToTop}
          className={`group relative flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 text-white shadow-2xl transition-all hover:scale-110 hover:bg-gray-900 ${
            showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Icon icon={FaArrowUp} className="text-2xl" />
          <span className="absolute right-full mr-3 whitespace-nowrap rounded bg-black px-3 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
            Lên đầu trang
          </span>
        </button>
      </div>
    </>
  );
};

export default FloatingActionButtons;