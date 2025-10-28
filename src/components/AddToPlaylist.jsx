import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddToPlaylist = ({ songId, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const token = localStorage.getItem("authToken");

  // Fetch playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/playlists/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlaylists(res.data);
      } catch (err) {
        console.error("❌ Error fetching playlists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [token]);

  // Add song to selected playlist
  const handleAdd = async (playlistId) => {
    try {
      await axios.post(
        `http://localhost:8000/api/playlists/${playlistId}/add/`,
        { song_id: songId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Added To Playlist")
      onClose();
    } catch (err) {
      console.error("❌ Error adding song:", err);
      alert("Failed to add song.");
    }
  };

  // Create a new playlist and auto add the song
  const handleCreatePlaylist = async () => {
    if (!newName.trim()) return alert("Name required");
    try {
      const res = await axios.post(
        `http://localhost:8000/api/playlists/create/`,
        { name: newName, description: newDesc },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newPlaylist = res.data;
      setPlaylists((prev) => [newPlaylist, ...prev]); // update list
      setNewName('');
      setNewDesc('');
      setShowCreate(false);
      toast.success("🎉 Playlist created!");
      await handleAdd(newPlaylist.id); // auto add to new playlist
    } catch (err) {
      console.error("❌ Error creating playlist:", err);
      alert("Failed to create playlist");
    }
  };

  return (
    <div className="absolute bg-neutral-800 border border-gray-700 p-4 rounded-lg mt-2 z-50 shadow-lg w-64">
      <h3 className="text-white text-sm mb-2 font-semibold">Select Playlist</h3>

      {loading ? (
        <p className="text-gray-400 text-xs">Loading...</p>
      ) : (
        playlists.map((p) => (
          <button
            key={p.id}
            onClick={() => handleAdd(p.id)}
            className="block w-full text-left text-sm text-white py-1 px-2 hover:bg-neutral-700 rounded"
          >
            {p.name}
          </button>
        ))
      )}

      {/* ➕ Create Playlist Toggle */}
      {!showCreate ? (
        <button
          onClick={() => setShowCreate(true)}
          className="text-xs text-blue-400 mt-3 hover:underline"
        >
          + Create new playlist
        </button>
      ) : (
        <div className="mt-3 text-xs space-y-2">
          <input
            type="text"
            placeholder="Playlist name"
            className="w-full px-2 py-1 rounded bg-neutral-700 text-white text-xs"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <textarea
            placeholder="Description (optional)"
            className="w-full px-2 py-1 rounded bg-neutral-700 text-white text-xs resize-none"
            rows={2}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <div className="flex justify-between">
            <button
              onClick={handleCreatePlaylist}
              className="text-green-500 hover:underline"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowCreate(false);
                setNewName('');
                setNewDesc('');
              }}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="text-gray-400 text-xs mt-4 hover:text-white block ml-auto"
      >
        Close
      </button>
    </div>
  );
};

export default AddToPlaylist;
