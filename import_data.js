const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Product = require('./backend/models/productModel');
const User = require('./backend/models/userModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error(`Error connecting to MongoDB: ${err.message}`);
  process.exit(1);
});

// Define sample data for products
const products = [
  {
    name: 'MORVEN',
    brand: 'MORVEN',
    description: 'MORVEN Cigarettes',
    costPrice: 120,
    salePrice: 150,
    currentStock: 175,
    minStockLevel: 50,
    sku: 'MORVEN-001',
    isActive: true,
    category: 'Cigarettes',
  },
  {
    name: 'CLASSIC',
    brand: 'CLASSIC',
    description: 'CLASSIC Cigarettes',
    costPrice: 130,
    salePrice: 160,
    currentStock: 34,
    minStockLevel: 30,
    sku: 'CLASSIC-001',
    isActive: true,
    category: 'Cigarettes',
  },
  {
    name: 'DIPLO',
    brand: 'DIPLO',
    description: 'DIPLO Cigarettes',
    costPrice: 110,
    salePrice: 140,
    currentStock: 31,
    minStockLevel: 30,
    sku: 'DIPLO-001',
    isActive: true,
    category: 'Cigarettes',
  },
  {
    name: 'RED & WHITE',
    brand: 'RED & WHITE',
    description: 'RED & WHITE Cigarettes',
    costPrice: 125,
    salePrice: 155,
    currentStock: 4.3,
    minStockLevel: 10,
    sku: 'RED-WHITE-001',
    isActive: true,
    category: 'Cigarettes',
  },
  {
    name: 'MARLBORO GOLD',
    brand: 'MARLBORO',
    description: 'MARLBORO GOLD Cigarettes',
    costPrice: 200,
    salePrice: 250,
    currentStock: 6.4,
    minStockLevel: 10,
    sku: 'MARLBORO-GOLD-001',
    isActive: true,
    category: 'Cigarettes',
  },
  {
    name: 'CRAFTED BY MLB',
    brand: 'CRAFTED',
    description: 'CRAFTED BY MLB Cigarettes',
    costPrice: 180,
    salePrice: 220,
    currentStock: 14.8,
    minStockLevel: 15,
    sku: 'CRAFTED-MLB-001',
    isActive: true,
    category: 'Cigarettes',
  }
];

// Define sample users
const users = [
  {
    name: 'Owner',
    email: 'owner',
    password: 'password123',
    role: 'owner',
  },
  {
    name: 'Admin',
    email: 'admin',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Salesman 1',
    email: 'salesman1',
    password: 'password123',
    role: 'salesman',
  },
  {
    name: 'Salesman 2',
    email: 'salesman2',
    password: 'password123',
    role: 'salesman',
  }
];

// Function to import data
const importData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Create owner user first
    const ownerUser = await User.create(users[0]);
    console.log('Owner user created');

    // Add user ID to products
    const productsWithUser = products.map(product => {
      return { ...product, user: ownerUser._id };
    });

    // Import products
    await Product.insertMany(productsWithUser);
    console.log('Products imported');

    // Import other users
    for (let i = 1; i < users.length; i++) {
      await User.create(users[i]);
    }
    console.log('All users imported');

    console.log('Data import completed');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

// Run the import
importData(); 