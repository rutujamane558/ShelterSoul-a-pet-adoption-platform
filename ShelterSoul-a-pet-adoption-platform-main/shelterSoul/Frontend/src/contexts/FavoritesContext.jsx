import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user, API_BASE_URL, mockMode } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // ✅ Load favorites from backend or localStorage (mockMode)
  useEffect(() => {
    if (user) {
      if (mockMode) {
        const saved = JSON.parse(localStorage.getItem("mockFavorites")) || [];
        setFavorites(saved);
      } else {
        fetchFavorites();
      }
    } else {
      // ✅ if user logs out or not logged in, clear favorites
      setFavorites([]);
    }
  }, [user]);

  // ✅ Fetch favorites from backend
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  // ✅ Add a pet to favorites
  const addFavorite = async (pet) => {
    if (!user) return alert("Please log in to add favorites.");

    // prevent duplicates
    if (favorites.some((p) => p._id === pet._id)) {
      alert(`${pet.name} is already in favorites.`);
      return;
    }

    try {
      if (mockMode) {
        const updated = [...favorites, pet];
        setFavorites(updated);
        localStorage.setItem("mockFavorites", JSON.stringify(updated));
        alert(`${pet.name} added to favorites!`);
        return;
      }

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ petId: pet._id }),
      });

      if (res.ok) {
        const updated = [...favorites, pet];
        setFavorites(updated);
        alert(`${pet.name} added to favorites!`);
      }
    } catch (err) {
      console.error("Error adding favorite:", err);
    }
  };

  // ✅ Remove a pet from favorites
  const removeFavorite = async (petId) => {
    if (!user) return;

    try {
      if (mockMode) {
        const updated = favorites.filter((p) => p._id !== petId);
        setFavorites(updated);
        localStorage.setItem("mockFavorites", JSON.stringify(updated));
        return;
      }

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/favorites/${petId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setFavorites((prev) => prev.filter((p) => p._id !== petId));
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  // ✅ Check if a pet is in favorites
  const isFavorite = (petId) => favorites.some((p) => p._id === petId);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        fetchFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
