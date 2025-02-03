import axios from "axios";
import { useState } from "react";

const Home = () => {
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setMessage({ text: "Please enter a room code.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(`${backendUrl}/joinRoom`, { code: roomCode } ,{withCredentials: true });

      if (res.status === 200) {
        setMessage({ text: res.data.message, type: "success" });
      } else {
        setMessage({ text: res.data.message, type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Failed to join room. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* App Title & Description */}
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to TextShare
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl">
        Share important messages in a structured way. Admins control the content, and users can access messages in real-time.
      </p>

      {/* Room Code Input */}
      <div className="mt-8 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="w-full p-3 text-lg border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring focus:ring-gray-500"
        />
        <button
          onClick={handleJoinRoom}
          disabled={loading}
          className="mt-4 w-full p-3 text-lg font-semibold rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Joining..." : "Join Room"}
        </button>

        {/* Messages */}
        {message && (
          <p className={`mt-4 text-${message.type === "success" ? "green" : "red"}-500`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
