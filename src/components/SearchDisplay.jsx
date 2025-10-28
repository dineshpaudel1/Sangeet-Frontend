import Noresults from '../assets/noresults.png';
import ColorThief from 'colorthief';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchDisplay = ({ results, setPageGradient, setSelectedSong }) => {
  const {
    exact_artist,
    songs_by_artist,
    albums_by_artist,
    exact_song,
    related_songs,
  } = results;

  const navigate = useNavigate();
  const artistFromSong = exact_song?.artist || null;
  const imgRef = useRef(null);

  const extractColor = (img) => {
    try {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(img);
      const rgb = `rgb(${color.join(',')})`;
      setPageGradient(`from-[${rgb}] via-[#181818] to-[#181818]`);
    } catch (err) {
      console.error('Color extraction failed', err);
    }
  };

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && (exact_song || exact_artist)) {
      extractColor(img);
    }
  }, [exact_song, exact_artist]);

  const handleSongClick = (song) => {
    setSelectedSong?.(song);
    navigate(`/song-details/${song.id}`);
  };

  const handleArtistClick = (artistId) => {
    navigate(`/artist/${artistId}`);
  };

  return (
    <div className="text-white p-6">
      {/* ❌ No Results */}
      {!exact_song && !exact_artist && (
        <div className="flex flex-col items-center justify-center h-full text-center text-white">
          <img src={Noresults} alt="No results" className="w-80 h-auto mb-6" />
          <h2 className="text-3xl font-bold mb-2">No result found</h2>
          <p className="text-sm text-gray-400">
            We couldn't find what you searched for<br />Try searching again
          </p>
        </div>
      )}

      {/* 🎤 Exact Artist Match (No exact song) */}
      {exact_artist && !exact_song && (
        <>
          <div className="flex flex-col gap-10 items-start mb-10">
  {/* 👤 Artist Card */}
  <div className="bg-[#1f1f1f] p-3 rounded-lg text-center w-full max-w-sm ">
    <img
      src={exact_artist.picture_url}
      alt={exact_artist.name}
      className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border border-gray-600"
      ref={imgRef}
      crossOrigin="anonymous"
      onLoad={(e) => extractColor(e.target)}
    />
    <h3 className="text-xl font-bold">{exact_artist.name}</h3>
    <p className="text-sm text-gray-400 mt-1">Artist</p>
    <p className="text-sm text-gray-400 mt-2">
      Genres: {exact_artist.genres.join(', ')}
    </p>
    <p className="text-sm text-gray-400">
      Followers: {exact_artist.followers.toLocaleString()}
    </p>
    <p className="text-sm text-gray-400">
      Popularity: {exact_artist.popularity} / 100
    </p>
  </div>

  {/* 🎵 Top Songs */}
  {songs_by_artist?.length > 0 && (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4">Top Songs</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {songs_by_artist.map((song) => (
          <li
            key={song.id}
            className="flex items-center gap-4 bg-[#1f1f1f] p-3 rounded-md cursor-pointer hover:bg-[#2a2a2a]"
            onClick={() => handleSongClick(song)}
          >
            <img
              src={song.cover_url}
              alt={song.title}
              className="w-16 h-16 rounded object-cover"
            />
            <div>
              <p className="font-medium">{song.title}</p>
              <p className="text-gray-400 text-sm">{song.album_name}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )}

  {/* 💿 Albums */}
  {albums_by_artist?.length > 0 && (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4">Albums</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {albums_by_artist.map((album, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => console.log('Album clicked')}
          >
            <img
              src={album.cover_url}
              alt={album.album_name}
              className="w-full h-48 object-cover rounded-md"
            />
            <button className="absolute bottom-2 left-2 w-8 h-8 flex items-center justify-center rounded-full bg-white text-black opacity-0 group-hover:opacity-100 transition">
              ▶
            </button>
            <div className="mt-2 text-sm text-center">
              <p className="font-semibold">{album.album_name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

        </>
      )}

      {/* 🎯 Exact Song Match (Top Result layout) */}
      {exact_song && (
  <>
    <h2 className="text-xl font-semibold mb-6">Top Result</h2>

    {/* 🎯 Top Result Cards */}
    <div className="flex flex-wrap gap-10 mb-10">
      {/* 🎵 Song Card */}
      <div
        className="bg-[#1f1f1f] p-2 rounded-md w-full max-w-xs cursor-pointer hover:bg-[#2a2a2a] transition"
        onClick={() => handleSongClick(exact_song)}
      >
        <img
          src={exact_song.cover_url}
          alt={exact_song.title}
          className="w-[80%] h-[6rem] object-cover rounded-md mb-3"
          ref={imgRef}
          crossOrigin="anonymous"
          onLoad={(e) => extractColor(e.target)}
        />
        <h3 className="text-lg font-bold mb-1">{exact_song.title}</h3>
        <p className="text-sm text-gray-300"> {exact_song.artist.name}</p>
      </div>

      {/* 👤 Artist Card */}
      {artistFromSong && (
        <div
        className="bg-[#1f1f1f] p-2 rounded-md w-full max-w-xs flex flex-col items-center justify-center cursor-pointer hover:bg-[#2a2a2a] transition"
        onClick={() => handleArtistClick(artistFromSong.id)}
      >
        {/* Profile Picture Wrapper */}
        <div className="p-1 bg-[#2a2a2a] rounded-full mb-3">
          <img
            src={artistFromSong.picture_url}
            alt={artistFromSong.name}
            className="w-24 h-24 object-cover rounded-full border border-gray-600"
            ref={imgRef}
            crossOrigin="anonymous"
            onLoad={(e) => extractColor(e.target)}
          />
        </div>
      
        <h3 className="text-base font-semibold">{artistFromSong.name}</h3>
        <p className="text-sm text-gray-400">Artist</p>
      </div>
      )}
    </div>

    {/* 🎵 Songs Grid */}
    {related_songs?.length > 0 && (
      <>
        <h3 className="text-xl font-semibold mb-4">Songs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {related_songs.map((song) => (
            <div
              key={song.id}
              onClick={() => handleSongClick(song)}
              className="flex justify-between items-center bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-md p-3 cursor-pointer transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={song.cover_url}
                  alt={song.title}
                  className="w-14 h-14 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{song.title}</p>
                  <p className="text-sm text-gray-400">{exact_song.artist.name}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">4:16</p>
            </div>
          ))}
        </div>
      </>
    )}
  </>
)}

    
    
      
    



    </div>
  );
};

export default SearchDisplay;
