import { Heart, Music, User, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md font-medium tracking-wide text-sm transition ${
      isActive
        ? 'bg-neutral-800 text-green-400'
        : 'text-gray-300 hover:text-green-400 hover:bg-neutral-800'
    }`;

  return (
    <div
      className={`fixed top-[5.8rem] left-0 h-[calc(100vh-5rem)] bg-neutral-900 border-r border-neutral-800 p-3 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        {!collapsed && (
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Menu
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-neutral-700 rounded text-white"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="space-y-5">
        <NavLink to="/" className={linkStyle}>
          <Home size={18} />
          {!collapsed && <span>Home</span>}
        </NavLink>

        <NavLink to="liked" className={linkStyle}>
          <Heart size={18} />
          {!collapsed && <span>Liked Songs</span>}
        </NavLink>

        <NavLink to="playlists" className={linkStyle}>
          <Music size={18} />
          {!collapsed && <span>My Playlists</span>}
        </NavLink>

        <NavLink to="following" className={linkStyle}>
          <User size={18} />
          {!collapsed && <span>Following</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
