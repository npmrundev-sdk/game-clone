"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { useRouter } from "next/navigation";

import { auth } from "@/components/lib/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // =========================
  // Auth State
  // =========================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (currentUser) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
          });
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================
  // Login
  // =========================

  const login = async ({ email, password }) => {
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    setUser({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
    });

    return userCredential.user;
  };

  // =========================
  // Signup
  // =========================

  const signup = async ({
    email,
    password,
  }) => {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    setUser({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
    });

    return userCredential.user;
  };

  // =========================
  // Logout
  // =========================

  const logout = async () => {
    try {
      await signOut(auth);

      setUser(null);

      // Go to Home Page
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);