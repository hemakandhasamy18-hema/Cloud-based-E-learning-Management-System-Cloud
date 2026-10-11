import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, isValidConfig } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { dbService } from "../services/db";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from storage on mount if in mock mode
  useEffect(() => {
    if (isValidConfig && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Get user role/profile from db
            const users = await dbService.getUsers();
            let profile = users.find(u => u.id === firebaseUser.uid);
            
            // If profile doesn't exist yet (e.g. auth direct creation or lag), create it
            if (!profile) {
              profile = await dbService.createUserProfile(firebaseUser.uid, {
                name: firebaseUser.displayName || "New User",
                email: firebaseUser.email,
                role: "student" // default role
              });
            }
            setUser(profile);
          } catch (e) {
            console.error("Error loading user profile:", e);
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: "Authenticated User",
              role: "student"
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      const localUser = localStorage.getItem("lms_current_user");
      if (localUser) {
        setUser(JSON.parse(localUser));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isValidConfig && auth) {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const users = await dbService.getUsers();
        const profile = users.find(u => u.id === credential.user.uid);
        setUser(profile);
        return profile;
      } else {
        const users = await dbService.getUsers();
        const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (matched) {
          localStorage.setItem("lms_current_user", JSON.stringify(matched));
          setUser(matched);
          return matched;
        } else {
          throw new Error("Invalid email or password.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name, role) => {
    setLoading(true);
    try {
      if (isValidConfig && auth) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const profileData = {
          id: credential.user.uid,
          name,
          email,
          role,
          createdAt: new Date().toISOString()
        };
        const profile = await dbService.createUserProfile(credential.user.uid, profileData);
        setUser(profile);
        return profile;
      } else {
        const users = await dbService.getUsers();
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error("Email already exists.");
        }
        const profileData = {
          id: `user-${Date.now()}`,
          name,
          email,
          password, // Store locally plain-text for easy project demo testing
          role,
          createdAt: new Date().toISOString()
        };
        const profile = await dbService.createUserProfile(profileData.id, profileData);
        localStorage.setItem("lms_current_user", JSON.stringify(profile));
        setUser(profile);
        return profile;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isValidConfig && auth) {
        await signOut(auth);
      } else {
        localStorage.removeItem("lms_current_user");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
