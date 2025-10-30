import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const PetDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // used for fallback fetching
  const [pet, setPet] = useState(state?.pet || null);
  const [loading, setLoading] = useState(!state?.pet);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch pet only if not passed through navigation state
    if (!pet) {
      const fetchPet = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/pets/${id}`);
          if (!response.ok) throw new Error("Failed to fetch pet details");
          const data = await response.json();
          setPet(data);
        } catch (err) {
          console.error("Error fetching pet details:", err);
          setError("Could not load pet details.");
        } finally {
          setLoading(false);
        }
      };

      fetchPet();
    }
  }, [id, pet]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading pet details...</p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-2xl text-gray-600 mb-4">
          {error || "No pet details found."}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full overflow-hidden">
        <img
          src={
            pet.image ||
            pet.primaryImage?.url ||
            "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg"
          }
          alt={pet.name}
          className="w-full h-96 object-cover"
        />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-3">{pet.name}</h1>
          <p className="text-gray-600 mb-1">
            <strong>Type:</strong> {pet.type || pet.species}
          </p>
          <p className="text-gray-600 mb-1">
            <strong>Breed:</strong> {pet.breed}
          </p>
          <p className="text-gray-600 mb-1">
            <strong>Age:</strong> {pet.age}
          </p>
          <p className="text-gray-700 mt-4">{pet.description}</p>

          <button className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition">
            Adopt {pet.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
