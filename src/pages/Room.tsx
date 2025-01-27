import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Room = () => {
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState<any>({});
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

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Room Details</h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        Welcome to Room <span className="font-semibold text-gray-800 dark:text-gray-200">{roomId}</span>!
      </p>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 mt-4">Loading room details...</p>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Room Information</h2>
          <ul className="mt-4 space-y-2">
            <li className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Name:</span> {roomDetails.name || "N/A"}
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Description:</span> {roomDetails.description || "No description available"}
            </li>
            <li className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Created At:</span> {roomDetails.createdAt || "Unknown"}
            </li>
            {JSON.stringify(roomDetails)}
          </ul>
        </div>
      )}
    </div>
  );
};
