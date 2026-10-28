const express = require('express');
const router = express.Router();
const db = require('../config/supabase');
const { protect } = require('../middleware/auth');

// @POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

    const userId = req.user.id || req.user._id;
    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const prodId = item.product?._id || item.product?.id || item.product;
      const product = await db.products.findById(prodId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name || product?.name || 'a product'}` });
      }
      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      itemsPrice += price * item.quantity;
      orderItems.push({
        product: product.id || product._id,
        name: product.name,
        image: (product.images && product.images[0]) || '',
        price,
        quantity: item.quantity
      });
      // Update stock
      await db.products.update(product.id || product._id, {
        stock: product.stock - item.quantity,
        sold: (product.sold || 0) + item.quantity
      });
    }

    const shippingPrice = itemsPrice > 500 ? 0 : 49;
    const totalAmount = itemsPrice + shippingPrice;

    const order = await db.orders.create({
      userId,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      itemsPrice,
      shippingPrice,
      totalAmount
    });

    // Clear user cart
    await db.cart.clear(userId);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/orders/my
router.get('/my', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const orders = await db.orders.getByUserId(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await db.orders.getById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const userId = req.user.id || req.user._id;
    const orderUserId = order.user?.id || order.user?._id || order.user_id || order.user;
    if (orderUserId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
