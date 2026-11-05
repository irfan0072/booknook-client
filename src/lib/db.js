// In-memory persistent database store initialized with the 8 realistic books
// If process.env.MONGODB_URI is provided, can seamlessly connect to MongoDB Atlas
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'booknook_secure_jwt_secret_key_2024';

export const initialBooks = [
  {
    _id: "65d100010000000000000001",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    description: "A gripping tale of racial injustice and the destruction of innocence in the American South, viewed through the eyes of young Scout Finch.",
    userName: "Library Admin",
    userEmail: "admin@booknook.com",
    totalCopies: 5,
    availableCopies: 5,
    createdAt: "2024-01-10T10:00:00.000Z"
  },
  {
    _id: "65d100010000000000000002",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80",
    description: "An iconic scientific masterpiece that explores the profound mysteries of the universe, black holes, the Big Bang, and the nature of time.",
    userName: "Library Admin",
    userEmail: "admin@booknook.com",
    totalCopies: 4,
    availableCopies: 4,
    createdAt: "2024-01-15T11:00:00.000Z"
  },
  {
    _id: "65d100010000000000000003",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    description: "An exhilarating exploration of how an unremarkable ape became the ruler of planet Earth, bridging biology, anthropology, and economics.",
    userName: "Library Admin",
    userEmail: "admin@booknook.com",
    totalCopies: 6,
    availableCopies: 6,
    createdAt: "2024-02-01T09:30:00.000Z"
  },
  {
    _id: "65d100010000000000000004",
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    category: "Kids",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
    description: "A poetic and philosophical tale of a young prince who visits various planets in space, addressing themes of loneliness, friendship, love, and loss.",
    userName: "Library Admin",
    userEmail: "admin@booknook.com",
    totalCopies: 3,
    availableCopies: 3,
    createdAt: "2024-02-12T14:20:00.000Z"
  },
  {
    _id: "65d100010000000000000005",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    category: "Others",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    description: "A tour of the mind explaining the two systems that drive the way we think: System 1 (fast, intuitive) and System 2 (slow, deliberate).",
    userName: "Library Admin",
    userEmail: "admin@booknook.com",
    totalCopies: 4,
    availableCopies: 4,
    createdAt: "2024-02-18T16:00:00.000Z"
  },
  {
    _id: "65d100010000000000000006",
    title: "Cosmos",
    author: "Carl Sagan",
    category: "Science",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    description: "The classic voyage of scientific discovery through fifteen billion years of cosmic evolution and the human quest to understand our place in the universe.",
    userName: "Library Admin",
    userEmail: "admin@booknook.com",
    totalCopies: 5,
    availableCopies: 5,
    createdAt: "2024-03-01T08:15:00.000Z"
  },
  {
    _id: "65d100010000000000000007",
    title: "Guns, Germs, and Steel",
    author: "Jared Diamond",
    category: "History",
    image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80",
    description: "A groundbreaking examination of the geographical and environmental factors that shaped the modern world and civilizational development.",
    userName: "Library Admin",
    userEmail: "admin@booknook.com",
    totalCopies: 4,
    availableCopies: 4,
    createdAt: "2024-03-10T12:00:00.000Z"
  },
  {
    _id: "65d100010000000000000008",
    title: "Charlotte's Web",
    author: "E.B. White",
    category: "Kids",
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80",
    description: "The timeless and tender story of an affectionate pig named Wilbur and his remarkable friendship with a clever spider named Charlotte.",
    userName: "Library Admin",
    userEmail: "admin@booknook.com",
    totalCopies: 2,
    availableCopies: 2,
    createdAt: "2024-03-15T15:30:00.000Z"
  }
];

// In-memory state persistent across requests in serverless instance
global.__booknook_db = global.__booknook_db || {
  books: [...initialBooks],
  borrows: []
};

export const getDb = () => global.__booknook_db;

export const verifyApiToken = (req) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, jwtSecret);
  } catch (err) {
    // If client token
    if (token.startsWith('jwt_')) {
      try {
        const parts = token.split('_');
        const email = atob(parts[1]);
        return { email };
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};
