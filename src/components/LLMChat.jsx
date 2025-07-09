import React, { useState, useRef, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000/chat";

const LLMChat = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm StockGPT, your AI finance and stock expert. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    setError(null);
    const userMessage = { role: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation: newMessages }),
      });
      const data = await res.json();
      if (!res.ok || !data.response) throw new Error(data.detail || "No response from LLM");
      setMessages((prev) => [...prev, { role: "assistant", text: data.response }]);
    } catch (err) {
      setError("Error: Unable to get a response from StockGPT.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto ">
      {/* Chat history */}
      <div className="flex-1 overflow-y-auto m-4 p-6 space-y-4 bg-gray-800 rounded-xl">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg text-sm whitespace-pre-line shadow-md text-left
                ${msg.role === "user"
                  ? "bg-gray-700 text-gray-100 self-end"
                  : "bg-gray-900 text-blue-200 self-start"}
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      {/* Error */}
      {error && <div className="text-red-400 text-xs px-6 pb-2">{error}</div>}
      {/* Input */}
      <form
        className="flex items-center gap-2 mb-4 mx-4 bg-gray-900 rounded-b-xl"
        onSubmit={e => { e.preventDefault(); sendMessage(); }}
      >
        <textarea
          className="flex-1 resize-none bg-gray-800 text-gray-100 rounded p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !input.trim()}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default LLMChat; 