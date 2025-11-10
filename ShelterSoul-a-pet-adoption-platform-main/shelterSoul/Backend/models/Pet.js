const express = require("express");
const router = express.Router();
const Pet = require("../models/Pet");
const { protect } = require("../middleware/auth");

// 🐾 1. Add a new pet for adoption
router.post("/add", protect, async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      gender,
      size,
      color,
      description,
      location,
      images,
      vaccinationStatus,
      spayedNeutered,
      microchipped,
      specialNeeds,
      adoptionFee,
      featured,
    } = req.body;

    // create new pet
    const newPet = new Pet({
      name,
      species,
      breed,
      age,
      gender,
      size,
      color,
      description,
      location,
      images,
      vaccinationStatus,
      spayedNeutered,
      microchipped,
      specialNeeds,
      adoptionFee,
      featured,
      shelter: req.user._id, // Logged-in user becomes shelter
    });

    await newPet.save();
    res.status(201).json({ message: "Pet added successfully", pet: newPet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🐾 2. Get all available pets
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find({ status: "available" }).populate("shelter", "name email");
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🐾 3. Get pets added by the current user
router.get("/my-pets", protect, async (req, res) => {
  try {
    const pets = await Pet.find({ shelter: req.user._id });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🐾 4. Delete a pet (optional)
router.delete("/:id", protect, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) return res.status(404).json({ message: "Pet not found" });
    if (pet.shelter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await pet.deleteOne();
    res.json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
