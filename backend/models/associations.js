import Product from './Product.js';
import CartItem from './CartItem.js';

const defineAssociations = () => {
  
  Product.hasMany(CartItem, {
    foreignKey: 'productId',
    as: 'cartItems'
  });

  CartItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'Product'
  });
};

export default defineAssociations;