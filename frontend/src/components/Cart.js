import React from 'react';
import { Card, Table, Button, Row, Col, Alert } from 'react-bootstrap';

const Cart = ({ cart, onRemoveFromCart, onCheckout }) => {
  if (cart.items.length === 0) {
    return (
      <Alert variant="info">
        Your cart is empty. Start shopping!
      </Alert>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Shopping Cart</h2>
      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Cart Items</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.Product.image} 
                            alt={item.Product.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            className="me-3"
                          />
                          {item.Product.name}
                        </div>
                      </td>
                      <td>${item.Product.price}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.Product.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => onRemoveFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>${cart.total}</strong>
              </div>
              <Button 
                variant="success" 
                size="lg" 
                className="w-100"
                onClick={onCheckout}
              >
                Proceed to Checkout
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Cart;