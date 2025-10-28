// ✅ Final version with event-based fetchUser trigger

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));
  const fetchUser = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("⚠️ No access token found.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:8000/api/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch user:", err.response?.data || err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("googleUser");
    setAuthToken(null);
    setRefreshToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  // ✅ Run fetchUser only once after login event
  useEffect(() => {
    const handleAuthUpdate = () => {
      console.log("🚀 Auth token set. Fetching user...");
      setAuthToken(localStorage.getItem("authToken"));
      setRefreshToken(localStorage.getItem("refreshToken"));
      fetchUser();
    };

    window.addEventListener("auth-updated", handleAuthUpdate);
    return () => window.removeEventListener("auth-updated", handleAuthUpdate);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
