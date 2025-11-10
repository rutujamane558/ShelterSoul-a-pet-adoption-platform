import React, { useState } from "react";
import axios from "axios";

const AddPet = () => {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    size: "",
    color: "",
    description: "",
    location: "",
    imageUrl: "",
    vaccinationStatus: false,
    spayedNeutered: false,
    microchipped: false,
    adoptionFee: 0,
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const images = [{ url: formData.imageUrl, publicId: "local-temp" }];
      await axios.post(
        "http://localhost:5000/api/pets/add",
        { ...formData, images },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Pet added successfully!");
      setFormData({
        name: "",
        species: "",
        breed: "",
        age: "",
        gender: "",
        size: "",
        color: "",
        description: "",
        location: "",
        imageUrl: "",
        vaccinationStatus: false,
        spayedNeutered: false,
        microchipped: false,
        adoptionFee: 0,
      });
    } catch (error) {
      alert("Error: " + error.response?.data?.message);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h2>Add Pet for Adoption</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "10px", maxWidth: "400px", margin: "auto" }}
      >
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <select name="species" value={formData.species} onChange={handleChange} required>
          <option value="">Select Species</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="rabbit">Rabbit</option>
          <option value="bird">Bird</option>
          <option value="other">Other</option>
        </select>
        <input name="breed" placeholder="Breed" value={formData.breed} onChange={handleChange} required />
        <select name="age" value={formData.age} onChange={handleChange} required>
          <option value="">Select Age</option>
          <option value="puppy/kitten">Puppy/Kitten</option>
          <option value="young">Young</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input name="size" placeholder="Size (small/medium/large)" value={formData.size} onChange={handleChange} required />
        <input name="color" placeholder="Color" value={formData.color} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} required />
        <label>
          <input type="checkbox" name="vaccinationStatus" checked={formData.vaccinationStatus} onChange={handleChange} /> Vaccinated
        </label>
        <label>
          <input type="checkbox" name="spayedNeutered" checked={formData.spayedNeutered} onChange={handleChange} /> Spayed/Neutered
        </label>
        <label>
          <input type="checkbox" name="microchipped" checked={formData.microchipped} onChange={handleChange} /> Microchipped
        </label>
        <input type="number" name="adoptionFee" placeholder="Adoption Fee" value={formData.adoptionFee} onChange={handleChange} />
        <button type="submit" style={{ background: "#ff4b5c", color: "#fff", padding: "10px" }}>
          Add Pet
        </button>
      </form>
    </div>
  );
};

export default AddPet;
