const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  experience: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: ['first-time', 'some', 'experienced']
  },
  housing: {
    type: String,
    required: [true, 'Housing situation is required'],
    enum: ['house-yard', 'house-no-yard', 'apartment', 'other']
  },
  otherPets: {
    type: String,
    required: [true, 'Other pets information is required'],
    enum: ['none', 'dogs', 'cats', 'both', 'other']
  },
  workSchedule: {
    type: String,
    maxlength: [200, 'Work schedule cannot exceed 200 characters']
  },
  references: [{
    name: {
      type: String,
      required: true,
      maxlength: [100, 'Reference name cannot exceed 100 characters']
    },
    phone: {
      type: String,
      required: true,
      match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
    },
    relationship: {
      type: String,
      required: true,
      maxlength: [50, 'Relationship cannot exceed 50 characters']
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewDate: {
    type: Date,
    default: null
  },
  reviewNotes: {
    type: String,
    maxlength: [500, 'Review notes cannot exceed 500 characters']
  },
  meetingScheduled: {
    type: Date,
    default: null
  },
  meetingNotes: {
    type: String,
    maxlength: [500, 'Meeting notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
adoptionRequestSchema.index({ user: 1, status: 1 });
adoptionRequestSchema.index({ pet: 1, status: 1 });
adoptionRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AdoptionRequest', adoptionRequestSchema);