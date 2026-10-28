const express = require('express');
const router = express.Router();
const db = require('../config/supabase');
const { protect } = require('../middleware/auth');

// @GET /api/cart
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const items = await db.cart.getByUserId(userId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/cart - add item
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id || req.user._id;
    const product = await db.products.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    const cart = await db.cart.addItem(userId, productId, quantity);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/cart/:productId - update quantity
router.put('/:productId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const userId = req.user.id || req.user._id;
    const cart = await db.cart.updateQuantity(userId, req.params.productId, quantity);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/cart/:productId
router.delete('/:productId', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const cart = await db.cart.removeItem(userId, req.params.productId);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/cart - clear
router.delete('/', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const cart = await db.cart.clear(userId);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
