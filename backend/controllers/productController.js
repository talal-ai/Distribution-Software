const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    brand,
    description,
    costPrice,
    salePrice,
    currentStock,
    minStockLevel,
    sku,
    category,
    variant,
  } = req.body;

  // Validate required fields
  if (!name || !brand || !costPrice || !salePrice) {
    res.status(400);
    throw new Error('Please provide name, brand, cost price, and sale price');
  }

  // Check if product with same SKU exists
  if (sku) {
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      res.status(400);
      throw new Error('Product with this SKU already exists');
    }
  }

  // Create product
  const product = await Product.create({
    name,
    brand,
    description,
    costPrice,
    salePrice,
    currentStock: currentStock || 0,
    minStockLevel: minStockLevel || 0,
    sku,
    category,
    variant,
    user: req.user._id,
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error('Invalid product data');
  }
});

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = asyncHandler(async (req, res) => {
  // Query parameters
  const { brand, category, search, sortBy, sortOrder, limit, page } = req.query;

  // Build query
  const query = {};

  // Filter by brand
  if (brand) {
    query.brand = brand;
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Search by name or description
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Set default pagination values
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * pageSize;

  // Set default sort
  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  } else {
    sort.name = 1; // Default sort by name ascending
  }

  // Execute query
  const products = await Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(pageSize);

  // Get total count
  const count = await Product.countDocuments(query);

  res.status(200).json({
    products,
    page: pageNumber,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Private
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if updating SKU and if it already exists
  if (req.body.sku && req.body.sku !== product.sku) {
    const existingProduct = await Product.findOne({ sku: req.body.sku });
    if (existingProduct) {
      res.status(400);
      throw new Error('Product with this SKU already exists');
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedProduct);
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
}; 