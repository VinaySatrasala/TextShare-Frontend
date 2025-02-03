import { useEffect, useState } from "react";
import { Room } from "../types/room";
import axios from "axios";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

export const CreatedRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchRooms();
  }, [backendUrl]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/createdRooms`, { withCredentials: true });
      if (res.status === 200) {
        setRooms(res.data);
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteRoomId) return;

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      const res = await axios.post(
        `${backendUrl}/deleteRoom`,
        { code: deleteRoomId },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setRooms((prev) => prev.filter((room) => room.roomId !== deleteRoomId));
        setDeleteRoomId(null);
      } else {
        setDeleteError(res.data.message || "Failed to delete room.");
      }
    } catch (err) {
      setDeleteError("An error occurred while deleting the room.");
      console.error("Error deleting room:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        View Created Rooms
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Below is a list of rooms you have created. Click on a room to view its details.
      </p>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
        </div>
      ) : rooms.length > 0 ? (
        <ul className="space-y-4">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow flex justify-between items-center"
            >
              <div>
                <Link
                  to={`/room/${room.roomId}`}
                  className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {room.name || `Room ${room.id}`}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Admin : {new Date().toLocaleString()}
                </p>
              </div>

              {/* Delete Icon */}
              <button
                onClick={() => setDeleteRoomId(room.roomId)}
                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
                aria-label="Delete room"
              >
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          You haven't created any rooms yet.
        </p>
      )}

      {/* Delete Confirmation Modal */}
      {deleteRoomId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Are you sure?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              This action cannot be undone.
            </p>

            {deleteError && (
              <p className="text-red-500 dark:text-red-400 mt-2">{deleteError}</p>
            )}

            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setDeleteRoomId(null)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  deleteLoading
                    ? "bg-red-400 dark:bg-red-300 cursor-not-allowed"
                    : "bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-400"
                }`}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mx-auto"></div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
