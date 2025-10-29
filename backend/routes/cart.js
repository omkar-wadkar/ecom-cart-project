import express from 'express';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      include: [{
        model: Product,
        as: 'Product'
      }]
    });

    console.log('Cart items found:', cartItems.length);

    const total = cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.Product.price) * item.quantity);
    }, 0);

    res.json({
      items: cartItems,
      total: parseFloat(total.toFixed(2))
    });
  } catch (error) {
    console.error('Error in GET /api/cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart: ' + error.message });
  }
});

// POST /api/cart
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    console.log('Adding to cart - Product ID:', productId, 'Quantity:', quantity);

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: `Product with ID ${productId} not found` });
    }

    let cartItem = await CartItem.findOne({
      where: { productId: parseInt(productId) }
    });

    if (cartItem) {
      
      cartItem.quantity += parseInt(quantity);
      await cartItem.save();
    } else {
      
      cartItem = await CartItem.create({
        productId: parseInt(productId),
        quantity: parseInt(quantity)
      });
    }

    const cartItemWithProduct = await CartItem.findByPk(cartItem.id, {
      include: [{
        model: Product,
        as: 'Product'
      }]
    });

    console.log('Cart item created/updated successfully');
    res.json(cartItemWithProduct);
  } catch (error) {
    console.error('Error in POST /api/cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart: ' + error.message });
  }
});

// DELETE /api/cart/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await CartItem.findByPk(id);

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.destroy();
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error in DELETE /api/cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart: ' + error.message });
  }
});

export default router;