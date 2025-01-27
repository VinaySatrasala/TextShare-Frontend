import { useEffect, useState } from "react";
import { Room } from "../types/room";
import axios from "axios";
import { Link } from "react-router-dom";

export const CreatedRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
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
    fetchRooms();
  }, [backendUrl]);

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
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
            >
              <Link
                to={`/room/${room.roomId}`}
                className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {room.name || `Room ${room.id}`}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Created on: {new Date().toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          You haven't created any rooms yet.
        </p>
      )}
    </div>
  );
};
