import { useState } from "react";
import Chat from "./pages/chat";
import CreateEvent from "./pages/CreateEvent";

function App() {
  const [page, setPage] = useState("chat");

  return (
    <div>
      <div className="flex gap-4 p-4 bg-gray-200 shadow">
        <button
          className={`px-4 py-2 rounded ${
            page === "chat" ? "bg-blue-600 text-white" : "bg-white"
          }`}
          onClick={() => setPage("chat")}
        >
          Chat
        </button>

        <button
          className={`px-4 py-2 rounded ${
            page === "event" ? "bg-blue-600 text-white" : "bg-white"
          }`}
          onClick={() => setPage("event")}
        >
          Create Event
        </button>
      </div>

      {page === "chat" && <Chat />}
      {page === "event" && <CreateEvent />}
    </div>
  );
}

export default App;
