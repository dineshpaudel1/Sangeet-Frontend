import { useEffect } from "react";
import { useMusic } from "../context/MusicContext";

const SpotifyPlayer = () => {
  const { spotifyToken: token, setPlayer, setDeviceId } = useMusic();

  useEffect(() => {
    if (!token) {
      console.warn("⚠️ Token missing, cannot initialize Spotify SDK.");
      return;
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "My Player",
        getOAuthToken: cb => cb(token),
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("✅ Player ready with ID:", device_id);
        setDeviceId(device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.warn("🚫 Player not ready:", device_id);
      });

      player.addListener("player_state_changed", state => {
        if (!state) return;
        console.log("🎧 Player state:", state);
      });

      player.addListener("initialization_error", ({ message }) =>
        console.error("Initialization error:", message)
      );
      player.addListener("authentication_error", ({ message }) =>
        console.error("Authentication error:", message)
      );
      player.addListener("account_error", ({ message }) =>
        console.error("Account error:", message)
      );
      player.addListener("playback_error", ({ message }) =>
        console.error("Playback error:", message)
      );

      player.connect();
    };

    if (!window.Spotify) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.onSpotifyWebPlaybackSDKReady();
    }

  }, [token]);

  return null;
};

export default SpotifyPlayer;
