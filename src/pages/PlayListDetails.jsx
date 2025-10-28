import { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useMusic } from "../context/MusicContext";
import SongPlayerSidebar from "../components/SongPlayerSidebar";
import ColorThief from "colorthief";

const PlaylistDetails = () => {
  const { id: playlistId } = useParams();
  const { collapsed } = useOutletContext();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [bgGradient, setBgGradient] = useState("from-black via-[#181818] to-black");

  const {
    selectedSong,
    setSelectedSong,
    spotifyToken,
    player,
    deviceId,
  } = useMusic();

  const imgRef = useRef(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:8000/api/playlists/${playlistId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPlaylist(data);
        setSongs(data.songs || []);
      } else {
        console.error("Failed to fetch playlist");
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  // 🎨 Background color extraction
  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      const colorThief = new ColorThief();

      const extractColor = () => {
        try {
          const [r, g, b] = colorThief.getColor(img);
          setBgGradient(`from-black via-[rgb(${r},${g},${b})] to-black`);
        } catch (err) {
          console.error("🎨 Failed to extract color", err);
        }
      };

      if (img.complete) extractColor();
      else img.onload = extractColor;
    }
  }, [selectedSong, songs]);

  const handleNext = () => {
    if (!songs.length || !selectedSong) return;
    const currentIndex = songs.findIndex(s => s.song_id === selectedSong.song_id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setSelectedSong(songs[nextIndex]);
  };

  const handlePlayAll = () => {
    if (songs.length) {
      setSelectedSong(songs[0]);
    }
  };

  const isPlaying = (song) => selectedSong?.song_id === song.song_id;

  const gradientClass = `transition-all duration-300 min-h-screen text-white px-6 pt-20 my-3 bg-gradient-to-br ${bgGradient} ${
    collapsed ? "ml-30" : "ml-30"
  }`;

  return (
    <div className={gradientClass}>
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-[65%]">
          {playlist && (
            <>
              <div className="flex gap-4 items-center">
                <img
                  src={(selectedSong?.album_cover || songs[0]?.album_cover) || ""}
                  alt="cover"
                  className="w-40 h-40 object-cover rounded-md"
                  ref={imgRef}
                  crossOrigin="anonymous"
                />
                <div>
                  <p className="text-sm text-gray-400">Playlist</p>
                  <h1 className="text-3xl font-bold">{playlist.playlist_name}</h1>
                  <p className="text-sm mt-2 text-gray-300">{playlist.description}</p>
                  <div className="mt-6 flex items-center gap-4">
                    <button
                      onClick={handlePlayAll}
                      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full text-white font-semibold flex items-center gap-2"
                    >
                      ▶ Play all
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Track Table */}
          <div className="mt-8 max-h-[calc(90vh-220px)] overflow-y-auto pr-2">
            <table className="w-full text-left text-sm">
              <thead className="uppercase text-neutral-400 border-b border-neutral-700 sticky top-0 z-10">
                <tr>
                  <th className="pl-2 py-2 w-10">#</th>
                  <th className="py-2">Title</th>
                  <th className="py-2">Album</th>
                  <th className="py-2 text-right pr-4">Duration</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song, index) => (
                 <tr
                 key={song.song_id}
                 onClick={() => setSelectedSong(song)}
                 className={`border-b border-neutral-800 transition-all duration-300 cursor-pointer ${
                   isPlaying(song)
                     ? "bg-black/40 text-green-400 animate-pulse-soft glow-green"
                     : "hover:bg-black/20 text-white"
                 }`}
               >
               
                    <td className="pl-2 py-3 text-neutral-400">
                      {isPlaying(song) ? (
                        <div className="flex items-center gap-1">
                          <span className="equalizer-bar h-3 w-[2px] bg-green-400 animate-eq"></span>
                          <span className="equalizer-bar h-4 w-[2px] bg-green-400 animate-eq delay-100"></span>
                          <span className="equalizer-bar h-2 w-[2px] bg-green-400 animate-eq delay-200"></span>
                        </div>
                      ) : (
                        index + 1
                      )}
                    </td>
                    <td className="flex items-center gap-4 py-3 max-w-[280px] truncate">
                      <img
                        src={song.album_cover}
                        alt={song.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <div className={`font-medium truncate ${isPlaying(song) ? "text-green-400" : ""}`}>
                          {song.title}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-neutral-400 max-w-[200px] truncate">{song.album_name}</td>
                    <td className="py-3 text-right text-neutral-400 pr-4">{song.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-[35%]">
          {selectedSong && player && deviceId && spotifyToken ? (
            <SongPlayerSidebar
              song={selectedSong}
              token={spotifyToken}
              player={player}
              deviceId={deviceId}
              onNext={handleNext}
            />
          ) : songs[0] ? (
            <div className="bg-neutral-900 rounded-xl border border-neutral-700 flex flex-col items-center justify-center text-white text-center p-4">
              <img src={songs[0].album_cover} alt="Album" className="w-full object-cover rounded-md mb-4 max-h-64" />
              <p className="text-sm">👈 Select a song to start playing</p>
            </div>
          ) : (
            <div className="bg-neutral-900 rounded-xl border border-neutral-700 flex items-center justify-center text-neutral-400 text-sm p-4 text-center">
              No songs in this playlist.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetails;
