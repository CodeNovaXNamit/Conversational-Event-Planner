import { useState } from "react";
import axios from "axios";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/events", {
        title,
        date,
        time,
        description,
        participants: participants.split(",").map((p) => p.trim()),
      });

      setSuccess("Event created successfully!");
      setTitle("");
      setDate("");
      setTime("");
      setDescription("");
      setParticipants("");
    } catch (err) {
      setSuccess("Error creating event!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">
          Create New Event
        </h1>

        {success && (
          <div className="p-3 mb-4 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold">Event Title</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Birthday Party"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-semibold">Date</label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="flex-1">
              <label className="font-semibold">Time</label>
              <input
                type="time"
                className="w-full p-3 border rounded-lg"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold">Description</label>
            <textarea
              className="w-full p-3 border rounded-lg"
              placeholder="Event details..."
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="font-semibold">Participants (comma-separated)</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="user1@gmail.com, user2@gmail.com"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
