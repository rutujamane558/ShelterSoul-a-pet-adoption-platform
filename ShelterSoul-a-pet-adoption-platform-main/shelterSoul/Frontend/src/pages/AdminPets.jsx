import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import './AdminPets.css';

import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  X,
  Upload,
  MapPin,
  Calendar
} from 'lucide-react'
import './AdminPets.css'

const AdminPets = () => {
  const { API_BASE_URL } = useAuth()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPet, setEditingPet] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    species: '',
    status: ''
  })
  const [petForm, setPetForm] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age: 'adult',
    gender: 'male',
    size: 'medium',
    color: '',
    description: '',
    location: '',
    vaccinationStatus: false,
    spayedNeutered: false,
    microchipped: false,
    specialNeeds: '',
    adoptionFee: 0,
    featured: false
  })

  useEffect(() => {
    fetchPets()
  }, [filters])

  const fetchPets = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const queryParams = new URLSearchParams({
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      })

      const response = await fetch(`${API_BASE_URL}/pets?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setPets(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching pets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('token')
      const url = editingPet 
        ? `${API_BASE_URL}/pets/${editingPet._id}`
        : `${API_BASE_URL}/pets`
      
      const method = editingPet ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(petForm)
      })

      const data = await response.json()
      
      if (response.ok) {
        alert(editingPet ? 'Pet updated successfully!' : 'Pet added successfully!')
        setShowModal(false)
        resetForm()
        fetchPets()
      } else {
        alert(data.message || 'Error saving pet')
      }
    } catch (error) {
      console.error('Error saving pet:', error)
      alert('Error saving pet')
    }
  }

  const handleEdit = (pet) => {
    setEditingPet(pet)
    setPetForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      size: pet.size,
      color: pet.color || '',
      description: pet.description,
      location: pet.location,
      vaccinationStatus: pet.vaccinationStatus,
      spayedNeutered: pet.spayedNeutered,
      microchipped: pet.microchipped,
      specialNeeds: pet.specialNeeds || '',
      adoptionFee: pet.adoptionFee,
      featured: pet.featured
    })
    setShowModal(true)
  }

  const handleDelete = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/pets/${petId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        alert('Pet deleted successfully!')
        fetchPets()
      } else {
        const data = await response.json()
        alert(data.message || 'Error deleting pet')
      }
    } catch (error) {
      console.error('Error deleting pet:', error)
      alert('Error deleting pet')
    }
  }

  const resetForm = () => {
    setEditingPet(null)
    setPetForm({
      name: '',
      species: 'dog',
      breed: '',
      age: 'adult',
      gender: 'male',
      size: 'medium',
      color: '',
      description: '',
      location: '',
      vaccinationStatus: false,
      spayedNeutered: false,
      microchipped: false,
      specialNeeds: '',
      adoptionFee: 0,
      featured: false
    })
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#27ae60'
      case 'pending': return '#f39c12'
      case 'adopted': return '#3498db'
      default: return '#95a5a6'
    }
  }

  return (
    <div className="admin-pets">
      <div className="container">
        <div className="page-header">
          <h1>Manage Pets</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Add New Pet
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search pets..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <select
              value={filters.species}
              onChange={(e) => handleFilterChange('species', e.target.value)}
            >
              <option value="">All Species</option>
              <option value="dog">Dogs</option>
              <option value="cat">Cats</option>
              <option value="rabbit">Rabbits</option>
              <option value="bird">Birds</option>
              <option value="other">Other</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="adopted">Adopted</option>
            </select>
          </div>
        </div>

        {/* Pets Table */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading pets...</p>
          </div>
        ) : (
          <div className="pets-table">
            {pets.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Pet</th>
                    <th>Details</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pets.map(pet => (
                    <tr key={pet._id}>
                      <td>
                        <div className="pet-cell">
                          <img 
                            src={pet.primaryImage?.url || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100'} 
                            alt={pet.name}
                          />
                          <div>
                            <h3>{pet.name}</h3>
                            <p>{pet.breed}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="pet-details">
                          <span>{pet.species} • {pet.age}</span>
                          <span>{pet.gender} • {pet.size}</span>
                        </div>
                      </td>
                      <td>
                        <div className="location">
                          <MapPin size={14} />
                          {pet.location}
                        </div>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(pet.status) }}
                        >
                          {pet.status}
                        </span>
                      </td>
                      <td>
                        <div className="views">
                          <Eye size={14} />
                          {pet.views}
                        </div>
                      </td>
                      <td>
                        <div className="actions">
                          <button 
                            onClick={() => handleEdit(pet)}
                            className="action-btn edit"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(pet._id)}
                            className="action-btn delete"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-pets">
                <Plus size={48} />
                <h3>No pets found</h3>
                <p>Add your first pet to get started</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pet Form Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h2>{editingPet ? 'Edit Pet' : 'Add New Pet'}</h2>
              <button 
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                className="close-btn"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="pet-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Pet Name</label>
                  <input
                    type="text"
                    value={petForm.name}
                    onChange={(e) => setPetForm({...petForm, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Species</label>
                  <select
                    value={petForm.species}
                    onChange={(e) => setPetForm({...petForm, species: e.target.value})}
                    required
                  >
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="bird">Bird</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Breed</label>
                  <input
                    type="text"
                    value={petForm.breed}
                    onChange={(e) => setPetForm({...petForm, breed: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Age</label>
                  <select
                    value={petForm.age}
                    onChange={(e) => setPetForm({...petForm, age: e.target.value})}
                    required
                  >
                    <option value="puppy/kitten">Puppy/Kitten</option>
                    <option value="young">Young</option>
                    <option value="adult">Adult</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={petForm.gender}
                    onChange={(e) => setPetForm({...petForm, gender: e.target.value})}
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Size</label>
                  <select
                    value={petForm.size}
                    onChange={(e) => setPetForm({...petForm, size: e.target.value})}
                    required
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    value={petForm.color}
                    onChange={(e) => setPetForm({...petForm, color: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={petForm.location}
                    onChange={(e) => setPetForm({...petForm, location: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Adoption Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={petForm.adoptionFee}
                    onChange={(e) => setPetForm({...petForm, adoptionFee: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={petForm.description}
                  onChange={(e) => setPetForm({...petForm, description: e.target.value})}
                  required
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Special Needs</label>
                <textarea
                  value={petForm.specialNeeds}
                  onChange={(e) => setPetForm({...petForm, specialNeeds: e.target.value})}
                  rows="2"
                />
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={petForm.vaccinationStatus}
                    onChange={(e) => setPetForm({...petForm, vaccinationStatus: e.target.checked})}
                  />
                  Vaccinated
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={petForm.spayedNeutered}
                    onChange={(e) => setPetForm({...petForm, spayedNeutered: e.target.checked})}
                  />
                  Spayed/Neutered
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={petForm.microchipped}
                    onChange={(e) => setPetForm({...petForm, microchipped: e.target.checked})}
                  />
                  Microchipped
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={petForm.featured}
                    onChange={(e) => setPetForm({...petForm, featured: e.target.checked})}
                  />
                  Featured Pet
                </label>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPet ? 'Update Pet' : 'Add Pet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPets