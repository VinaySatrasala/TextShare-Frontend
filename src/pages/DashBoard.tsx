import { Routes, Route, Link } from "react-router-dom";
import { FaHome, FaPlus, FaDoorOpen, FaSignOutAlt } from "react-icons/fa";
import { CreatedRooms } from "../components/CreatedRooms";
import { CreateRooms } from "../components/CreateRoom";
import Home from "../components/Home";
import JoinedRooms from "../components/JoinedRooms";





const Settings = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>
    <p className="text-gray-600 dark:text-gray-300 mt-4">Manage your settings here.</p>
  </div>
);

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 mt-16">
      {/* Sidebar */}
      <aside className="fixed left-0 w-64 h-full text-black dark:text-white shadow-xl">
        <nav className="mt-4">
          <ul>
            <li className="px-4 py-3 hover:bg-purple-700 dark:hover:bg-gray-700 transition-all cursor-pointer">
              <Link to="/dashboard/home" className="flex items-center">
                <FaHome className="mr-2" /> Home
              </Link>
            </li>
            <li className="px-4 py-3 hover:bg-purple-700 dark:hover:bg-gray-700 transition-all cursor-pointer">
              <Link to="/dashboard/create-room" className="flex items-center">
                <FaPlus className="mr-2" /> Create Room
              </Link>
            </li>
            <li className="px-4 py-3 hover:bg-purple-700 dark:hover:bg-gray-700 transition-all cursor-pointer">
              <Link to="/dashboard/created-rooms" className="flex items-center">
                <FaPlus className="mr-2" /> View Created Rooms
              </Link>
            </li>
            <li className="px-4 py-3 hover:bg-purple-700 dark:hover:bg-gray-700 transition-all cursor-pointer">
              <Link to="/dashboard/joined-rooms" className="flex items-center">
                <FaDoorOpen className="mr-2" /> View Joined Rooms
              </Link>
            </li>
            <li className="px-4 py-3 hover:bg-purple-700 dark:hover:bg-gray-700 transition-all cursor-pointer">
              <Link to="/dashboard/settings" className="flex items-center">
                <FaSignOutAlt className="mr-2" /> Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 w-full p-8">
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="created-rooms" element={<CreatedRooms />} />
          <Route path="joined-rooms" element={<JoinedRooms />} />
          <Route path="settings" element={<Settings />} />
          <Route path="create-room" element={<CreateRooms />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
