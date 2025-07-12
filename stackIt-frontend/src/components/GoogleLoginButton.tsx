import { useEffect, useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";

export function GoogleLoginButton() {
  const [user, setUser] = useState<any>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle login success
  const handleLoginSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        { token }
      );

      const { user, token: jwtToken } = response.data;
      setUser(user);
      localStorage.setItem("jwt", jwtToken);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
  };

  // UI: Show login button if no user
  if (!user) {
    return (
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.log("Login Failed")}
        width="100%"
      />
    );
  }

  // UI: Show user info and logout
  return (
    <div className="flex items-center gap-3">
      <img
        src={user.picture}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{user.name}</span>
        <span className="text-xs text-muted-foreground truncate max-w-[180px]">
          {user.email}
        </span>
        <button
          onClick={handleLogout}
          className="mt-1 text-xs text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
