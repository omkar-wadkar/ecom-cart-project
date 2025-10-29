import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Nav, Badge } from 'react-bootstrap';
import axios from 'axios';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [activeTab, setActiveTab] = useState('products');
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_BASE}/cart`);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(`${API_BASE}/cart`, { productId, quantity: 1 });
      fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`${API_BASE}/cart/${cartItemId}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">Vibe Commerce</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link 
              active={activeTab === 'products'} 
              onClick={() => setActiveTab('products')}
            >
              Products
            </Nav.Link>
            <Nav.Link 
              active={activeTab === 'cart'} 
              onClick={() => setActiveTab('cart')}
            >
              Cart <Badge bg="primary">{getCartItemCount()}</Badge>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container>
        {activeTab === 'products' && (
          <ProductList 
            products={products} 
            onAddToCart={addToCart} 
          />
        )}
        
        {activeTab === 'cart' && (
          <Cart 
            cart={cart}
            onRemoveFromCart={removeFromCart}
            onCheckout={() => setShowCheckout(true)}
          />
        )}
      </Container>

      <Checkout 
        show={showCheckout}
        onHide={() => setShowCheckout(false)}
        cart={cart}
        onCheckoutSuccess={fetchCart}
      />
    </div>
  );
}

export default App;