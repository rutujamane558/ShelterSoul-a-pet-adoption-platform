import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { mockPets, mockStats, mockAdoptionRequests } from '../data/mockData.js'
import './AdminDashboard.css'

import { 
  Heart, 
  Users, 
  FileText, 
  Plus, 
  TrendingUp,
  Calendar,
  MapPin,
  Eye
} from 'lucide-react'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { API_BASE_URL, mockMode } = useAuth()
  const [stats, setStats] = useState({
    totalPets: 0,
    availablePets: 0,
    adoptedPets: 0,
    pendingRequests: 0,
    totalUsers: 0
  })
  const [recentPets, setRecentPets] = useState([])
  const [recentRequests, setRecentRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      if (mockMode) {
        setStats(mockStats)
        setRecentPets(mockPets.slice(0, 5))
        setRecentRequests(mockAdoptionRequests)
        setLoading(false)
        return
      }

      const token = localStorage.getItem('token')
      
      // Fetch pets statistics
      const petsResponse = await fetch(`${API_BASE_URL}/pets?limit=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (petsResponse.ok) {
        const petsData = await petsResponse.json()
        setRecentPets(petsData.data || [])
        setStats(prev => ({
          ...prev,
          totalPets: petsData.pagination?.totalPets || 0
        }))
      } else {
        setRecentPets(mockPets.slice(0, 5))
        setStats(prev => ({ ...prev, totalPets: mockPets.length }))
      }

      // Fetch adoption requests
      const requestsResponse = await fetch(`${API_BASE_URL}/adoptions?limit=5`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json()
        setRecentRequests(requestsData.data || [])
        setStats(prev => ({
          ...prev,
          pendingRequests: requestsData.pagination?.totalRequests || 0
        }))
      } else {
        setRecentRequests(mockAdoptionRequests)
        setStats(prev => ({ ...prev, pendingRequests: mockAdoptionRequests.length }))
      }

      // Mock additional stats (in real app, these would come from API)
      setStats(prev => ({
        ...prev,
        availablePets: Math.floor(prev.totalPets * 0.7),
        adoptedPets: Math.floor(prev.totalPets * 0.3),
        totalUsers: 150
      }))

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Fallback to mock data
      setStats(mockStats)
      setRecentPets(mockPets.slice(0, 5))
      setRecentRequests(mockAdoptionRequests)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#27ae60'
      case 'pending': return '#f39c12'
      case 'adopted': return '#3498db'
      case 'approved': return '#27ae60'
      case 'rejected': return '#e74c3c'
      default: return '#95a5a6'
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your shelter's pets and adoption requests</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon pets">
              <Heart size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalPets}</h3>
              <p>Total Pets</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon available">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.availablePets}</h3>
              <p>Available</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon adopted">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.adoptedPets}</h3>
              <p>Adopted</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon requests">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.pendingRequests}</h3>
              <p>Pending Requests</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/pets" className="action-card">
              <Plus size={24} />
              <span>Add New Pet</span>
            </Link>
            <Link to="/admin/pets" className="action-card">
              <Heart size={24} />
              <span>Manage Pets</span>
            </Link>
            <Link to="/admin/requests" className="action-card">
              <FileText size={24} />
              <span>Review Requests</span>
            </Link>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Recent Pets */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Pets</h2>
              <Link to="/admin/pets" className="view-all">View All</Link>
            </div>
            
            {recentPets.length > 0 ? (
              <div className="recent-pets">
                {recentPets.map(pet => (
                  <div key={pet._id} className="pet-item">
                    <img 
                      src={pet.primaryImage?.url || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=200'} 
                      alt={pet.name}
                    />
                    <div className="pet-details">
                      <h3>{pet.name}</h3>
                      <p>{pet.breed} • {pet.species}</p>
                      <div className="pet-meta">
                        <span className="location">
                          <MapPin size={14} />
                          {pet.location}
                        </span>
                        <span className="views">
                          <Eye size={14} />
                          {pet.views} views
                        </span>
                      </div>
                    </div>
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(pet.status) }}
                    >
                      {pet.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <Heart size={32} />
                <p>No pets added yet</p>
              </div>
            )}
          </div>

          {/* Recent Adoption Requests */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Adoption Requests</h2>
              <Link to="/admin/requests" className="view-all">View All</Link>
            </div>
            
            {recentRequests.length > 0 ? (
              <div className="recent-requests">
                {recentRequests.map(request => (
                  <div key={request._id} className="request-item">
                    <div className="request-info">
                      <h3>{request.user?.fullName}</h3>
                      <p>Interested in {request.pet?.name}</p>
                      <div className="request-meta">
                        <span className="date">
                          <Calendar size={14} />
                          {formatDate(request.createdAt)}
                        </span>
                        <span className="experience">
                          Experience: {request.experience}
                        </span>
                      </div>
                    </div>
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(request.status) }}
                    >
                      {request.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <FileText size={32} />
                <p>No adoption requests yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard