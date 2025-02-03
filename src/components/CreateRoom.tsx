import axios from "axios";
import { useState } from "react";

export const CreateRooms = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [roomName, setRoomName] = useState<string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${backendUrl}/createRoom`,
        { roomName },
        { withCredentials: true }
      );
      if (res.status === 200) {
        console.log(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Room</h2>
      <p className="text-gray-600 dark:text-gray-300 mt-2">Create your own room.</p>

      <label htmlFor="roomName" className="block mt-4 text-gray-800 dark:text-gray-200">
        Room Name
      </label>
      <input
        type="text"
        id="roomName"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="w-full mt-2 p-2 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-gray-700 dark:to-gray-900 text-white font-bold rounded-lg hover:opacity-90 transition"
      >
        Create Room
      </button>
    </div>
  );
};
