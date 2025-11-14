import { useState, useRef, useEffect } from "react";
import axios from "axios";

function EventCard({ event }) {
  if (!event) return null;

  return (
    <div className="bg-green-100 border-l-4 border-green-500 rounded-xl p-4 shadow animate-fadeIn max-w-xl mr-auto">
      <h3 className="text-green-700 font-bold text-lg">🎉 Event Created!</h3>

      <div className="mt-2 text-gray-700 text-sm space-y-1">
        <p><strong>Title:</strong> {event.title}</p>
        {event.date && <p><strong>Date:</strong> {event.date}</p>}
        {event.time && <p><strong>Time:</strong> {event.time}</p>}
        {event.location && <p><strong>Location:</strong> {event.location}</p>}
        {event.guests && <p><strong>Guests:</strong> {event.guests}</p>}
        {event.budget && <p><strong>Budget:</strong> ₹{event.budget}</p>}
      </div>
    </div>
  );
}


export default function Chat() {
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: userMessage.text,
        conversationId,
      });

      setConversationId(res.data.conversationId);



      setMessages((prev) => [...prev, botMessage]);

      const botMessage = {
        sender: "bot",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (res.data.eventCreated) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "system",
            type: "event-created",
            event: res.data.event,
          },
        ]);
      }



      
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Could not contact AI" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white text-2xl font-bold shadow">
        Conversational Event Planner
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.map((msg, index) => {
          if (msg.type === "event-created") {
            return (
              <div
                key={index}
                className="mr-auto bg-green-100 border border-green-400 text-green-900 p-4 rounded-xl shadow-lg max-w-xl"
              >
                <h3 className="text-xl font-bold mb-2">✅ Event Created!</h3>
                <p><strong>Title:</strong> {msg.event.title}</p>
                <p><strong>Date:</strong> {msg.event.date}</p>
                <p><strong>Time:</strong> {msg.event.time}</p>
                <p><strong>Location:</strong> {msg.event.location}</p>
                {msg.event.guests && (
                  <p><strong>Guests:</strong> {msg.event.guests}</p>
                )}
              </div>
            );
          }

          // Default messages
          return (
            <div
              key={index}
              className={`max-w-xl px-4 py-3 rounded-2xl shadow ${
                msg.sender === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-white text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          );
        })}


        {loading && (
          <div className="mr-auto bg-white text-gray-500 px-4 py-3 rounded-2xl shadow">
            AI is typing…
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white flex items-center gap-3 shadow-lg">
        <input
          type="text"
          className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
