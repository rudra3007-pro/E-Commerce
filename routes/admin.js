const express = require('express');
const router = express.Router();
const db = require('../config/supabase');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// === PRODUCTS ===
// @GET /api/admin/products
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await db.products.find({
      page: Number(page),
      limit: Number(limit),
      allStatus: true
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/admin/products
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, discountPrice, category, brand, images, stock, specifications, tags, isFeatured } = req.body;
    if (!name || !description || !price || !category || !brand) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    const product = await db.products.create({
      name, description, price, discountPrice, category, brand,
      images: images || [],
      stock: Number(stock || 0),
      specifications: specifications || [],
      tags: tags || [],
      isFeatured: Boolean(isFeatured)
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/admin/products/:id
router.put('/products/:id', async (req, res) => {
  try {
    const product = await db.products.update(req.params.id, req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    await db.products.delete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === ORDERS ===
// @GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const result = await db.orders.find({
      status,
      page: Number(page),
      limit: Number(limit)
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await db.orders.updateStatus(req.params.id, { orderStatus, paymentStatus });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === USERS ===
// @GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await db.users.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// === STATS ===
// @GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await db.orders.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
