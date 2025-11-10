const express = require('express');
const { body, validationResult } = require('express-validator');
const AdoptionRequest = require('../models/AdoptionRequest');
const Pet = require('../models/Pet');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @desc    Create adoption request
// @route   POST /api/adoptions
// @access  Private
router.post('/', protect, [
  body('petId')
    .isMongoId()
    .withMessage('Invalid pet ID'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('experience')
    .isIn(['first-time', 'some', 'experienced'])
    .withMessage('Invalid experience level'),
  body('housing')
    .isIn(['house-yard', 'house-no-yard', 'apartment', 'other'])
    .withMessage('Invalid housing situation'),
  body('otherPets')
    .isIn(['none', 'dogs', 'cats', 'both', 'other'])
    .withMessage('Invalid other pets option')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { petId, message, experience, housing, otherPets, workSchedule, references } = req.body;

    // Check if pet exists and is available
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    if (pet.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Pet is not available for adoption'
      });
    }

    // Check if user already has a pending request for this pet
    const existingRequest = await AdoptionRequest.findOne({
      user: req.user.id,
      pet: petId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request for this pet'
      });
    }

    // Create adoption request
    const adoptionRequest = await AdoptionRequest.create({
      user: req.user.id,
      pet: petId,
      message,
      experience,
      housing,
      otherPets,
      workSchedule,
      references
    });

    await adoptionRequest.populate([
      { path: 'user', select: 'fullName email phone' },
      { path: 'pet', select: 'name species breed images' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Adoption request submitted successfully',
      data: adoptionRequest
    });
  } catch (error) {
    console.error('Create adoption request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating adoption request'
    });
  }
});

// @desc    Get user's adoption requests
// @route   GET /api/adoptions/my-requests
// @access  Private
router.get('/my-requests', protect, async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ user: req.user.id })
      .populate('pet', 'name species breed images status')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching adoption requests'
    });
  }
});

// @desc    Get all adoption requests (Admin only)
// @route   GET /api/adoptions
// @access  Private (Admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const requests = await AdoptionRequest.find(filter)
      .populate('user', 'fullName email phone address')
      .populate('pet', 'name species breed images status')
      .populate('reviewedBy', 'fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AdoptionRequest.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: requests,
      pagination: {
        currentPage: page,
        totalPages,
        totalRequests: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get adoption requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching adoption requests'
    });
  }
});

// @desc    Get single adoption request
// @route   GET /api/adoptions/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id)
      .populate('user', 'fullName email phone address')
      .populate('pet', 'name species breed images status location')
      .populate('reviewedBy', 'fullName');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Adoption request not found'
      });
    }

    // Check if user owns this request or is admin
    if (request.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Get adoption request error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Adoption request not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching adoption request'
    });
  }
});

// @desc    Update adoption request status
// @route   PUT /api/adoptions/:id/status
// @access  Private (Admin only)
router.put('/:id/status', protect, adminOnly, [
  body('status')
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Invalid status'),
  body('reviewNotes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Review notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, reviewNotes } = req.body;

    const request = await AdoptionRequest.findById(req.params.id)
      .populate('user', 'fullName email')
      .populate('pet', 'name status');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Adoption request not found'
      });
    }

    // Update request
    request.status = status;
    request.reviewedBy = req.user.id;
    request.reviewDate = new Date();
    if (reviewNotes) request.reviewNotes = reviewNotes;

    await request.save();

    // If approved, update pet status and add to user's adoption history
    if (status === 'approved') {
      await Pet.findByIdAndUpdate(request.pet._id, {
        status: 'adopted',
        adoptedBy: request.user._id,
        adoptionDate: new Date()
      });

      await User.findByIdAndUpdate(request.user._id, {
        $push: {
          adoptionHistory: {
            petId: request.pet._id,
            adoptionDate: new Date(),
            status: 'completed'
          }
        }
      });

      // Reject all other pending requests for this pet
      await AdoptionRequest.updateMany(
        {
          pet: request.pet._id,
          status: 'pending',
          _id: { $ne: request._id }
        },
        {
          status: 'rejected',
          reviewedBy: req.user.id,
          reviewDate: new Date(),
          reviewNotes: 'Pet has been adopted by another applicant'
        }
      );
    }

    await request.populate([
      { path: 'user', select: 'fullName email phone' },
      { path: 'pet', select: 'name species breed images' },
      { path: 'reviewedBy', select: 'fullName' }
    ]);

    res.json({
      success: true,
      message: `Adoption request ${status} successfully`,
      data: request
    });
  } catch (error) {
    console.error('Update adoption request status error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Adoption request not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating adoption request'
    });
  }
});

// @desc    Withdraw adoption request
// @route   PUT /api/adoptions/:id/withdraw
// @access  Private
router.put('/:id/withdraw', protect, async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Adoption request not found'
      });
    }

    // Check if user owns this request
    if (request.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Can only withdraw pending requests
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only withdraw pending requests'
      });
    }

    request.status = 'withdrawn';
    await request.save();

    res.json({
      success: true,
      message: 'Adoption request withdrawn successfully',
      data: request
    });
  } catch (error) {
    console.error('Withdraw adoption request error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Adoption request not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while withdrawing adoption request'
    });
  }
});

module.exports = router;