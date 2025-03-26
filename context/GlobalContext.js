"use client"
import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

const GlobalContext = createContext();

async function handleUser(token) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    return response.json();
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
      if (!cookieToken) {
        redirect("/login");
      } else {
        setToken(cookieToken);
      }
    }
  }, []);
  const fetchForms = async (token,setFormData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/forms`, { token });
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };
  useEffect(()=>{
    fetchForms(token,setFormData);
  },[]);
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
