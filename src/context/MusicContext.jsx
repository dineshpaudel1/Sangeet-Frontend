import { createContext, useContext, useState, useEffect } from "react";
import { useSpotifyAuth } from "./SpotifyAuthContext";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const { token } = useSpotifyAuth(); // 🔁 use token from auth context
  const [selectedSong, setSelectedSong] = useState(null);
  const [spotifyToken, setSpotifyToken] = useState(null);
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [lastPlayedUri, setLastPlayedUri] = useState(null);

  // Keep music context token in sync with auth context
  useEffect(() => {
    if (token) {
      setSpotifyToken(token);
    }
  }, [token]);

  return (
    <MusicContext.Provider
      value={{
        selectedSong,
        setSelectedSong,
        spotifyToken,
        setSpotifyToken,
        player,
        setPlayer,
        deviceId,
        setDeviceId,
        lastPlayedUri,       
        setLastPlayedUri,     
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
