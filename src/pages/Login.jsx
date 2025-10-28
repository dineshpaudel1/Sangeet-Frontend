import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import logo from '../assets/logo.png';
import name from '../assets/name.png';

export default function Login({ setGoogleUser }) {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    const { identifier, password } = formData;
    if (!identifier || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login/", {
        email: identifier,
        password,
      });

      localStorage.setItem("authToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);
      localStorage.setItem("loginMethod", "normal");
      localStorage.setItem("userEmail", identifier);
      window.dispatchEvent(new Event("auth-updated"));
      navigate("/");
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      setError("Invalid email or password.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const decoded = jwtDecode(idToken);
  
      const res = await axios.post("http://localhost:8000/api/google-login/", {
        id_token: idToken,
      });
  
      localStorage.setItem("authToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);
      localStorage.setItem("googleUser", JSON.stringify(decoded));
      localStorage.setItem("google-id-token", idToken);
      window.dispatchEvent(new Event("auth-updated"));
      setGoogleUser(decoded);
      navigate("/");
    } catch (err) {
      console.error("❌ Google login failed:", err.response?.data || err.message);
      setError("Google login failed. Try again.");
    }
  };
  


  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-[#121212] p-10 rounded-xl w-full max-w-md text-white shadow-lg">
        {/* Logo and Brand */}
        <div className="flex justify-center items-center gap-2 mb-8">
          <img src={logo} alt="Logo" className="h-10" />
          <img src={name} alt="Sangeet" className="h-10" />
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <label className="text-sm text-gray-400">Email</label>
        <input
          type="text"
          name="identifier"
          placeholder="Email or Username"
          value={formData.identifier}
          onChange={handleChange}
          className="w-full bg-[#1e1e1e] p-3 rounded-md mb-4 mt-1 text-sm"
        />

        <div className="flex justify-between items-center text-sm text-gray-400">
          <label>Password</label>
          <a href="#" className="text-xs hover:underline">forgot password?</a>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLogin();
          }}
          className="w-full bg-[#1e1e1e] p-3 rounded-md mb-6 mt-1 text-sm"
        />


        <button
          onClick={handleLogin}
          className="w-full bg-white text-black py-2 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex flex-col gap-4 items-center mt-6">
          <p className="text-center text-sm text-gray-400 flex items-center gap-2 w-full">
            <span className="flex-grow border-t border-gray-700"></span>
            <span className="px-3">Or Signin with</span>
            <span className="flex-grow border-t border-gray-700"></span>
          </p>

          {/* Custom Google Login Button */}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed ❌")}
            />
        </div>

        {/* Signup Link */}
        <p className="text-sm text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <a href="#" className="text-white font-semibold hover:underline">Signup</a>
        </p>
      </div>
    </div>
  );
}
