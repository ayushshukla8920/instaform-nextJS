"use client"
import axios from "axios";
import { redirect } from "next/navigation";
import { createContext, useState, useContext, useEffect } from "react";

const GlobalContext = createContext();

async function handleUser(token) {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
      token: token
    });
    return response.data;
}
export const GlobalProvider = ({ children }) => {
  const [formData, setFormData] = useState([]);
  const [theme, setTheme] = useState("");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  useEffect(() => {
      if (typeof document !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if(!savedTheme){
        localStorage.setItem('theme','dark');
      }
      setTheme(savedTheme || 'dark');
      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      setToken(cookieToken);
    }
  }, []);
  useEffect(() => {
    if (token) {
      handleUser(token).then((data) => setUser(data));
    }
  }, [token]);

  return (
    <GlobalContext.Provider value={{ token, setToken, fadeOut, setFadeOut, loading, setLoading, user , setUser , theme, setTheme, formData, setFormData }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
