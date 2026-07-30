import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../axios";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data } = await axiosClient.get("/fetch_settings");

      setSettings(data);

      // Manova dynamique ny favicon ihany
      if (data?.favicon) {
        const link = document.querySelector("link[rel~='icon']");

        if (link) {
          link.href = `${import.meta.env.VITE_API_BASE_URL}/storage/${data.favicon}`;
        } else {
          const newLink = document.createElement("link");
          newLink.rel = "icon";
          newLink.href = `${import.meta.env.VITE_API_BASE_URL}/storage/${data.favicon}`;
          document.head.appendChild(newLink);
        }
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);