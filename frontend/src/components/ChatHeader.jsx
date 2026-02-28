import { Phone, VideoIcon, XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const navigate = useNavigate();

  const isOnline = selectedUser
    ? onlineUsers.includes(selectedUser._id)
    : false;

  const handleVideoCall = () => {
    navigate("/vedio-call");
  };
 const handleVoiceCall = () => {
    navigate("/voice-call");
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
    <div className="w-full flex items-center justify-between 
                    bg-slate-800/60 backdrop-blur-md 
                    border-b border-slate-700/50 
                    px-3 sm:px-4 md:px-6 
                    py-2 sm:py-3 md:py-4">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        
        {/* Avatar */}
        <div className="relative">
          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullname}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Online Indicator */}
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 
            rounded-full border-2 border-slate-800 
            ${isOnline ? "bg-green-500" : "bg-gray-500"}`}
          />
        </div>

        {/* User Info */}
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base md:text-lg 
                         font-medium text-slate-200 
                         truncate max-w-[120px] sm:max-w-[180px] md:max-w-xs">
            {selectedUser.fullname}
          </h3>

          <p className="text-xs sm:text-sm text-slate-400">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3 sm:gap-4">

        <button
          onClick={handleVideoCall}
          className="p-2 rounded-lg 
                     hover:bg-slate-700/60 
                     transition-colors duration-200"
        >
          <VideoIcon className="w-4 h-4 sm:w-6 sm:h-6 text-slate-300" />
        </button>

        {/**audio call */}
          <button
            onClick={handleVoiceCall}
          className="p-4 rounded-lg 
                     hover:bg-slate-700/60 
                     transition-colors duration-200"
        >
          <Phone className="w-3 h-3 sm:w-6 sm:h-6 text-slate-300" />
        </button>
          
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-lg 
                     hover:bg-slate-700/60 
                     transition-colors duration-200"
        >
          <XIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
        </button>

      </div>
    </div>
  );
}

export default ChatHeader;