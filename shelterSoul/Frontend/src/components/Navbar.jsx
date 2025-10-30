import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { Heart, User, Menu, X, Shield } from 'lucide-react'
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav className="navbar custom-navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <Heart className="logo-icon" />
          <span>Shelter Soul</span>
        </Link>

        {/* Navigation Menu */}
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/')}`}
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/browse"
            className={`nav-link ${isActive('/browse')}`}
            onClick={closeMenu}
          >
            Browse Pets
          </Link>

          <Link
            to="/about"
            className={`nav-link ${isActive('/about')}`}
            onClick={closeMenu}
          >
            About Us
          </Link>

          <Link
            to="/contact"
            className={`nav-link ${isActive('/contact')}`}
            onClick={closeMenu}
          >
            Contact Us
          </Link>

          {user ? (
            <>
              <Link
                to="/favorites"
                className={`nav-link ${isActive('/favorites')}`}
                onClick={closeMenu}
              >
                <Heart size={18} />
                Favorites
              </Link>

              <Link
                to="/profile"
                className={`nav-link ${isActive('/profile')}`}
                onClick={closeMenu}
              >
                <User size={18} />
                Profile
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`nav-link admin-link ${isActive('/admin')}`}
                  onClick={closeMenu}
                >
                  <Shield size={18} />
                  Admin
                </Link>
              )}

              <button className="nav-link logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${isActive('/login')}`}
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/register"
                className={`nav-link register-btn ${isActive('/register')}`}
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="nav-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
