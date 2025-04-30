// Mock product data for demonstration purposes
const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    imageUrl: "https://images.pexels.com/photos/3394665/pexels-photo-3394665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "electronics",
    rating: 4.5,
    reviewCount: 123
  },
  {
    id: 2,
    name: "Ultra HD Smart TV - 55\"",
    price: 699.99,
    imageUrl: "https://images.pexels.com/photos/6782582/pexels-photo-6782582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "electronics",
    rating: 4.8,
    reviewCount: 92
  },
  {
    id: 3,
    name: "Designer Watch - Stainless Steel",
    price: 249.99,
    imageUrl: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "fashion",
    rating: 4.3,
    reviewCount: 78
  },
  {
    id: 4,
    name: "Leather Crossbody Bag",
    price: 79.99,
    imageUrl: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "fashion",
    rating: 4.1,
    reviewCount: 56
  },
  {
    id: 5,
    name: "Smartphone - 128GB",
    price: 899.99,
    imageUrl: "https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "electronics",
    rating: 4.7,
    reviewCount: 204
  },
  {
    id: 6,
    name: "Running Shoes - All Terrain",
    price: 129.99,
    imageUrl: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "sports",
    rating: 4.6,
    reviewCount: 87
  },
  {
    id: 7,
    name: "Coffee Maker - Programmable",
    price: 89.99,
    imageUrl: "https://images.pexels.com/photos/6802982/pexels-photo-6802982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "home",
    rating: 4.2,
    reviewCount: 62
  },
  {
    id: 8,
    name: "Digital Camera - 24MP",
    price: 599.99,
    imageUrl: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "electronics",
    rating: 4.4,
    reviewCount: 42
  }
];

// Simulate API call to fetch products
export const getProducts = () => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(products);
    }, 800);
  });
};

// Get product by ID
export const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = products.find(p => p.id === parseInt(id));
      
      if (product) {
        resolve(product);
      } else {
        reject(new Error('Product not found'));
      }
    }, 300);
  });
};

// In a real app, these functions would make actual API calls
// Example:
/*
export const getProducts = async () => {
  try {
    const response = await fetch('https://api.example.com/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
*/