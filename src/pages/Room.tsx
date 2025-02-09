import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Copy, Trash2 } from "lucide-react"; // Importing icons from lucide-react
import { toast } from "react-hot-toast"; // For toast notifications
import RoomUsers from "../components/RoomUsers";
import { Loader } from "../components/Loader";
import { RoomResponsePopup } from "../components/RoomResponsePopup";
import { RoomDetails } from "../types/types";

export const Room = () => {
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState<RoomDetails>({
    name: "",
    roomId: "",
    adminId: 0,
    id: 0,
    users: [],
  });
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [popup, setPopup] = useState<{
    message: string;
    action?: () => void;
  } | null>(null); // Pop-up message state
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8080";
  const ws = useRef<WebSocket | null>(null);
  const [removeUser, setRemoveUser] = useState(false);
  const [removeUserId, setRemoveUserId] = useState(0);
  const [loadingRemoveUser, setLoadingRemoveUser] = useState(false);
  const [messageRemoveUser, setmessageRemoveUser] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [adminName, setAdminName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${backendUrl}/room/${roomId}`, {
          withCredentials: true,
        });
        if (res.status === 200) {
          setRoomDetails(res.data.room);
          setCurrentUserId(res.data.userId); // Assuming backend sends `currentUserId`
          setAdminName(res.data.adminName);
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
        console.log("WebSocket message received:", data);

        if (data.type === "message" && typeof data.text === "string") {
          setMessages((prev) => [...prev, data.text]);
        } else if (data.type === "error") {
          setPopup({ message: data.message || "An error occurred." ,action : () => {setPopup(null)}});
          if (data.message === "Room ID is required") {
            setPopup({
              message: "Something went wrong...",
              action: () => {
                navigate("/home"); // Redirecting to home on error
              },
            });
          } else if (data.message === "Access denied") {
            setPopup({
              message: "You don't belong to this room. Join again.",
              action: () => {
                navigate("/dashboard/home"); // Redirecting to home on access denial
              },
            });
          } else if (data.message === "Authentication required") {
            setPopup({
              message: "Please login. We couldn't authenticate you.",
              action: () => {
                navigate("/login"); // Redirecting to login on authentication failure
              },
            });
          }
        } else if (data.type === "removed") {
          setPopup({
            message: data.message,
            action: () => {
              navigate("/dashboard/home"); // Redirecting to home on removal
            },
          });
        } else if (data.type === "user_joined") {
          const joined_user = JSON.parse(data.message);
          setRoomDetails(prevDetails => ({
            ...prevDetails,
            users: [...prevDetails.users, joined_user]
          }));
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

    ws.current.addEventListener("open", onOpen);
    ws.current.addEventListener("message", onMessage);
    ws.current.addEventListener("error", onError);
    ws.current.addEventListener("close", onClose);

    return () => {
      if (ws.current) {
        ws.current.removeEventListener("open", onOpen);
        ws.current.removeEventListener("message", onMessage);
        ws.current.removeEventListener("error", onError);
        ws.current.removeEventListener("close", onClose);
        ws.current.close();
        ws.current = null;
      }
    };
  }, [roomId, wsUrl, navigate]);

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
      ws.current.send(
        JSON.stringify({ type: "message", text: newMessage, roomId })
      );
      setNewMessage("");
      setError(null);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  // Remove user from room (only for admins)
  const handleRemoveUser = async (userId: number) => {
    setRemoveUser(true);
    setRemoveUserId(userId);
  };
  const RemoveUser = async (userId: number) => {
    try {
      setLoadingRemoveUser(true);
      const res = await axios.post(
        `${backendUrl}/deleteUser`,
        {
          code: roomId,
          id: userId,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setRoomDetails((prev: any) => ({
          ...prev,
          users: prev.users.filter((user: any) => user.id !== userId),
        }));

        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(
            JSON.stringify({
              type: "removeUser",
              userId: userId,
              roomId: roomId,
            })
          );

          ws.current.onclose = () => {
            console.log(`User ${userId} connection closed`);
            setRoomDetails((prev: any) => ({
              ...prev,
              users: prev.users.filter((user: any) => user.id !== userId),
            }));
          };
        }

        setmessageRemoveUser("User Removed Successfully!");
      }
    } catch (err) {
      console.error("Error removing user:", err);
      setmessageRemoveUser("Something went wrong while removing the user...");
    } finally {
      setRemoveUser(false);
      setLoadingRemoveUser(false);
      setShowMessage(true); // Show the message after operation
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!"); // Optional toast notification
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center mt-16 w-full">
      {removeUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[500px] text-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Are you sure you want to remove this user?
            </h3>

            {loadingRemoveUser ? (
              <div className="flex justify-center py-4">
                <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
              </div>
            ) : (
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setRemoveUser(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setLoadingRemoveUser(true);
                    await RemoveUser(removeUserId);
                    setLoadingRemoveUser(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {popup && (
        <RoomResponsePopup message={popup.message} action={popup.action} />
      )}

      {/* Loader */}
      {loading && <Loader />}

      {/* Room Details and Chat */}
      {!loading && !error && (
        <div className="flex w-full max-w-7xl">
          {/* Chat Section */}
          <div className="w-3/4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                {roomDetails.name || "Loading room..."}
              </h1>
              <hr className="my-2 border-gray-300 dark:border-gray-600" />
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <h4>Room Code: {roomId}</h4>
                <h4>Admin: {adminName || "N/A"}</h4>
              </div>
            </div>
            <div className="h-96 overflow-y-auto bg-gray-100 dark:bg-gray-700 p-4 mt-4 rounded space-y-3">
              {messages.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  No messages yet.
                </p>
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
          <RoomUsers
            roomDetails={roomDetails}
            currentUserId={currentUserId}
            handleRemoveUser={handleRemoveUser}
          />
        </div>
      )}
    </div>
  );
};
