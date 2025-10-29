import express from 'express';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';

const router = express.Router();

// POST /api/checkout
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;

    const cartItems = await CartItem.findAll({
      include: [{
        model: Product,
        as: 'Product'
      }]
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.Product.price) * item.quantity);
    }, 0);

    const receipt = {
      orderId: `ORD-${Date.now()}`,
      customer: { name, email },
      items: cartItems.map(item => ({
        product: item.Product.name,
        quantity: item.quantity,
        price: parseFloat(item.Product.price),
        subtotal: parseFloat(item.Product.price) * item.quantity
      })),
      total: parseFloat(total.toFixed(2)),
      timestamp: new Date().toISOString()
    };

    await CartItem.destroy({ where: {} });

    res.json(receipt);
  } catch (error) {
    console.error('Error in POST /api/checkout:', error);
    res.status(500).json({ error: 'Checkout failed: ' + error.message });
  }
});

export default router;