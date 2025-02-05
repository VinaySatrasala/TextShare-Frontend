import axios from "axios";
import { useState } from "react";

export const CreateRooms = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [roomName, setRoomName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setModalMessage(null); // Reset previous messages

    try {
      const res = await axios.post(
        `${backendUrl}/createRoom`,
        { roomName },
        { withCredentials: true }
      );
      setModalMessage(res.data.message); // Show success message
    } catch (err: any) {
      setModalMessage(err.response?.data?.message || "Something went wrong"); // Show error message
    } finally {
      setLoading(false);
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
        disabled={loading}
      />

      <button
        onClick={handleSubmit}
        className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-gray-700 dark:to-gray-900 text-white font-bold rounded-lg hover:opacity-90 transition flex justify-center items-center"
        disabled={loading}
      >
        {loading ? <span className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></span> : "Create Room"}
      </button>

      {/* Modal Popup */}
      {modalMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Room Status</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">{modalMessage}</p>
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
