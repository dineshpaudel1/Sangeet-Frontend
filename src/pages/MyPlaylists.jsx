import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ColorThief from 'colorthief';
import { X } from 'lucide-react';
import NoPlaylist from '../assets/noplaylit.png'

const MyPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bgColors, setBgColors] = useState({});
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/playlists/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlaylists(res.data);
      } catch (err) {
        console.error('❌ Error fetching playlists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [token]);

  const handleImageLoad = (imgElement, playlistId) => {
    try {
      const colorThief = new ColorThief();
      const [r, g, b] = colorThief.getColor(imgElement);
      const gradient = `linear-gradient(to bottom right, rgb(${r}, ${g}, ${b}), #181818)`;

      setBgColors((prev) => ({
        ...prev,
        [playlistId]: gradient,
      }));
    } catch (err) {
      console.error(`Failed to extract color for playlist ${playlistId}`, err);
    }
  };

  const handleDelete = async (playlistId) => {
    const confirm = window.confirm("Are you sure you want to delete this playlist?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8000/api/playlists/${playlistId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update UI
      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    } catch (err) {
      console.error("❌ Failed to delete playlist:", err);
      alert("Failed to delete playlist.");
    }
  };

  return (
    <div className="p-5 sm:p-5 text-white bg-[#181818] my-3 min-h-screen">
      {loading ? (
        <p className="text-sm text-gray-400">Loading playlists...</p>
      ) : playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center text-white">
  <img
    src={NoPlaylist}
    alt="No playlists"
    className="w-72 h-auto mb-6 opacity-80"
  />
  <h2 className="text-2xl sm:text-3xl font-bold mb-2">No Playlists Yet</h2>
  <p className="text-sm text-gray-400 max-w-md">
    Looks like you haven’t created any playlists yet.<br />
    Start building your vibe by adding some favorite tracks 🎶
  </p>
</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.02] transition transform duration-300"
              style={{
                background: bgColors[playlist.id] || "#181818"
              }}
            >
              {/* ❌ Delete Button */}
              <button
                onClick={() => handleDelete(playlist.id)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-gray-300 hover:text-red-500 p-1 rounded-full z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <Link to={`/playlist/${playlist.id}`}>
                {/* Hidden image for color extraction */}
                <img
                  src={playlist.cover_url}
                  alt="Album Cover"
                  className="absolute w-0 h-0 opacity-0"
                  crossOrigin="anonymous"
                  onLoad={(e) => handleImageLoad(e.target, playlist.id)}
                />

                {/* Visible Album Image */}
                <img
                  src={playlist.cover_url}
                  alt="Album Cover"
                  className="w-full h-50 object-cover rounded-t-xl"
                />

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-white tracking-wide mb-1 truncate">
                    {playlist.name}
                  </h2>
                  <p className="text-sm text-gray-300 mb-2 truncate">
                    {playlist.description || ''}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created on {new Date(playlist.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPlaylists;
