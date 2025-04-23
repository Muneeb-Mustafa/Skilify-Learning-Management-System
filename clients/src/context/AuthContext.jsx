import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } from "../config/firebase";

const Auth = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setIsLoggedIn(true);
        setUser(firebaseUser);
      } else {
        // If no Firebase user, check backend auth
        await checkAuth();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
      });
      if (response.data.user) {
        setIsLoggedIn(true);
        setUser(response.data.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Firebase auth state change will handle setting isLoggedIn and user
      toast.success(`Welcome, ${result.user.displayName || "User"}!`);
      navigate("/");
    } catch (error) {
      toast.error("Authentication failed, please try again.");
    }
  };

  const logout = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
      
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      setIsLoggedIn(false);
      setUser(null);
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Auth.Provider value={{ isLoggedIn, user, setUser, setIsLoggedIn, logout, loading, checkAuth, handleGoogleLogin }}>
      {children}
    </Auth.Provider>
  );
};


export const useAuthContext = () => useContext(Auth);
export default AuthProvider;