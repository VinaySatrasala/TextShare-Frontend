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
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Create Rooms
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mt-4">
        Create your own room.
      </p>
      <label htmlFor="roomName" className="block text-gray-800 dark:text-white">
        Room Name
      </label>
      <input
        type="text"
        id="roomName"
        onChange={(e) => setRoomName(e.target.value)}
        className="w-full mt-2 p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white p-2 rounded-lg"
      >
        Create Room
      </button>
    </div>
  );
};
