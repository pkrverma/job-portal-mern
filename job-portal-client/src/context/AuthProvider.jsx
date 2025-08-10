import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Fetch user role from database using UID first, then email as fallback
        try {
          let response = await fetch(
            `${import.meta.env.VITE_API_URL}/user-by-uid/${firebaseUser.uid}`
          );

          if (!response.ok && firebaseUser.email) {
            // Fallback to email if UID lookup fails
            response = await fetch(
              `${import.meta.env.VITE_API_URL}/user/${encodeURIComponent(
                firebaseUser.email
              )}`
            );
          }

          if (response.ok) {
            const userData = await response.json();
            setUserRole(userData.role || null);
          } else {
            setUserRole(null);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [auth]);

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
      // Redirect to login page after logout
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
