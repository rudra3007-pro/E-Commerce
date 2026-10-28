const express = require('express');
const router = express.Router();
const db = require('../config/supabase');
const { protect } = require('../middleware/auth');

// @GET /api/products
router.get('/', async (req, res) => {
  try {
    const { keyword, category, brand, minPrice, maxPrice, sort, page = 1, limit = 12, featured } = req.query;
    const result = await db.products.find({
      keyword, category, brand, minPrice, maxPrice, sort,
      page: Number(page), limit: Number(limit), featured
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const cats = await db.products.getCategories();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await db.products.findById(req.params.id);
    if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/products/:id/review
router.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id || req.user._id;
    await db.products.addReview(req.params.id, {
      userId,
      userName: req.user.name,
      rating: Number(rating),
      comment
    });
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
