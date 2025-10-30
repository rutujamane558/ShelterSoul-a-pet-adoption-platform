const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Pet = require('../models/Pet');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all pets with filtering and pagination
// @route   GET /api/pets
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('species').optional().isIn(['dog', 'cat', 'rabbit', 'bird', 'other']).withMessage('Invalid species'),
  query('age').optional().isIn(['puppy/kitten', 'young', 'adult', 'senior']).withMessage('Invalid age'),
  query('gender').optional().isIn(['male', 'female']).withMessage('Invalid gender'),
  query('size').optional().isIn(['small', 'medium', 'large', 'extra-large']).withMessage('Invalid size'),
  query('status').optional().isIn(['available', 'pending', 'adopted']).withMessage('Invalid status')
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    if (req.query.species) filter.species = req.query.species;
    if (req.query.age) filter.age = req.query.age;
    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.size) filter.size = req.query.size;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.location) filter.location = new RegExp(req.query.location, 'i');
    if (req.query.breed) filter.breed = new RegExp(req.query.breed, 'i');
    if (req.query.search) {
      filter.$or = [
        { name: new RegExp(req.query.search, 'i') },
        { breed: new RegExp(req.query.search, 'i') },
        { description: new RegExp(req.query.search, 'i') }
      ];
    }

    // Default to available pets for public access
    if (!req.query.status) {
      filter.status = 'available';
    }

    const pets = await Pet.find(filter)
      .populate('shelter', 'fullName email phone')
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Pet.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: pets,
      pagination: {
        currentPage: page,
        totalPages,
        totalPets: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pets'
    });
  }
});

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('shelter', 'fullName email phone address')
      .populate('adoptedBy', 'fullName email');

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    // Increment view count
    pet.views += 1;
    await pet.save();

    res.json({
      success: true,
      data: pet
    });
  } catch (error) {
    console.error('Get pet error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pet'
    });
  }
});

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private (Admin only)
router.post('/', protect, adminOnly, [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Pet name must be between 1 and 50 characters'),
  body('species')
    .isIn(['dog', 'cat', 'rabbit', 'bird', 'other'])
    .withMessage('Invalid species'),
  body('breed')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Breed must be between 1 and 100 characters'),
  body('age')
    .isIn(['puppy/kitten', 'young', 'adult', 'senior'])
    .withMessage('Invalid age'),
  body('gender')
    .isIn(['male', 'female'])
    .withMessage('Invalid gender'),
  body('size')
    .isIn(['small', 'medium', 'large', 'extra-large'])
    .withMessage('Invalid size'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('location')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('adoptionFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Adoption fee must be a positive number')
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

    const petData = {
      ...req.body,
      shelter: req.user.id
    };

    const pet = await Pet.create(petData);
    await pet.populate('shelter', 'fullName email phone');

    res.status(201).json({
      success: true,
      message: 'Pet created successfully',
      data: pet
    });
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating pet'
    });
  }
});

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private (Admin only)
router.put('/:id', protect, adminOnly, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Pet name must be between 1 and 50 characters'),
  body('species')
    .optional()
    .isIn(['dog', 'cat', 'rabbit', 'bird', 'other'])
    .withMessage('Invalid species'),
  body('breed')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Breed must be between 1 and 100 characters'),
  body('age')
    .optional()
    .isIn(['puppy/kitten', 'young', 'adult', 'senior'])
    .withMessage('Invalid age'),
  body('gender')
    .optional()
    .isIn(['male', 'female'])
    .withMessage('Invalid gender'),
  body('size')
    .optional()
    .isIn(['small', 'medium', 'large', 'extra-large'])
    .withMessage('Invalid size'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('status')
    .optional()
    .isIn(['available', 'pending', 'adopted'])
    .withMessage('Invalid status'),
  body('adoptionFee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Adoption fee must be a positive number')
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

    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('shelter', 'fullName email phone');

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    res.json({
      success: true,
      message: 'Pet updated successfully',
      data: pet
    });
  } catch (error) {
    console.error('Update pet error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating pet'
    });
  }
});

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    await Pet.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Pet deleted successfully'
    });
  } catch (error) {
    console.error('Delete pet error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting pet'
    });
  }
});

// @desc    Get featured pets
// @route   GET /api/pets/featured
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const pets = await Pet.find({ featured: true, status: 'available' })
      .populate('shelter', 'fullName')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: pets
    });
  } catch (error) {
    console.error('Get featured pets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured pets'
    });
  }
});

module.exports = router;