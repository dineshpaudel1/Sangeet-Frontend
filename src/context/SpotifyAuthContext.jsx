// src/context/SpotifyAuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const SpotifyAuthContext = createContext();

export const SpotifyAuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const storedToken = localStorage.getItem("spotifyToken");
    const storedExpiry = localStorage.getItem("spotifyTokenExpiry");
    let tokenFromHash = null;
  
    // Parse token from URL
    if (hash) {
      tokenFromHash = hash
        .substring(1)
        .split("&")
        .find((item) => item.startsWith("access_token"))
        ?.split("=")[1];
  
      if (tokenFromHash) {
        const expiryTime = Date.now() + 3600 * 1000;
        localStorage.setItem("spotifyToken", tokenFromHash);
        localStorage.setItem("spotifyTokenExpiry", expiryTime);
        window.history.replaceState(null, null, window.location.pathname); // Remove hash
      }
    }
  
    const finalToken = tokenFromHash || storedToken;
    const expiry = parseInt(localStorage.getItem("spotifyTokenExpiry"));
  
    if (finalToken && expiry && Date.now() < expiry) {
      setToken(finalToken);
    } else {
      localStorage.removeItem("spotifyToken");
      localStorage.removeItem("spotifyTokenExpiry");
    }
  
    setIsAuthChecked(true);
  }, []);

  const redirectToSpotify = () => {
    const clientId = "d8094f3f897347b8b770addbdb60e4d0"; // Replace with actual Client ID
    const redirectUri = "http://localhost:5174"; // Replace if needed
    const scopes = [
      "streaming",
      "user-read-email",
      "user-read-private",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "app-remote-control",
    ];

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scopes.join("%20")}`;

    window.location.href = authUrl;
  };

  return (
    <SpotifyAuthContext.Provider value={{ token, isAuthChecked, redirectToSpotify }}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};

export const useSpotifyAuth = () => useContext(SpotifyAuthContext);
