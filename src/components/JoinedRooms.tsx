import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Room {
  id: number;
  name: string;
  roomId: string;
  adminId: number;
}

const JoinedRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchJoinedRooms = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${backendUrl}/joinedRooms`, {
          withCredentials: true,
        });
        setRooms(res.data || []);
      } catch (err) {
        setError("Failed to fetch joined rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedRooms();
  }, [backendUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-white dark:bg-gray-900 transition-all duration-300">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Joined Rooms
      </h1>

      {loading && (
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {rooms.length > 0 ? (
        <ul className="mt-4 space-y-4 w-full max-w-md">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="p-4 rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-white transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-700 flex flex-col items-start"
            >
              <Link
                to={`/room/${room.roomId}`}
                className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {room.name || `Room ${room.id}`}
              </Link>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Room ID: {room.roomId}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Admin ID: {room.adminId}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        !loading && (
          <p className="text-gray-600 dark:text-gray-400">
            No rooms joined yet.
          </p>
        )
      )}
    </div>
  );
};

export default JoinedRooms;
