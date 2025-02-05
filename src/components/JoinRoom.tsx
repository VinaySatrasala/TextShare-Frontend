import axios from "axios";
import { useState } from "react";

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setModalMessage({ text: "Please enter a room code.", type: "error" });
      return;
    }

    setLoading(true);
    setModalMessage(null);

    try {
      const res = await axios.post(`${backendUrl}/joinRoom`, { code: roomCode }, { withCredentials: true });

      setModalMessage({ text: res.data.message, type: "success" });
    } catch (err) {
      setModalMessage({ text: "Failed to join room. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* App Title & Description */}
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Welcome to TextShare</h1>
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
          className="w-full p-3 text-lg border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          onClick={handleJoinRoom}
          disabled={loading}
          className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-gray-700 dark:to-gray-900 text-white font-bold rounded-lg hover:opacity-90 transition flex justify-center items-center"
        >
          {loading ? <span className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></span> : "Join Room"}
        </button>
      </div>

      {/* Modal Popup */}
      {modalMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h3 className={`text-lg font-bold ${modalMessage.type === "success" ? "text-green-500" : "text-red-500"}`}>
              {modalMessage.type === "success" ? "Success" : "Error"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{modalMessage.text}</p>
            <button
              onClick={() => setModalMessage(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinRoom;
