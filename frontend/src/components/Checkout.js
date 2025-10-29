import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const Checkout = ({ show, onHide, cart, onCheckoutSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE}/checkout`, formData);
      setReceipt(response.data);
      onCheckoutSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onHide();
    setReceipt(null);
    setFormData({ name: '', email: '' });
    setError('');
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {receipt ? 'Order Confirmation' : 'Checkout'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {receipt ? (
          <div>
            <Alert variant="success">
              <h5>Thank you for your order!</h5>
              <p className="mb-0">Order ID: {receipt.orderId}</p>
            </Alert>
            
            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">Customer Information</h6>
              </Card.Header>
              <Card.Body>
                <p><strong>Name:</strong> {receipt.customer.name}</p>
                <p><strong>Email:</strong> {receipt.customer.email}</p>
                <p><strong>Order Date:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <h6 className="mb-0">Order Details</h6>
              </Card.Header>
              <Card.Body>
                {receipt.items.map((item, index) => (
                  <Row key={index} className="mb-2">
                    <Col>{item.product}</Col>
                    <Col>Qty: {item.quantity}</Col>
                    <Col>${item.subtotal.toFixed(2)}</Col>
                  </Row>
                ))}
                <hr />
                <Row>
                  <Col>
                    <strong>Total: ${receipt.total}</strong>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </Form.Group>

            <Card className="mb-3">
              <Card.Header>
                <h6 className="mb-0">Order Summary</h6>
              </Card.Header>
              <Card.Body>
                <p><strong>Total Amount:</strong> ${cart.total}</p>
              </Card.Body>
            </Card>

            <div className="d-grid">
              <Button 
                variant="success" 
                type="submit" 
                size="lg"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
      
      {receipt && (
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Continue Shopping
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default Checkout;