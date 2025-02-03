import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Room = () => {
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState<any>({});
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${backendUrl}/room/${roomId}`, {
          withCredentials: true,
        });
        if (res.status === 200) {
          setRoomDetails(res.data);
        }
      } catch (err) {
        setError("Failed to fetch room details. Please try again later.");
        console.error("Error fetching room details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId, backendUrl]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, newMessage]);
    setNewMessage("");
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center mt-16">
      {/* Room Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Room: {roomDetails.name || "Unknown"}</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Room ID: <span className="font-semibold text-gray-800 dark:text-gray-200">{roomId}</span>
        </p>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Admin ID: <span className="font-semibold">{roomDetails.adminId || "N/A"}</span>
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 mt-6">Loading room details...</p>
      ) : error ? (
        <p className="text-red-500 mt-6">{error}</p>
      ) : (
        <div className="w-full max-w-2xl mt-6">
          {/* Message Display Box */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg h-96 overflow-y-auto flex flex-col gap-2">
            {messages.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className="p-2 rounded-md text-white bg-blue-500 dark:bg-gray-700 self-start w-fit"
                >
                  {msg}
                </div>
              ))
            )}
          </div>

          {/* Input Box for Sending Messages */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-gray-700 dark:to-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
