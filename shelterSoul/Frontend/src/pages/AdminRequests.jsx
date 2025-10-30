import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import './AdminRequests.css';

import { 
  FileText, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Check,
  X,
  Eye,
  Filter
} from 'lucide-react'
import './AdminRequests.css'

const AdminRequests = () => {
  const { API_BASE_URL } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({
    status: ''
  })
  const [reviewForm, setReviewForm] = useState({
    status: '',
    reviewNotes: ''
  })

  useEffect(() => {
    fetchRequests()
  }, [filters])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const queryParams = new URLSearchParams({
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      })

      const response = await fetch(`${API_BASE_URL}/adoptions?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setRequests(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewRequest = (request) => {
    setSelectedRequest(request)
    setReviewForm({
      status: request.status,
      reviewNotes: request.reviewNotes || ''
    })
    setShowModal(true)
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/adoptions/${selectedRequest._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewForm)
      })

      const data = await response.json()
      
      if (response.ok) {
        alert(`Request ${reviewForm.status} successfully!`)
        setShowModal(false)
        fetchRequests()
      } else {
        alert(data.message || 'Error updating request')
      }
    } catch (error) {
      console.error('Error updating request:', error)
      alert('Error updating request')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  const getExperienceLabel = (experience) => {
    switch (experience) {
      case 'first-time': return 'First-time owner'
      case 'some': return 'Some experience'
      case 'experienced': return 'Very experienced'
      default: return experience
    }
  }

  const getHousingLabel = (housing) => {
    switch (housing) {
      case 'house-yard': return 'House with yard'
      case 'house-no-yard': return 'House without yard'
      case 'apartment': return 'Apartment'
      case 'other': return 'Other'
      default: return housing
    }
  }

  const getOtherPetsLabel = (otherPets) => {
    switch (otherPets) {
      case 'none': return 'No other pets'
      case 'dogs': return 'Dogs'
      case 'cats': return 'Cats'
      case 'both': return 'Dogs and cats'
      case 'other': return 'Other pets'
      default: return otherPets
    }
  }

  return (
    <div className="admin-requests">
      <div className="container">
        <div className="page-header">
          <h1>Adoption Requests</h1>
          <p>Review and manage adoption applications</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-controls">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading requests...</p>
          </div>
        ) : (
          <div className="requests-list">
            {requests.length > 0 ? (
              requests.map(request => (
                <div key={request._id} className="request-card">
                  <div className="request-header">
                    <div className="applicant-info">
                      <h3>{request.user?.fullName}</h3>
                      <p>Interested in <strong>{request.pet?.name}</strong></p>
                      <div className="request-meta">
                        <span className="date">
                          <Calendar size={14} />
                          {formatDate(request.createdAt)}
                        </span>
                        <span className="experience">
                          {getExperienceLabel(request.experience)}
                        </span>
                      </div>
                    </div>
                    <div className="request-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(request.status) }}
                      >
                        {request.status}
                      </span>
                      <button 
                        onClick={() => handleViewRequest(request)}
                        className="btn btn-outline btn-small"
                      >
                        <Eye size={16} />
                        Review
                      </button>
                    </div>
                  </div>

                  <div className="request-preview">
                    <div className="pet-info">
                      <img 
                        src={request.pet?.images?.[0]?.url || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100'} 
                        alt={request.pet?.name}
                      />
                      <div>
                        <h4>{request.pet?.name}</h4>
                        <p>{request.pet?.breed} • {request.pet?.species}</p>
                      </div>
                    </div>
                    <div className="applicant-details">
                      <div className="detail">
                        <Mail size={14} />
                        {request.user?.email}
                      </div>
                      <div className="detail">
                        <Phone size={14} />
                        {request.user?.phone}
                      </div>
                      <div className="detail">
                        <MapPin size={14} />
                        {request.user?.address}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-requests">
                <FileText size={48} />
                <h3>No adoption requests found</h3>
                <p>Requests will appear here when users apply to adopt pets</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {showModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h2>Adoption Request Details</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="close-btn"
              >
                <X size={24} />
              </button>
            </div>

            <div className="request-details">
              {/* Pet Information */}
              <div className="details-section">
                <h3>Pet Information</h3>
                <div className="pet-card">
                  <img 
                    src={selectedRequest.pet?.images?.[0]?.url || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=200'} 
                    alt={selectedRequest.pet?.name}
                  />
                  <div>
                    <h4>{selectedRequest.pet?.name}</h4>
                    <p>{selectedRequest.pet?.breed} • {selectedRequest.pet?.species}</p>
                    <p>Status: {selectedRequest.pet?.status}</p>
                  </div>
                </div>
              </div>

              {/* Applicant Information */}
              <div className="details-section">
                <h3>Applicant Information</h3>
                <div className="applicant-grid">
                  <div className="info-item">
                    <User size={16} />
                    <span>{selectedRequest.user?.fullName}</span>
                  </div>
                  <div className="info-item">
                    <Mail size={16} />
                    <span>{selectedRequest.user?.email}</span>
                  </div>
                  <div className="info-item">
                    <Phone size={16} />
                    <span>{selectedRequest.user?.phone}</span>
                  </div>
                  <div className="info-item">
                    <MapPin size={16} />
                    <span>{selectedRequest.user?.address}</span>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="details-section">
                <h3>Application Details</h3>
                <div className="application-info">
                  <div className="info-row">
                    <strong>Experience Level:</strong>
                    <span>{getExperienceLabel(selectedRequest.experience)}</span>
                  </div>
                  <div className="info-row">
                    <strong>Housing Situation:</strong>
                    <span>{getHousingLabel(selectedRequest.housing)}</span>
                  </div>
                  <div className="info-row">
                    <strong>Other Pets:</strong>
                    <span>{getOtherPetsLabel(selectedRequest.otherPets)}</span>
                  </div>
                  {selectedRequest.workSchedule && (
                    <div className="info-row">
                      <strong>Work Schedule:</strong>
                      <span>{selectedRequest.workSchedule}</span>
                    </div>
                  )}
                </div>

                <div className="message-section">
                  <strong>Message:</strong>
                  <p>{selectedRequest.message}</p>
                </div>

                {selectedRequest.references && selectedRequest.references.length > 0 && (
                  <div className="references-section">
                    <strong>References:</strong>
                    {selectedRequest.references.map((ref, index) => (
                      <div key={index} className="reference">
                        <p><strong>{ref.name}</strong> - {ref.relationship}</p>
                        <p>Phone: {ref.phone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Section */}
              <div className="details-section">
                <h3>Review Application</h3>
                <form onSubmit={handleReviewSubmit} className="review-form">
                  <div className="form-group">
                    <label>Decision</label>
                    <select
                      value={reviewForm.status}
                      onChange={(e) => setReviewForm({...reviewForm, status: e.target.value})}
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Review Notes</label>
                    <textarea
                      value={reviewForm.reviewNotes}
                      onChange={(e) => setReviewForm({...reviewForm, reviewNotes: e.target.value})}
                      rows="4"
                      placeholder="Add notes about your decision..."
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminRequests