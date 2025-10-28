import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play } from 'lucide-react';

const ArtistDetails = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/artist/${artistId}/`)
      .then((res) => res.json())
      .then((data) => setArtist(data))
      .catch((err) => console.error('Error fetching artist details:', err));
  }, [artistId]);

  if (!artist) {
    return <div className="text-white p-10">Loading artist info...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-10">
        <img
          src={artist.picture_url}
          alt={artist.name}
          className="w-40 h-40 rounded-full object-cover shadow-md"
        />
        <div className="text-center md:text-left">
          <p className="text-sm text-gray-400">Artist</p>
          <h1 className="text-4xl font-bold tracking-tight mb-2">{artist.name}</h1>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <button className="bg-white text-black text-sm px-4 py-1 rounded-full font-semibold hover:bg-gray-300">+ Follow</button>
            <button className="flex items-center text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full">
              <Play className="w-4 h-4 mr-2" /> Play all
            </button>
          </div>
        </div>
      </div>

      {/* Top Played Songs */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Top Played Songs</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-2">Title</th>
              <th className="py-2">Album</th>
              <th className="py-2 text-right">Duration</th>
            </tr>
          </thead>
          <tbody>
            {artist.songs.map((song, index) => (
              <tr key={song.song_id} className="hover:bg-[#1f1f1f]">
                <td className="py-2 flex items-center gap-3">
                  <img src={song.cover_url} alt={song.title} className="w-10 h-10 rounded" />
                  <div>
                    <p className="font-medium text-white">{song.title}</p>
                    <p className="text-xs text-gray-400">{song.artist_name}</p>
                  </div>
                </td>
                <td className="text-gray-300">{song.album_name}</td>
                <td className="text-right text-gray-400">{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Similar Artists */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Similar Artists</h2>
        <div className="flex gap-4 overflow-x-auto">
          {artist.similar_artists.map((similar, index) => (
            <div key={index} className="text-center">
              <img
                src={similar.picture_url}
                alt={similar.name}
                className="w-16 h-16 rounded-full object-cover mb-2"
              />
              <p className="text-xs text-gray-300 truncate w-16">{similar.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetails;
