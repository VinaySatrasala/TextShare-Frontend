interface User {
    id: string;
    name: string;
  }
  
  interface RoomUsersProps {
    roomDetails: {
      users: User[];
      adminId: string;
    };
    currentUserId: string | null;
    handleRemoveUser: (userId: string) => void;
  }
  
  const RoomUsers: React.FC<RoomUsersProps> = ({ roomDetails, currentUserId, handleRemoveUser }) => {
    return (
      <div className="w-1/4 bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-lg ml-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Users
        </h2>
        <ul className="space-y-2">
          {roomDetails.users?.map((user) => (
            <li
              key={user.id}
              className="flex justify-between items-center bg-white dark:bg-gray-700 p-2 rounded"
            >
              <span className="text-gray-900 dark:text-white">{user.name}</span>
              {roomDetails.adminId === currentUserId &&
                user.id !== currentUserId && (
                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remove
                  </button>
                )}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default RoomUsers;
  