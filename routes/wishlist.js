const express = require('express');
const router = express.Router();
const db = require('../config/supabase');
const { protect } = require('../middleware/auth');

// @GET /api/wishlist
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const wishlist = await db.wishlist.getByUserId(userId);
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/wishlist/:productId - toggle
router.post('/:productId', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const result = await db.wishlist.toggle(userId, req.params.productId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
