import { RoomDetails } from "../types/types";
import { ShieldCheck, User, Trash2 } from "lucide-react"; // Icons for admin/user and trash (remove)

interface RoomUsersProps {
  roomDetails: RoomDetails;
  currentUserId: number | null;
  handleRemoveUser: (userId: number) => void;
  ActiveUsersId: number[];
}

const RoomUsers: React.FC<RoomUsersProps> = ({
  roomDetails,
  currentUserId,
  handleRemoveUser,
  ActiveUsersId,
}) => {
  return (
    <div className="w-1/4 min-w-[250px] bg-gray-100 dark:bg-gray-900 p-5 rounded-xl shadow-lg ml-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Users
      </h2>

      <ul className="space-y-3">
        {roomDetails.users?.map((user) => {
          const isAdmin = user.id === roomDetails.adminId;
          const isActive = ActiveUsersId.includes(user.id);

          return (
            <li
              key={user.id}
              className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {/* Left Section: Avatar, Name, and Status */}
              <div className="flex items-center gap-3">
                {/* User Icon with Border */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {isAdmin ? (
                      <ShieldCheck className="w-6 h-6 text-blue-500" />
                    ) : (
                      <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>

                  {/* Green Dot for Active Users */}
                  {isActive && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-[0_0_8px_3px] shadow-green-400 animate-pulse"></span>
                  )}
                </div>

                {/* User Name */}
                <span
                  className={`text-sm font-medium ${
                    isAdmin ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {user.name}
                </span>
              </div>  

              {/* Right Section: Remove Button (Only for Admin) */}
              {roomDetails.adminId === currentUserId && user.id !== currentUserId && (
                <button
                  onClick={() => handleRemoveUser(Number(user.id))}
                  className="text-red-500 hover:text-red-600 text-sm font-medium transition flex items-center gap-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RoomUsers;
