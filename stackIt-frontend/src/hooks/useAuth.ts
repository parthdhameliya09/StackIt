import { useState, useEffect } from "react";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";

export function useAuth() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const loginWithGoogle = async (token: string) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, { token });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("jwt", res.data.token);
      setUser(res.data.user);
    } catch (error) {
      console.error("Google Login Error", error);
    }
  };

  const logout = () => {
    googleLogout();
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    setUser(null);
  };

  return { user, loginWithGoogle, logout };
}
