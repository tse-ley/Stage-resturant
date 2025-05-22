import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Form, Modal } from 'react-bootstrap';
import '../index.css';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { handleApiError } from '../utils/errorHandling';

const Commande = () => {
  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    specialInstructions: '',
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckout = () => {
    setShowOrderModal(true);
    setErrorMessage('');
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    if (orderSuccess) {
      setOrderSuccess(false);
    }
    setErrorMessage('');
  };

  // Submit order to backend with retry logic
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setOrderSubmitting(true);
    setErrorMessage('');

    const maxRetries = 3;
    let retryCount = 0;

    const attemptSubmit = async () => {
      try {
        const orderData = {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          totalPrice: getCartTotal(),
          orderTime: new Date().toISOString(),
          specialInstructions: formData.specialInstructions
        };

        // Get session token from localStorage or your auth context
        const sessionToken = localStorage.getItem('sessionToken');

        const response = await axios.post(`http://localhost:5000/api/orders`, orderData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`,
          },
          timeout: 5000 // 5 second timeout
        });

        if (response.data.success) {
          setOrderSubmitting(false);
          setOrderSuccess(true);
          clearCart();
          
          // Store order reference for tracking
          localStorage.setItem('lastOrderId', response.data.orderId);
        } else {
          throw new Error(response.data.message || 'Failed to submit order');
        }

      } catch (error) {
        if (retryCount < maxRetries && error.code === 'ECONNABORTED') {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          return attemptSubmit();
        }

        setOrderSubmitting(false);
        const errorMsg = handleApiError(error);
        setErrorMessage(errorMsg);
        console.error('Order submission error:', error);
      }
    };

    await attemptSubmit();
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
                              onClick={() => removeFromCart(item.id)}
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
                    <div className="d-grid mt-4">
                      <Button 
                        variant="dark" 
                        size="lg" 
                        className="rounded-1"
                        onClick={handleCheckout}
                      >
                        Passer la commande
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>

      {/* Order Modal with Error Handling */}
      <Modal show={showOrderModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {orderSuccess ? 'Commande Confirmée' : 'Finaliser votre commande'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          {orderSuccess ? (
            <div className="text-center py-4">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
              <h4 className="mt-3">Merci pour votre commande!</h4>
              <p>Un email de confirmation a été envoyé à {formData.customerEmail}</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmitOrder}>
              <Form.Group className="mb-3">
                <Form.Label>Nom complet</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Instructions spéciales</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <div className="border-top pt-3 mt-4">
                <h6>Résumé de la commande:</h6>
                {cartItems.map(item => (
                  <div key={item.id} className="d-flex justify-content-between mb-2">
                    <span>{item.quantity}x {item.name}</span>
                    <span>{(item.price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
                <div className="d-flex justify-content-between mt-3 fw-bold">
                  <span>Total</span>
                  <span>{getCartTotal().toFixed(2)} €</span>
                </div>
              </div>

              <div className="d-grid mt-4">
                <Button 
                  variant="dark" 
                  type="submit" 
                  disabled={orderSubmitting}
                >
                  {orderSubmitting ? 'Traitement en cours...' : 'Confirmer la commande'}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
        {orderSuccess && (
          <Modal.Footer>
            <Button variant="outline-dark" onClick={handleCloseModal}>Fermer</Button>
            <Button variant="dark" href="/menu">Commander à nouveau</Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default Commande;