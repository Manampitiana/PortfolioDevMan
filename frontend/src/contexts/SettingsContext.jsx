import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../axios";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data } = await axiosClient.get("/fetch_settings"); // Route public any amin'ny Laravel
      setSettings(data);
      
      // Manova dynamique ny Favicon sy ny Titre pejy
      if (data) {
        if (data.site_name) document.title = data.site_name;
        if (data.favicon) {
          const link = document.querySelector("link[rel~='icon']");
          if (link) link.href = `${import.meta.env.VITE_API_BASE_URL}/storage/${data.favicon}`;
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
    <SettingsContext.Provider value={{ settings, fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);