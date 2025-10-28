import { useEffect } from 'react';
import axios from 'axios';

const TrackList = ({ song, tracklist, setTracklist, onTrackClick }) => {
  useEffect(() => {
    if (!song?.artist?.id) return;

    const fetchTracks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/songs/artist/${song.artist.id}/`
        );
        setTracklist(res.data);
      } catch (err) {
        console.error("❌ Error fetching tracks:", err);
      }
    };

    fetchTracks();
  }, [song]);

  const formatTime = (duration) => {
    const ms = typeof duration === 'string' ? parseInt(duration) : duration;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}m:${seconds}s`;
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Tracklist</h2>
      <table className="w-full text-left table-auto">
        <thead className="sticky top-0 z-10">
          <tr className="text-gray-400 text-sm border-b border-neutral-700">
            <th className="py-2 w-[50%] max-w-[300px]">Title</th>
            <th className="w-[30%] max-w-[250px]">Album</th>
            <th className="w-[20%] text-right">Duration</th>
          </tr>
        </thead>
        <tbody>
          {tracklist.slice(0, 5).map((track) => {
            const isPlaying = song.song_id === track.song_id;
            return (
              <tr
                key={track.song_id}
                onClick={() => onTrackClick(track)}
                className={`border-b border-neutral-800 transition-all duration-300 cursor-pointer ${
                  isPlaying
                    ? "bg-black/40 text-green-400 animate-pulse-soft glow-green"
                    : "hover:bg-black/20 text-white"
                }`}
              >
                <td className="py-3 max-w-[300px]">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={track.album_cover}
                      alt="cover"
                      className="w-10 h-10 object-cover rounded"
                    />
                    {isPlaying ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-end gap-[2px]">
                          <span className="equalizer-bar h-3 w-[2px] bg-green-400 animate-eq"></span>
                          <span className="equalizer-bar h-4 w-[2px] bg-green-400 animate-eq delay-100"></span>
                          <span className="equalizer-bar h-2 w-[2px] bg-green-400 animate-eq delay-200"></span>
                        </div>
                        <span className="text-sm font-medium text-green-400 truncate block max-w-[180px]">
                          {track.song_name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium truncate block max-w-[180px]">
                        {track.song_name}
                      </span>
                    )}
                  </div>
                </td>

                <td className="text-sm text-gray-300 max-w-[200px] truncate">
                  {track.album_name || 'Single'}
                </td>

                <td className="text-sm text-gray-300 text-right pr-2">
                  {formatTime(track.duration)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TrackList;
