import { User, Mail, Settings, Headphones, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileDropdown = ({ logout }) => {
    return (
        <div className="absolute right-0 mt-2 w-48 bg-[#121212] text-sm rounded-xl shadow-lg overflow-hidden border border-neutral-800 z-50">
            <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2 hover:bg-[#1f1f1f] text-gray-200"
            >
                <User className="w-4 h-4 text-gray-400" />
                <span>Profile</span>
            </Link>

            <Link
                to="/inbox"
                className="flex items-center gap-3 px-4 py-2 hover:bg-[#1f1f1f] text-gray-200"
            >
                <Mail className="w-4 h-4 text-gray-400" />
                <span>Inbox</span>
            </Link>

            <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-2 hover:bg-[#1f1f1f] text-gray-200"
            >
                <Settings className="w-4 h-4 text-gray-400" />
                <span>Settings</span>
            </Link>

            <Link
                to="/support"
                className="flex items-center gap-3 px-4 py-2 hover:bg-[#1f1f1f] text-gray-200"
            >
                <Headphones className="w-4 h-4 text-gray-400" />
                <span>Support</span>
            </Link>

            <hr className="border-neutral-800" />

            <button
                onClick={logout}
                className="flex items-center gap-3 w-full text-left px-4 py-2 text-red-500 hover:bg-red-900/30"
            >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
            </button>
        </div>
    );
};

export default ProfileDropdown;
