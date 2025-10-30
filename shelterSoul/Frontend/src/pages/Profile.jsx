import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { User, Mail, Phone, MapPin, Calendar, Heart, FileText } from 'lucide-react'
import './Profile.css'

const Profile = () => {
  const { user, API_BASE_URL } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [adoptionRequests, setAdoptionRequests] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchAdoptionRequests()
    }
  }, [activeTab])

  const fetchAdoptionRequests = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/adoptions/my-requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setAdoptionRequests(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching adoption requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12'
      case 'approved': return '#27ae60'
      case 'rejected': return '#e74c3c'
      case 'withdrawn': return '#95a5a6'
      default: return '#3498db'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="profile">
      <div className="container">
        {/* ---------- Profile Header ---------- */}
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-info">
            <h1>{user.fullName}</h1>
            <p className="profile-role">{user.role === 'admin' ? 'Shelter Administrator' : 'Pet Adopter'}</p>
            <p className="profile-member-since">Member since {formatDate(user.createdAt)}</p>
          </div>
        </div>

        {/* ---------- Tabs ---------- */}
        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} /> Profile
          </button>

          <button 
            className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <FileText size={20} /> Adoption Requests
          </button>
        </div>

        {/* ---------- Profile Content ---------- */}
        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-details">
              {/* Personal Info */}
              <div className="details-card">
                <h2>Personal Information</h2>
                <div className="details-grid">
                  <div className="detail-item">
                    <Mail className="detail-icon" />
                    <div>
                      <label>Email</label>
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Phone className="detail-icon" />
                    <div>
                      <label>Phone</label>
                      <span>{user.phone}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <MapPin className="detail-icon" />
                    <div>
                      <label>Address</label>
                      <span>{user.address}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Calendar className="detail-icon" />
                    <div>
                      <label>Member Since</label>
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Favorites */}
              {user.favorites && user.favorites.length > 0 && (
                <div className="favorites-card">
                  <h2>
                    <Heart className="section-icon" />
                    Favorite Pets ({user.favorites.length})
                  </h2>
                  <div className="favorites-grid">
                    {user.favorites.map(pet => (
                      <div key={pet._id} className="favorite-pet">
                        <img 
                          src={
                            pet?.images && pet.images.length > 0 && pet.images[0].url
                              ? pet.images[0].url
                              : 'https://placekitten.com/300/200'
                          }
                          alt={pet.name || 'Favorite Pet'}
                          onError={(e) => { e.target.src = 'https://placekitten.com/300/200'; }}
                        />
                        <div className="pet-info">
                          <h3>{pet.name}</h3>
                          <p>{pet.breed}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------- Adoption Requests ---------- */}
          {activeTab === 'requests' && (
            <div className="adoption-requests">
              <h2>Your Adoption Requests</h2>
              
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading requests...</p>
                </div>
              ) : adoptionRequests.length > 0 ? (
                <div className="requests-list">
                  {adoptionRequests.map(request => (
                    <div key={request._id} className="request-card">
                      <div className="request-header">
                        <div className="pet-info">
                          <img 
                            src={
                              request.pet?.images?.[0]?.url ||
                              'https://placekitten.com/200/200'
                            }
                            alt={request.pet?.name}
                            onError={(e) => { e.target.src = 'https://placekitten.com/200/200'; }}
                          />
                          <div>
                            <h3>{request.pet?.name}</h3>
                            <p>{request.pet?.breed} • {request.pet?.species}</p>
                          </div>
                        </div>
                        <div 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(request.status) }}
                        >
                          {request.status}
                        </div>
                      </div>
                      
                      <div className="request-details">
                        <p><strong>Submitted:</strong> {formatDate(request.createdAt)}</p>
                        <p><strong>Experience:</strong> {request.experience}</p>
                        <p><strong>Housing:</strong> {request.housing}</p>
                        {request.reviewDate && (
                          <p><strong>Reviewed:</strong> {formatDate(request.reviewDate)}</p>
                        )}
                        {request.reviewNotes && (
                          <div className="review-notes">
                            <strong>Review Notes:</strong>
                            <p>{request.reviewNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-requests">
                  <FileText size={48} />
                  <h3>No adoption requests yet</h3>
                  <p>When you apply to adopt a pet, your requests will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
