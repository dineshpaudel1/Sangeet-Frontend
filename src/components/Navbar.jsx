import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { Search, Download, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import axios from "axios";

const Navbar = () => {
  const { user, logout, loading } = useUser();
  const { searchQuery, setSearchQuery } = useSearch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:8000/api/search-history/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchHistory(res.data.reverse()); // recent first
    } catch (err) {
      console.error("Failed to fetch search history", err);
    }
  };

  const deleteKeyword = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:8000/api/delete-search-keyword/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const clearAllHistory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete("http://localhost:8000/api/clear-search-history/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchHistory([]);
      setHistoryOpen(false);
    } catch (err) {
      console.error("Clear all failed", err);
    }
  };

  const handleSearchSubmit = async (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      const trimmed = searchQuery.trim();
      try {
        const res = await axios.get(`http://localhost:8000/api/search/?q=${encodeURIComponent(trimmed)}`);
        const { exact_song, exact_artist } = res.data;

        if (exact_song || exact_artist) {
          
          const token = localStorage.getItem("authToken");
          await axios.post("http://localhost:8000/api/save-search-keyword/", {
            keyword: trimmed,
            song_id: exact_song?.id || null,
            artist_id: exact_artist?.artist_id || null,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
        setHistoryOpen(false);
      } catch (err) {
        console.error("Search failed", err);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !dropdownRef.current?.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setDropdownOpen(false);
        setHistoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full fixed h-20 bg-[#121212] flex items-center justify-between px-6 shadow-sm border-b border-gray-800 z-50">
      <Link to="/" className="text-white text-2xl font-semibold">🎧 saṅgeet</Link>

      {/* Search Box */}
      <div className="flex-1 mx-6 relative max-w-md" ref={dropdownRef}>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
          onFocus={() => {
            fetchHistory();
            setHistoryOpen(true);
          }}
          placeholder="What you wanna listen today?"
          className="w-full rounded-full px-4 py-3 pl-10 text-sm bg-[#1f1f1f] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-4 text-gray-400 h-4 w-4" />

        {historyOpen && searchHistory.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-[#1f1f1f] rounded-lg shadow-lg z-[999] overflow-hidden border border-neutral-700">
           <ul>
            {[...searchHistory].slice(0, 5).reverse().map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between hover:bg-[#2a2a2a] px-4 py-2"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    setSearchQuery(item.keyword);
                    navigate(`/search?q=${encodeURIComponent(item.keyword)}`);
                    setHistoryOpen(false);
                  }}
                >
                  {item.type === "song" ? (
                    <>
                      <img src={item.cover_url} alt={item.title} className="w-10 h-10 rounded" />
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.artist}</p>
                      </div>
                    </>
                  ) : item.type === "artist" ? (
                    <>
                      <img src={item.picture_url} alt={item.artist_name} className="w-10 h-10 rounded-full" />
                      <p className="text-sm font-semibold">{item.artist_name}</p>
                    </>
                  ) : (
                    <p className="text-sm">{item.keyword}</p>
                  )}
                </div>
                <button 
                  onClick={() => deleteKeyword(item.id)} 
                  className="text-gray-400 hover:text-red-400 p-1 rounded focus:outline-none focus:ring-0 border-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>

            {/* Clear All */}
            <div className="flex justify-between items-center px-4 py-2 border-t border-neutral-700">
              <span className="text-xs text-gray-400">Showing 5 recent searches</span>
              <button
                onClick={clearAllHistory}
                className="text-xs text-white-400 hover:text-red-300"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-6">
        <button className="text-white flex items-center space-x-1 text-sm hover:text-blue-400 transition">
          <Download className="w-4 h-4" />
          <span>Install app</span>
        </button>

        {!loading && user && (
          <div className="relative">
            <img
              src={user.profile_picture || "https://i.pravatar.cc/40"}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-700 cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#1f1f1f] text-sm rounded-lg shadow-lg overflow-hidden z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                >
                  ⚙️ Settings
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
