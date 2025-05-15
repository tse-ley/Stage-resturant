import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import { useState } from 'react';
import '../index.css'; // Import your CSS file
import { useCart } from '../context/CartContext'; // Import useCart

const Commande = () => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart(); // Use CartContext functions

  const handlePlaceOrder = async () => {
    setLoading(true); // Set loading to true when the request starts
    setMessage(null); // Clear previous messages

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_items: cartItems, total_amount: getCartTotal() }),
      });

      if (response.ok) {
        setMessage('Commande passée avec succès!');
        clearCart(); // Clear the cart after successful order
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Erreur lors du passage de la commande.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setMessage('Erreur lors du passage de la commande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Main Content */}
      <div className="commande-container flex-grow-1">
        <Container>
          <h1 className="page-title mb-5">Votre Commande</h1>
          {cartItems.length === 0 ? (
            <Row className="justify-content-center">
              <Col md={8}>
                <Card className="text-center shadow-sm p-5">
                  <Card.Body>
                    <i className="bi bi-cart-x" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                    <h4 className="mt-3">Votre panier est vide</h4>
                    <p className="text-muted">Ajoutez des articles depuis le menu pour commencer votre commande.</p>
                    <Button variant="outline-dark" href="/menu" className="mt-3">
                      Voir le Menu
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <Row>
              {/* Cart Items */}
              <Col md={8}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5 className="mb-4">Articles dans votre panier</h5>
                    <ListGroup variant="flush">
                      {cartItems.map((item) => (
                        <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-0">{item.name}</h6>
                            <small className="text-muted">{item.description}</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className="me-3">{item.quantity} × {item.price.toFixed(2)} €</span>
                            <Button
                              variant="link"
                              className="text-danger p-0"
                              onClick={() => removeFromCart(item.id)} // Remove item from cart
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
              {/* Order Summary */}
              <Col md={4}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Résumé de la commande</h5>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span>Total</span>
                        <strong>{getCartTotal().toFixed(2)} €</strong>
                      </ListGroup.Item>
                    </ListGroup>
                    {/* Message alert */}
                    {message && (
                      <div className={`mt-3 alert ${message.includes('succès') ? 'alert-success' : 'alert-danger'}`} role="alert">
                        {message}
                      </div>
                    )}
                    <div className="d-grid mt-4">
                      <Button variant="dark" size="lg" className="rounded-1" onClick={handlePlaceOrder} disabled={loading}>
                        {loading ? 'Passage de la commande...' : 'Passer la commande'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
};

export default Commande;