// import { useState, useEffect } from "react";
// import { GoogleLogin, googleLogout } from "@react-oauth/google";
// import jwtDecode from "jwt-decode";
// import axios from "axios";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// export function UserAvatar() {
//   const [user, setUser] = useState<any>(null);

//   // Load from localStorage on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   const handleLoginSuccess = async (credentialResponse: any) => {
//     const token = credentialResponse.credential;
//     try {
//       const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, { token });
//       setUser(response.data.user);
//       localStorage.setItem("jwt", response.data.token);
//       localStorage.setItem("user", JSON.stringify(response.data.user));
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   const handleLogout = () => {
//     googleLogout();
//     setUser(null);
//     localStorage.removeItem("jwt");
//     localStorage.removeItem("user");
//   };

//   if (!user) {
//     return (
//       <GoogleLogin
//         onSuccess={handleLoginSuccess}
//         onError={() => console.log("Login Failed")}
//       />
//     );
//   }

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger>
//         <Avatar className="cursor-pointer h-9 w-9">
//           <AvatarImage src={user.picture} alt={user.name} />
//           <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
//         </Avatar>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem disabled>{user.name}</DropdownMenuItem>
//         <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }


import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserAvatar() {
  const { user, loginWithGoogle, logout } = useAuth();

  const handleLoginSuccess = (credentialResponse: any) => {
    const token = credentialResponse.credential;
    loginWithGoogle(token);
  };

  if (!user) {
    return (
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.log("Login Failed")}
      />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer h-9 w-9">
          <AvatarImage src={user.picture} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled>{user.name}</DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
