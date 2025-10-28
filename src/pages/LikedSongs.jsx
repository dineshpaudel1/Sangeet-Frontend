import { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { useMusic } from "../context/MusicContext";
import SongPlayerSidebar from "../components/SongPlayerSidebar";
import ColorThief from "colorthief";

const LikedSongs = () => {
  const { collapsed } = useOutletContext();
  const [likedSongs, setLikedSongs] = useState([]);
  const [bgGradient, setBgGradient] = useState("from-black via-[#181818] to-black");

  const {
    selectedSong,
    setSelectedSong,
    spotifyToken,
    player,
    deviceId,
    lastPlayedUri,
    setLastPlayedUri,
  } = useMusic();

  // 🔁 Load liked songs
  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:8000/api/liked-songs/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setLikedSongs(data);
        } else {
          console.error("❌ Failed to fetch liked songs");
        }
      } catch (err) {
        console.error("❌ Error loading liked songs:", err);
      }
    };

    fetchLikedSongs();
  }, []);

  // 🎨 Update background from album cover
  useEffect(() => {
    if (!selectedSong?.album_cover) return;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = selectedSong.album_cover;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const [r, g, b] = colorThief.getColor(img);
        setBgGradient(`from-black via-[rgb(${r},${g},${b})] to-black`);
      } catch (err) {
        console.error("🎨 Failed to extract color:", err);
      }
    };
  }, [selectedSong]);

  // ▶️ Handle song play
  const handleSongClick = async (song) => {
    if (!player || !deviceId || !song?.uri) return;

    try {
      // 🔁 Transfer & start playback
      await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ device_ids: [deviceId], play: true }),
      });

      // 🔁 Play the selected track
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [song.uri] }),
      });

      // 🧠 Sync state
      setSelectedSong(song);
      setLastPlayedUri(song.uri);

      // 🕒 Force seek to 0 to start clean (Spotify quirk)
      setTimeout(() => {
        player.seek(0);
      }, 300);
    } catch (err) {
      console.error("❌ Error playing song:", err);
    }
  };

  const handleNext = () => {
    if (!likedSongs.length || !selectedSong) return;
    const currentIndex = likedSongs.findIndex(s => s.song_id === selectedSong.song_id);
    const nextIndex = (currentIndex + 1) % likedSongs.length;
    const nextSong = likedSongs[nextIndex];
    setSelectedSong(nextSong);
    setLastPlayedUri(nextSong.uri);
  };

  return (
    <div
      className={`transition-all duration-300 my-3 min-h-screen bg-gradient-to-br ${bgGradient} ${
        collapsed ? "ml-30" : "ml-30"
      }`}
    >
      <div className="flex pt-30">
        {/* 🎵 Songs Table */}
        <div
          className={`min-w-[750px] w-full mr-5 ${
            collapsed ? "max-w-[calc(100%-420px)]" : "max-w-[70%]"
          }`}
        >
          <div className="pr-1">
            <table className="w-[80%] text-left text-sm ml-10 mt-10">
              <thead className="uppercase text-neutral-400 border-b border-neutral-700 sticky top-0 z-10">
                <tr>
                  <th className="pl-2 py-2 w-10">#</th>
                  <th className="py-2">Title</th>
                  <th className="py-2">Album</th>
                  <th className="py-2 text-right pr-4">Duration</th>
                </tr>
              </thead>
              <tbody>
                {likedSongs.map((song, index) => {
                  const isPlaying = selectedSong?.song_id === song.song_id;
                  return (
                    <tr
                      key={song.song_id}
                      onClick={() => handleSongClick(song)}
                      className={`border-b border-neutral-800 transition-all duration-300 cursor-pointer ${
                        isPlaying
                          ? "bg-black/40 text-green-400 animate-pulse-soft glow-green"
                          : "hover:bg-black/20 text-white"
                      }`}
                    >
                      <td className="pl-2 py-3 text-neutral-400">
                        {isPlaying ? (
                          <div className="flex items-center gap-1">
                            <span className="equalizer-bar h-3 w-[2px] bg-green-400 animate-eq"></span>
                            <span className="equalizer-bar h-4 w-[2px] bg-green-400 animate-eq delay-100"></span>
                            <span className="equalizer-bar h-2 w-[2px] bg-green-400 animate-eq delay-200"></span>
                          </div>
                        ) : (
                          index + 1
                        )}
                      </td>
                      <td className="flex items-center gap-4 py-3 max-w-[250px] truncate overflow-hidden whitespace-nowrap">
                        <img
                          src={song.album_cover}
                          alt={song.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <div className={`font-medium truncate ${isPlaying ? "text-green-400" : ""}`}>
                            {song.title}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-neutral-400 max-w-[200px] truncate overflow-hidden whitespace-nowrap">
                        {song.album_name}
                      </td>
                      <td className="py-3 text-right text-neutral-400 pr-4 max-w-[100px] truncate overflow-hidden whitespace-nowrap">
                        {song.duration}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ▶️ Sidebar Player */}
        <div className="w-[300px] hidden lg:block mt-10">
          {selectedSong && player && deviceId && spotifyToken ? (
            <SongPlayerSidebar
              song={selectedSong}
              token={spotifyToken}
              player={player}
              deviceId={deviceId}
              onNext={handleNext}
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 rounded-xl border border-neutral-700 flex items-center justify-center text-neutral-400 text-sm px-4 text-center">
              👈 Select a song to start playing
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedSongs;
