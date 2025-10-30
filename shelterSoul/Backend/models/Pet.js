const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true,
    maxlength: [50, 'Pet name cannot exceed 50 characters']
  },
  species: {
    type: String,
    required: [true, 'Species is required'],
    enum: ['dog', 'cat', 'rabbit', 'bird', 'other'],
    lowercase: true
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true,
    maxlength: [100, 'Breed cannot exceed 100 characters']
  },
  age: {
    type: String,
    required: [true, 'Age is required'],
    enum: ['puppy/kitten', 'young', 'adult', 'senior']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female'],
    lowercase: true
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    enum: ['small', 'medium', 'large', 'extra-large']
  },
  color: {
    type: String,
    trim: true,
    maxlength: [50, 'Color cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  vaccinationStatus: {
    type: Boolean,
    default: false
  },
  spayedNeutered: {
    type: Boolean,
    default: false
  },
  microchipped: {
    type: Boolean,
    default: false
  },
  specialNeeds: {
    type: String,
    maxlength: [500, 'Special needs cannot exceed 500 characters']
  },
  adoptionFee: {
    type: Number,
    min: [0, 'Adoption fee cannot be negative'],
    default: 0
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'adopted'],
    default: 'available'
  },
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adoptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  adoptionDate: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better search performance
petSchema.index({ species: 1, status: 1 });
petSchema.index({ location: 1 });
petSchema.index({ createdAt: -1 });

// Virtual for primary image
petSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg || this.images[0] || null;
});

// Ensure virtual fields are serialized
petSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Pet', petSchema);