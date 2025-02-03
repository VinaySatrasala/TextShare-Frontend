import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Copy } from "lucide-react"; // Importing Copy icon from lucide-react
import { toast } from "react-hot-toast"; // For toast notifications (optional)

export const Room = () => {
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState<any>({});
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8080";
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${backendUrl}/room/${roomId}`, { withCredentials: true });
        if (res.status === 200) {
          setRoomDetails(res.data);
          setCurrentUserId(res.data.currentUserId); // Assuming backend sends `currentUserId`
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

  // WebSocket setup...
  useEffect(() => {
    if (!roomId) return;

    ws.current = new WebSocket(wsUrl);

    const onOpen = () => {
      console.log("Connected to WebSocket server");
      ws.current?.send(JSON.stringify({ type: "join", roomId }));
    };

    const onMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "message" && typeof data.text === "string") {
          setMessages((prev) => [...prev, data.text]);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    const onError = (err: Event) => {
      console.error("WebSocket error:", err);
      setError("Connection error. Trying to reconnect...");
    };

    const onClose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.addEventListener('open', onOpen);
    ws.current.addEventListener('message', onMessage);
    ws.current.addEventListener('error', onError);
    ws.current.addEventListener('close', onClose);

    return () => {
      if (ws.current) {
        ws.current.removeEventListener('open', onOpen);
        ws.current.removeEventListener('message', onMessage);
        ws.current.removeEventListener('error', onError);
        ws.current.removeEventListener('close', onClose);
        ws.current.close();
        ws.current = null;
      }
    };
  }, [roomId, wsUrl]);

  const handleSendMessage = () => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      setError("Not connected to the server");
      return;
    }

    if (!newMessage.trim()) {
      setError("Message cannot be empty");
      return;
    }

    try {
      ws.current.send(JSON.stringify({ type: "message", text: newMessage, roomId }));
      setNewMessage("");
      setError(null);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  // Remove user from room (only for admins)
  const handleRemoveUser = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this user?")) return;
    
    try {
      const res = await axios.delete(`${backendUrl}/room/${roomId}/user/${userId}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setRoomDetails((prev: any) => ({
          ...prev,
          users: prev.users.filter((user: any) => user.id !== userId),
        }));
      }
    } catch (err) {
      console.error("Error removing user:", err);
      setError("Failed to remove user.");
    }
  };

    // Function to copy text to clipboard
    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!"); // Optional toast notification
    };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center mt-16">
      {/* ...existing code... */}

      {!loading && !error && (
        <div className="flex w-full max-w-4xl">
          {/* Chat Section */}
          <div className="w-3/4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {roomDetails.name || "Loading room..."}
            </h1>
            <div className="h-96 overflow-y-auto bg-gray-100 dark:bg-gray-700 p-4 mt-4 rounded space-y-3">
              {messages.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center">No messages yet.</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className="relative p-3 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-gray-700 dark:to-gray-800 text-white w-fit shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {/* Copy Icon */}
                    <button
                      onClick={() => copyToClipboard(msg)}
                      className="absolute top-1 right-1 text-white opacity-70 hover:opacity-100 transition-opacity"
                      aria-label="Copy message"
                    >
                      <Copy size={16} />
                    </button>
                    {msg}
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  setError(null);
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 transition"
              >
                Send
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="w-1/4 bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-lg ml-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Users</h2>
            <ul className="space-y-2">
              {roomDetails.users?.map((user: any) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center bg-white dark:bg-gray-700 p-2 rounded"
                >
                  <span className="text-gray-900 dark:text-white">{user.name}</span>
                  {roomDetails.adminId === currentUserId && user.id !== currentUserId && (
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
