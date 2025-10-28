import { useEffect, useState, useRef } from 'react';
import ColorThief from 'colorthief';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useNavigate } from 'react-router-dom';

const SongPlayerSidebar = ({ song, token, player, deviceId, onNext }) => {
  const [isPaused, setIsPaused] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(1);
  const [bgGradient, setBgGradient] = useState('#1e1e2f');
  const imgRef = useRef(null);
  const progressBarRef = useRef(null);
  const navigate = useNavigate();
  console.log(song)

  const {
    lastPlayedUri,
    setLastPlayedUri
  } = useMusic(); // ✅ from context

  useEffect(() => {
    if (!player || !deviceId || !song?.uri) return;

    // ✅ Prevent replay if already playing this song
    if (lastPlayedUri === song.uri) return;

    const playSong = async () => {
      try {
        await fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ device_ids: [deviceId], play: true }),
        });

        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uris: [song.uri] }),
        });

        setTimeout(() => {
          player.seek(0);
        }, 500);

        setLastPlayedUri(song.uri); // ✅ Persist
      } catch (err) {
        console.error("❌ Error playing song:", err);
      }
    };

    playSong();
    setProgress(0);
    setDuration(1);
    setIsPaused(false);
  }, [song?.uri, player, deviceId, token, lastPlayedUri, setLastPlayedUri]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (player) {
        const state = await player.getCurrentState();
        if (state) {
          setIsPaused(state.paused);
          setProgress(state.position);
          setDuration(state.duration);
          if (!state.paused && state.position >= state.duration - 1000) {
            onNext?.();
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player, onNext]);

  useEffect(() => {
    const handleKeydown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (e.code === 'Space' && tag !== 'input' && tag !== 'textarea') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [player]);

  useEffect(() => {
    const colorThief = new ColorThief();
    const getColor = () => {
      if (imgRef.current && imgRef.current.complete) {
        const [r, g, b] = colorThief.getColor(imgRef.current);
        setBgGradient(`linear-gradient(to bottom, rgb(${r},${g},${b}), #181818)`);
      }
    };
    if (imgRef.current) {
      if (imgRef.current.complete) getColor();
      else imgRef.current.onload = getColor;
    }
  }, [song.album_cover]);

  const togglePlay = async () => {
    if (!player) return;
    const state = await player.getCurrentState();
    if (!state) return;
    if (state.paused) {
      await player.resume();
      setIsPaused(false);
    } else {
      await player.pause();
      setIsPaused(true);
    }
  };

  const handleSkipBack = async () => {
    if (!player) return;
    await player.seek(0);
    setProgress(0);
  };

  const handleVolumeChange = async (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (player) await player.setVolume(newVolume);
  };

  const handleProgressClick = async (e) => {
    if (!player || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const newTime = percentage * duration;
    await player.seek(newTime);
    setProgress(newTime);
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const progressPercent = (progress / duration) * 100;

  return (
    <div
      className="p-3 rounded-xl shadow-md text-white w-full max-w-[280px] mx-auto"
      style={{ background: bgGradient }}
    >
      <div
  onClick={() => navigate(`/song-details/${song.song_id}`)}
  className="cursor-pointer"
>
  <img
    ref={imgRef}
    crossOrigin="anonymous"
    src={song.album_cover}
    alt="Album"
    className="w-full object-cover rounded-md mb-3 max-h-60"
  />
</div>

      <div className="text-center mb-2 overflow-hidden">
        <div className="w-full whitespace-nowrap animate-marquee">
          <h3 className="text-base font-semibold inline-block mr-4">{song.title}</h3>
        </div>
        <p className="text-xs text-gray-300 truncate">{song.artist_name}</p>
      </div>

      <div className="w-full mt-3 mb-2 px-2 text-[10px] flex justify-between text-gray-300">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div
        ref={progressBarRef}
        onClick={handleProgressClick}
        className="w-full h-1 bg-gray-700 rounded mb-4 cursor-pointer"
      >
        <div
          className="h-1 bg-white rounded"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-center gap-3 mb-3 relative">
        <button onClick={handleSkipBack} className="hover:text-green-400 transition">
          <SkipBack className="w-5 h-5" />
        </button>
        <button
          onClick={togglePlay}
          className="bg-white text-black hover:scale-105 transition p-2 rounded-full"
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </button>
        <button onClick={onNext} className="hover:text-green-400 transition">
          <SkipForward className="w-5 h-5" />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowVolumeSlider((prev) => !prev)}
            className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
          >
            {volume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          {showVolumeSlider && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="absolute -top-28 left-1/2 -translate-x-1/2 w-28 rotate-[-90deg] origin-bottom bg-gray-400 rounded-lg cursor-pointer"
            />
          )}
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          animation: marquee 10s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default SongPlayerSidebar;
