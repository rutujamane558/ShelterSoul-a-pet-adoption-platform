import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useFavorites } from "../contexts/FavoritesContext.jsx";
import { mockPets } from "../data/mockData.js";
import {
  Search,
  ListFilter as Filter,
  Heart,
  MapPin,
  Calendar,
} from "lucide-react";
import "./Browse.css";

const Browse = () => {
  // ✅ Safe destructuring in case AuthContext is missing or incomplete
  const { API_BASE_URL = "", user = null, mockMode = true } = useAuth() || {};
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    species: "",
    age: "",
    gender: "",
    size: "",
    location: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPets: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPets();
  }, [filters, pagination.currentPage]);

  // ✅ Always loads mockPets for now (for testing)
  const fetchPets = async () => {
    setLoading(true);
    try {
      // Use mock data always (for frontend testing)
      let filteredPets = [...mockPets];

      // Apply filters
      if (filters.search) {
        filteredPets = filteredPets.filter(
          (pet) =>
            pet.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            pet.breed.toLowerCase().includes(filters.search.toLowerCase()) ||
            pet.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      if (filters.species) {
        filteredPets = filteredPets.filter(
          (pet) => pet.species === filters.species
        );
      }
      if (filters.age) {
        filteredPets = filteredPets.filter((pet) => pet.age === filters.age);
      }
      if (filters.gender) {
        filteredPets = filteredPets.filter(
          (pet) => pet.gender === filters.gender
        );
      }
      if (filters.size) {
        filteredPets = filteredPets.filter((pet) => pet.size === filters.size);
      }
      if (filters.location) {
        filteredPets = filteredPets.filter((pet) =>
          pet.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      setPets(filteredPets);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalPets: filteredPets.length,
      });
    } catch (error) {
      console.error("Error fetching pets:", error);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      species: "",
      age: "",
      gender: "",
      size: "",
      location: "",
    });
  };

  return (
    <div className="browse">
      <div className="container">
        <div className="browse-header">
          <h1>Find Your Perfect Pet</h1>
          <p>
            Browse through our collection of loving pets waiting for their
            forever homes
          </p>
        </div>

        {/* 🔍 Search Section */}
        <div className="search-section">
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, breed, or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <button
            className="filter-toggle"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* 🧩 Filters Panel */}
        {showFilters && (
          <div className="filters-panel active">
            <div className="filters-grid">
              <select
                value={filters.species}
                onChange={(e) => handleFilterChange("species", e.target.value)}
              >
                <option value="">All Species</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
                <option value="rabbit">Rabbits</option>
                <option value="bird">Birds</option>
                <option value="other">Other</option>
              </select>

              <select
                value={filters.age}
                onChange={(e) => handleFilterChange("age", e.target.value)}
              >
                <option value="">All Ages</option>
                <option value="puppy/kitten">Puppy/Kitten</option>
                <option value="young">Young</option>
                <option value="adult">Adult</option>
                <option value="senior">Senior</option>
              </select>

              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <select
                value={filters.size}
                onChange={(e) => handleFilterChange("size", e.target.value)}
              >
                <option value="">All Sizes</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>

              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />

              <button className="clear-filters" onClick={clearFilters}>
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* 🐾 Pets Grid */}
        <div className="pets-grid">
          {loading ? (
            <p>Loading pets...</p>
          ) : pets.length > 0 ? (
            pets.map((pet) => (
              <div key={pet._id} className="pet-card">
                <div className="pet-image">
                  <img
                    src={
                      pet.images?.[0]?.url ||
                      "https://placekitten.com/400/300"
                    }
                    alt={pet.name}
                  />
                  <div className="pet-badge">{pet.species}</div>

                  {user && (
                    <button
                      className={`favorite-btn ${
                        isFavorite(pet._id) ? "active" : ""
                      }`}
                      onClick={() =>
                        isFavorite(pet._id)
                          ? removeFavorite(pet._id)
                          : addFavorite(pet)
                      }
                    >
                      <Heart size={20} />
                    </button>
                  )}
                </div>

                <div className="pet-info">
                  <h3>{pet.name}</h3>
                  <p className="pet-breed">{pet.breed}</p>
                  <div className="pet-details">
                    <span className="pet-age">
                      <Calendar size={16} />
                      {pet.age}
                    </span>
                    <span className="pet-gender">{pet.gender}</span>
                  </div>
                  <div className="pet-location">
                    <MapPin size={16} />
                    {pet.location}
                  </div>
                  <Link
                    to={`/pet/${pet._id}`}
                    className="btn btn-primary btn-small"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <Heart size={48} />
              <h3>No pets found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
