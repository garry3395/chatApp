import { VideoIcon, XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const navigate = useNavigate();

  const isOnline = selectedUser ? onlineUsers.includes(selectedUser._id) : false;

  const handleVideoCall = () => {
    navigate("/vedio-call");
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  if (!selectedUser) return null;

  return (
    <div className="flex items-center justify-between bg-slate-800/50 border-b border-slate-700/50 px-4 md:px-6 py-3 md:py-4 w-full">
      {/* Left: Avatar and user info */}
      <div className="flex items-center space-x-3">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-10 md:w-12 rounded-full">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullname}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="truncate max-w-[150px] md:max-w-xs">
          <h3 className="text-slate-200 font-medium truncate">
            {selectedUser.fullname}
          </h3>
          <p className="text-slate-400 text-sm truncate">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-4">
        <VideoIcon
          onClick={handleVideoCall}
          className="w-5 h-5 md:w-6 md:h-6 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        />
        <XIcon
          onClick={() => setSelectedUser(null)}
          className="w-5 h-5 md:w-6 md:h-6 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        />
      </div>
    </div>
  );
}

export default ChatHeader;