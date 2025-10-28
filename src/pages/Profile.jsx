import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const Profile = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`flex-1 min-h-screen bg-black text-white pt-[5rem] px-6 overflow-y-auto transition-all duration-300 ${
          collapsed ? 'ml-16' : 'ml-60'
        }`}
      >
        {/* ✅ Pass collapsed context to children */}
        <Outlet context={{ collapsed }} />
      </main>
    </div>
  );
};

export default Profile;
