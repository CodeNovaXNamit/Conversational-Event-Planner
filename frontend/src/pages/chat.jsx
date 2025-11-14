import { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  async function sendMessage() {
    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message,
        conversationId: null,
      });

      setReply(res.data.reply);
    } catch (err) {
      console.error(err);
      setReply("Error talking to AI");
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Conversational Event Planner
      </h1>

      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border rounded px-4 py-2 w-full mb-4"
      />

      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send
      </button>

      {reply && (
        <p className="mt-4 p-4 bg-white shadow rounded">{reply}</p>
      )}
    </div>
  );
}
