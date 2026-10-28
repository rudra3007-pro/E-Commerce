const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/supabase');
const { protect } = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    const exists = await db.users.findByEmail(email);
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await db.users.create({ name, email, password, phone });
    res.status(201).json({
      _id: user.id || user._id,
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id || user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.users.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({
        _id: user.id || user._id,
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user.id || user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// @PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const updated = await db.users.update(userId, req.body);
    const { password, ...safe } = updated;
    res.json({ ...safe, token: generateToken(userId) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/auth/address
router.post('/address', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await db.users.findById(userId);
    const { street, city, state, pincode, isDefault } = req.body;
    let addresses = Array.isArray(user.addresses) ? [...user.addresses] : [];
    if (isDefault) addresses.forEach(a => a.isDefault = false);
    addresses.push({ _id: 'addr_' + Date.now(), street, city, state, pincode, isDefault: isDefault || false });
    const updated = await db.users.update(userId, { addresses });
    res.json(updated.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @DELETE /api/auth/address/:id
router.delete('/address/:id', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user = await db.users.findById(userId);
    let addresses = Array.isArray(user.addresses) ? user.addresses.filter(a => a._id !== req.params.id) : [];
    const updated = await db.users.update(userId, { addresses });
    res.json(updated.addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
