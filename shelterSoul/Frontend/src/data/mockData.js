// Mock data for demonstration when backend is not available
export const mockPets = [
  {
    _id: '1',
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 'adult',
    gender: 'male',
    size: 'large',
    color: 'Golden',
    description: 'Buddy is a friendly and energetic Golden Retriever who loves playing fetch and swimming. He is great with kids and other dogs. Buddy is house-trained and knows basic commands. He would make a perfect family companion.',
    location: 'New York, NY',
    images: [{
      url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
      isPrimary: true
    }],
    vaccinationStatus: true,
    spayedNeutered: true,
    microchipped: true,
    specialNeeds: '',
    adoptionFee: 250,
    status: 'available',
    views: 45,
    featured: true,
    shelter: {
      fullName: 'Happy Paws Shelter',
      email: 'contact@happypaws.com',
      phone: '(555) 123-4567'
    },
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: '2',
    name: 'Luna',
    species: 'cat',
    breed: 'Siamese',
    age: 'young',
    gender: 'female',
    size: 'medium',
    color: 'Cream and Brown',
    description: 'Luna is a beautiful Siamese cat with striking blue eyes. She is very affectionate and loves to cuddle. Luna is litter-trained and gets along well with other cats. She would thrive in a quiet home.',
    location: 'Los Angeles, CA',
    images: [{
      url: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=800',
      isPrimary: true
    }],
    vaccinationStatus: true,
    spayedNeutered: true,
    microchipped: false,
    specialNeeds: '',
    adoptionFee: 150,
    status: 'available',
    views: 32,
    featured: true,
    shelter: {
      fullName: 'Feline Friends Rescue',
      email: 'info@felinefriends.org',
      phone: '(555) 987-6543'
    },
    createdAt: '2024-01-20T14:15:00Z'
  },
  {
    _id: '3',
    name: 'Max',
    species: 'dog',
    breed: 'German Shepherd',
    age: 'adult',
    gender: 'male',
    size: 'large',
    color: 'Black and Tan',
    description: 'Max is a loyal and intelligent German Shepherd. He is well-trained and would make an excellent guard dog. Max loves long walks and playing in the yard. He needs an experienced owner.',
    location: 'Chicago, IL',
    images: [{
      url: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=800',
      isPrimary: true
    }],
    vaccinationStatus: true,
    spayedNeutered: true,
    microchipped: true,
    specialNeeds: 'Needs experienced owner',
    adoptionFee: 300,
    status: 'available',
    views: 67,
    featured: false,
    shelter: {
      fullName: 'City Animal Shelter',
      email: 'adopt@cityanimalshelter.org',
      phone: '(555) 456-7890'
    },
    createdAt: '2024-01-10T09:45:00Z'
  },
  {
    _id: '4',
    name: 'Bella',
    species: 'cat',
    breed: 'Persian',
    age: 'senior',
    gender: 'female',
    size: 'medium',
    color: 'White',
    description: 'Bella is a gentle senior Persian cat looking for a quiet retirement home. She loves to sit by the window and watch birds. Bella is very calm and would be perfect for someone looking for a low-maintenance companion.',
    location: 'Miami, FL',
    images: [{
      url: 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=800',
      isPrimary: true
    }],
    vaccinationStatus: true,
    spayedNeutered: true,
    microchipped: true,
    specialNeeds: 'Senior cat, needs regular vet checkups',
    adoptionFee: 100,
    status: 'available',
    views: 23,
    featured: false,
    shelter: {
      fullName: 'Senior Pet Sanctuary',
      email: 'care@seniorpets.org',
      phone: '(555) 321-0987'
    },
    createdAt: '2024-01-25T16:20:00Z'
  },
  {
    _id: '5',
    name: 'Charlie',
    species: 'dog',
    breed: 'Labrador Mix',
    age: 'young',
    gender: 'male',
    size: 'medium',
    color: 'Chocolate Brown',
    description: 'Charlie is a playful young Labrador mix who loves everyone he meets. He is great with children and other pets. Charlie is house-trained and knows basic commands. He would love an active family.',
    location: 'Austin, TX',
    images: [{
      url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
      isPrimary: true
    }],
    vaccinationStatus: true,
    spayedNeutered: false,
    microchipped: true,
    specialNeeds: '',
    adoptionFee: 200,
    status: 'available',
    views: 89,
    featured: true,
    shelter: {
      fullName: 'Austin Animal Center',
      email: 'info@austinanimalcenter.org',
      phone: '(555) 654-3210'
    },
    createdAt: '2024-01-18T11:30:00Z'
  },
  {
    _id: '6',
    name: 'Whiskers',
    species: 'cat',
    breed: 'Tabby',
    age: 'adult',
    gender: 'male',
    size: 'medium',
    color: 'Orange Tabby',
    description: 'Whiskers is a friendly orange tabby who loves attention. He is very social and enjoys being around people. Whiskers is litter-trained and would do well in most homes. He loves to play with toys.',
    location: 'Seattle, WA',
    images: [{
      url: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=800',
      isPrimary: true
    }],
    vaccinationStatus: true,
    spayedNeutered: true,
    microchipped: false,
    specialNeeds: '',
    adoptionFee: 125,
    status: 'available',
    views: 41,
    featured: false,
    shelter: {
      fullName: 'Seattle Humane Society',
      email: 'adopt@seattlehumane.org',
      phone: '(555) 789-0123'
    },
    createdAt: '2024-01-22T13:45:00Z'
  },
  {
    _id: '7',
    name: 'Rocky',
    species: 'dog',
    breed: 'Pit Bull Mix',
    age: 'adult',
    gender: 'male',
    size: 'large',
    color: 'Brindle',
    description: 'Rocky is a strong and loyal Pit Bull mix looking for an experienced owner. He is very protective and would make a great guard dog. Rocky needs proper training and socialization but is very loving with his family.',
    location: 'Phoenix, AZ',
    images: [{
      url: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800',
      isPrimary: true
    }],
    vaccinationStatus: true,
    spayedNeutered: true,
    microchipped: true,
    specialNeeds: 'Needs experienced owner, no small children',
    adoptionFee: 175,
    status: 'available',
    views: 28,
    featured: false,
    shelter: {
      fullName: 'Desert Dog Rescue',
      email: 'rescue@desertdogs.org',
      phone: '(555) 234-5678'
    },
    createdAt: '2024-01-12T08:15:00Z'
  },
  {
    _id: '8',
    name: 'Princess',
    species: 'cat',
    breed: 'Maine Coon',
    age: 'young',
    gender: 'female',
    size: 'large',
    color: 'Gray and White',
    description: 'Princess is a beautiful Maine Coon with a fluffy coat and gentle personality. She loves to be brushed and enjoys quiet companionship. Princess would do well in a calm household with older children.',
    location: 'Boston, MA',
    images: [{
      url: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=800',
      isPrimary: true
    }],
    vaccinationStatus: true,
    spayedNeutered: true,
    microchipped: true,
    specialNeeds: 'Requires regular grooming',
    adoptionFee: 200,
    status: 'available',
    views: 56,
    featured: true,
    shelter: {
      fullName: 'New England Cat Rescue',
      email: 'info@necatrescue.org',
      phone: '(555) 345-6789'
    },
    createdAt: '2024-01-28T15:00:00Z'
  }
];

export const mockStats = {
  totalPets: mockPets.length,
  availablePets: mockPets.filter(pet => pet.status === 'available').length,
  adoptedPets: 15,
  pendingRequests: 8,
  totalUsers: 150
};

export const mockAdoptionRequests = [
  {
    _id: '1',
    user: {
      _id: '2',
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St, New York, NY'
    },
    pet: {
      _id: '1',
      name: 'Buddy',
      species: 'dog',
      breed: 'Golden Retriever',
      images: [{
        url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=200'
      }]
    },
    message: 'I would love to adopt Buddy. I have experience with dogs and a large yard.',
    experience: 'some',
    housing: 'house-yard',
    otherPets: 'none',
    workSchedule: '9-5 weekdays, work from home 2 days',
    references: [
      { name: 'Jane Smith', phone: '(555) 987-6543', relationship: 'Friend' },
      { name: 'Dr. Wilson', phone: '(555) 456-7890', relationship: 'Veterinarian' }
    ],
    status: 'pending',
    createdAt: '2024-01-29T10:30:00Z'
  },
  {
    _id: '2',
    user: {
      _id: '3',
      fullName: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 234-5678',
      address: '456 Oak Ave, Los Angeles, CA'
    },
    pet: {
      _id: '2',
      name: 'Luna',
      species: 'cat',
      breed: 'Siamese',
      images: [{
        url: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=200'
      }]
    },
    message: 'Luna would be perfect for my quiet apartment. I work from home and can give her lots of attention.',
    experience: 'experienced',
    housing: 'apartment',
    otherPets: 'cats',
    workSchedule: 'Work from home',
    references: [
      { name: 'Mike Brown', phone: '(555) 345-6789', relationship: 'Neighbor' },
      { name: 'Pet Store Owner', phone: '(555) 678-9012', relationship: 'Professional' }
    ],
    status: 'approved',
    reviewedBy: {
      fullName: 'Admin User'
    },
    reviewDate: '2024-01-30T14:20:00Z',
    reviewNotes: 'Great application, experienced cat owner.',
    createdAt: '2024-01-28T16:45:00Z'
  }
];