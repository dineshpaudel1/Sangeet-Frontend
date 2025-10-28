import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle } from 'lucide-react'; // Make sure this is imported!

const Home = ({ token, onSongSelect, setGoogleUser }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:8000/api/random-songs/')
      .then(res => res.json())
      .then(data => {
        console.log("🎧 Songs fetched:", data);
        setSongs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Error fetching songs:", err);
        setLoading(false);
      });
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("googleUser");
    localStorage.removeItem("google-id-token");
    setGoogleUser(null);
    navigate("/login");
  };

  const handleSongClick = (song) => {
    onSongSelect(song); // Set it in context
    navigate(`/song-details/${song.song_id}`); // 👈 Pass song_id in URL
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white text-xl font-semibold">
        Loading songs...
      </div>
    );
  }

  return (
    <div className="p-6 pt-25 my-3 bg-gradient-to-br from-black via-[#181818] to-black">
      {/* Section Tags */}
      <div className="flex gap-4 mb-10 ">
        {['Trending', 'Relax', 'Mediation', 'Lofi'].map((tag, i) => (
          <button
            key={i}
            className="border border-gray-200 text-white px-4 py-1 rounded-full bg-black text-sm hover:bg-gray-800 transition"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Section Title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6">
        Trending Songs
      </h2>

      {/* Songs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-10 justify-items-center">
        {songs.length === 0 ? (
          <p className="text-white text-center col-span-full">No songs available.</p>
        ) : (
          songs.map((song, index) => (
            <div
              key={index}
              className="w-44 sm:w-48 md:w-52 bg-neutral-800  overflow-hidden shadow-md hover:scale-105 hover:shadow-lg transition cursor-pointer group"
              onClick={() => handleSongClick(song)}
            >
              {/* Image + Play Button */}
              <div className="relative">
                <img
                  src={song.album_cover}
                  alt={song.album}
                  className="w-full h-44 object-cover group-hover:opacity-90"
                />
                <PlayCircle
                  className="absolute bottom-2 left-2 w-9 h-9 text-white bg-black rounded-full p-1 shadow-md hover:scale-110 transition"
                />
              </div>

              {/* Song Info */}
              <div className="p-3 text-white text-center">
                <h3 className="text-md font-semibold truncate">{song.song_title}</h3>
                <p className="text-sm text-gray-400 truncate">{song.artist_name}</p>
                <p className="text-xs text-gray-500 mt-1">{song.duration}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
