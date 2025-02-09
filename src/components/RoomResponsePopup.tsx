interface PopupType {
  message: string;
  action?: () => void;
}
export const RoomResponsePopup = (popup : PopupType) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          Room Status
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{popup.message}</p>
        <button
          onClick={popup.action}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-400 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
