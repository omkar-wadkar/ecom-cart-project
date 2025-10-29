import React from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';

const ProductList = ({ products, onAddToCart }) => {
  return (
    <div>
      <h2 className="mb-4">Products</h2>
      <Row>
        {products.map(product => (
          <Col key={product.id} md={4} className="mb-4">
            <Card className="h-100 product-card">
              <Card.Img 
                variant="top" 
                src={product.image} 
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.name}</Card.Title>
                <Card.Text className="flex-grow-1">
                  {product.description}
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <Badge bg="success" className="fs-6">
                    ${product.price}
                  </Badge>
                  <Button 
                    variant="primary" 
                    onClick={() => onAddToCart(product.id)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductList;