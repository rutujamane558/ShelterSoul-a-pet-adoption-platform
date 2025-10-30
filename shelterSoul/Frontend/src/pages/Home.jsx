import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { mockPets, mockStats } from "../data/mockData.js";
import { Heart, Search, Shield, Users, ArrowRight } from "lucide-react";
import "./Home.css";

const Home = () => {
  const { API_BASE_URL, mockMode } = useAuth();
  const [featuredPets, setFeaturedPets] = useState([]);
  const [stats, setStats] = useState({
    totalPets: 0,
    adoptedPets: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPets();
    fetchStats();
  }, []);

  // ✅ Fetch Featured Pets (uses mock data)
  const fetchFeaturedPets = async () => {
    try {
      if (mockMode) {
        const featured = mockPets.filter((pet) => pet.featured).slice(0, 6);
        setFeaturedPets(featured);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/pets/featured/list`);
      if (response.ok) {
        const data = await response.json();
        setFeaturedPets(data.data || []);
      } else {
        const featured = mockPets.filter((pet) => pet.featured).slice(0, 6);
        setFeaturedPets(featured);
      }
    } catch (error) {
      console.error("Error fetching featured pets:", error);
      const featured = mockPets.filter((pet) => pet.featured).slice(0, 6);
      setFeaturedPets(featured);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Stats (uses mock data)
  const fetchStats = async () => {
    try {
      if (mockMode) {
        setStats(mockStats);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/pets?limit=1`);
      if (response.ok) {
        const data = await response.json();
        setStats((prev) => ({
          ...prev,
          totalPets: data.pagination?.totalPets || 0,
        }));
      } else {
        setStats(mockStats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats(mockStats);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Find Your Perfect Companion</h1>
            <p>
              Connect with loving pets waiting for their forever homes. Every
              adoption saves a life and brings joy to your family.
            </p>
            <div className="hero-buttons">
              <Link to="/browse" className="btn btn-primary">
                <Search size={20} />
                Browse Pets
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Get Started
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Happy pets"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <Heart className="stat-icon" />
              <h3>{stats.totalPets}</h3>
              <p>Pets Available</p>
            </div>
            <div className="stat-card">
              <Users className="stat-icon" />
              <h3>500+</h3>
              <p>Happy Families</p>
            </div>
            <div className="stat-card">
              <Shield className="stat-icon" />
              <h3>50+</h3>
              <p>Partner Shelters</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="featured-pets">
        <div className="container">
          <div className="section-header">
            <h2>Featured Pets</h2>
            <p>Meet some of our special friends looking for homes</p>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="pet-card-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pets-grid">
              {featuredPets.length > 0 ? (
                featuredPets.map((pet) => (
                  <Link to={`/pet/${pet._id}`} key={pet._id} className="pet-card">
                    <div className="pet-image">
                      {/* ✅ Corrected image access */}
                      <img
                        src={
                          pet.images?.find((img) => img.isPrimary)?.url ||
                          pet.images?.[0]?.url ||
                          "https://placekitten.com/400/300"
                        }
                        alt={pet.name}
                      />
                      <div className="pet-badge">{pet.species}</div>
                    </div>
                    <div className="pet-info">
                      <h3>{pet.name}</h3>
                      <p>
                        {pet.breed} • {pet.age}
                      </p>
                      <div className="pet-location">{pet.location}</div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="no-pets">
                  <Heart size={48} />
                  <h3>No featured pets at the moment</h3>
                  <p>Check back soon for new arrivals!</p>
                </div>
              )}
            </div>
          )}

          <div className="section-footer">
            <Link to="/browse" className="btn btn-outline">
              View All Pets
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
