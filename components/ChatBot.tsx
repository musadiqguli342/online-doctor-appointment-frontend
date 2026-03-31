"use client";

import { useState, useRef, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello 👋 Ask me about doctors or appointments" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, ...data.messages]);
    } catch (err) {
      setMessages(prev => [...prev, { from: "bot", text: "Server error 😢" }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-primary rounded-circle position-fixed shadow"
        style={{ bottom: 20, right: 20, width: 60, height: 60 }}
      >
        💬
      </button>

      {open && (
        <div
          className="card position-fixed shadow"
          style={{ bottom: 90, right: 20, width: 350, maxHeight: 400 }}
        >
          <div className="card-header bg-primary text-white fw-bold">Doctor Assistant</div>

          <div className="card-body overflow-auto" style={{ height: 300 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`d-flex flex-column mb-2 ${m.from === "user" ? "align-items-end" : "align-items-start"}`}
              >
                {m.text.split("\n").map((line, idx) => (
                  <span
                    key={idx}
                    className={`badge mb-1 ${m.from === "user" ? "bg-primary" : "bg-secondary"}`}
                    style={{ maxWidth: "100%", whiteSpace: "pre-wrap" }}
                  >
                    {line}
                  </span>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="card-footer d-flex gap-2">
            <input
              type="text"
              className="form-control"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={handleKeyPress}
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
