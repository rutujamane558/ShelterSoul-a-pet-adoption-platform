import React from "react";
import { useFavorites } from "../contexts/FavoritesContext.jsx";
import { Heart, Trash2, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Favorites.css";

const Favorites = () => {
  const { favorites, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  return (
    <div className="favorites-page">
      <h1>
        <Heart size={22} color="#ff4b5c" /> Your Favorite Pets
      </h1>
      <p className="subtitle">
        Here are all the pets you’ve marked as favorites.
      </p>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <Heart size={40} color="#ff4b5c" />
          <h3>No favorites yet</h3>
          <p>Browse pets and click the ❤️ icon to add them here.</p>
          <button onClick={() => navigate("/browse")} className="browse-btn">
            Browse Pets
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((pet) => (
            <div key={pet._id} className="favorite-card">
              <div className="fav-img-container">
                <img
                  src={
                    pet.primaryImage?.url ||
                    "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
                  }
                  alt={pet.name}
                  className="fav-img"
                />

                <span className="fav-type">{pet.species}</span>
                <button
                  className="remove-btn"
                  onClick={() => removeFavorite(pet._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="fav-content">
                <h3>{pet.name}</h3>
                <p className="breed">{pet.breed}</p>

                <div className="meta">
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>{pet.age}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{pet.location}</span>
                  </div>
                </div>

                {/* ✅ FIXED NAVIGATION */}
                <button
                  className="view-btn"
                  onClick={() => {
                    if (pet._id) {
                      navigate(`/pet/${pet._id}`, { state: { pet } }); // ✅ Pass full pet object here
                    } else {
                      alert("Pet details not available");
                    }
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
