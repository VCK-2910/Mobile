// context/GloballProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db, onAuthState } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";

interface GlobalContextType {
  user: FirebaseUser | null;
  profile: { username?: string; email?: string } | null;
  loading: boolean;
  isLogged: boolean;
  setUser: (u: FirebaseUser | null) => void;
  setIsLogged?: (isLogged: boolean) => void;
  refreshProfile: () => Promise<void>;  // ← thêm
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobalContext must be inside GlobalProvider");
  return ctx;
};

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]       = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<{ username?: string; email?: string; phoneNumber?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // hàm refresh lại profile từ Firestore
  const refreshProfile = async () => {
    if (!user) return;
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      setProfile(snap.data() as any);
    }
  };

  useEffect(() => {
    const unsub = onAuthState(async (fbUser: FirebaseUser | null) => {
      setUser(fbUser);
      if (fbUser) {
      const snap = await getDoc(doc(db, "users", fbUser.uid));
      if (snap.exists()) {
        setProfile(snap.data() as { username?: string; email?: string; phoneNumber?: string });
      }
      } else {
      setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        user,
        profile,
        loading,
        isLogged: !!user,
        setUser,
        refreshProfile,        // ← expose hàm mới
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
