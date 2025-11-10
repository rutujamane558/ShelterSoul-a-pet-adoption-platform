const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Pet = require('../models/Pet');

/**
 * @desc    Get all favorite pets for logged-in user
 * @route   GET /api/favorites
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('favorites', 'name species breed images status');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching favorites'
    });
  }
});

/**
 * @desc    Add a pet to favorites
 * @route   POST /api/favorites/:petId
 * @access  Private
 */
router.post('/:petId', protect, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent duplicate favorites
    if (user.favorites.includes(pet._id)) {
      return res.status(400).json({
        success: false,
        message: 'Pet already in favorites'
      });
    }

    user.favorites.push(pet._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Pet added to favorites successfully',
      data: user.favorites
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to favorites'
    });
  }
});

/**
 * @desc    Remove a pet from favorites
 * @route   DELETE /api/favorites/:petId
 * @access  Private
 */
router.delete('/:petId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const petIndex = user.favorites.indexOf(req.params.petId);

    if (petIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Pet not found in favorites'
      });
    }

    user.favorites.splice(petIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Pet removed from favorites successfully',
      data: user.favorites
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from favorites'
    });
  }
});

module.exports = router;
