import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import heroImage from '../assets/cuisine/hero.JPG';
import momoImage from '../assets/cuisine/momo.jpeg'; 
import thaliImage from '../assets/cuisine/thali1.jpeg'; 
import templeImage from '../assets/restro/temple.jpeg';
import spiceImage from '../assets/cuisine/momo2.jpeg';
import foodImage from '../assets/cuisine/dish2.jpeg';
import dishImage from '../assets/cuisine/dish1.jpeg';
import dessertImage from '../assets/cuisine/dessert.jpeg';
import '../index.css';

import { Modal, Button, Form } from 'react-bootstrap';

const Home = () => {
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationSubmitting, setReservationSubmitting] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [mainFormData, setMainFormData] = useState({
    partySize: 2,
    reservationTime: '',
  });

  const [modalFormData, setModalFormData] = useState({
    customerName: '',
    customerEmail: ''
  });

  // Validate date and time
  const validateDateTime = (dateTimeStr) => {
    const selectedDate = new Date(dateTimeStr);
    const now = new Date();

    // Check if date is in the past
    if (selectedDate < now) {
      return "La date de réservation ne peut pas être dans le passé";
    }

    // Check if restaurant is open (assuming 11:00 to 22:00)
    const hours = selectedDate.getHours();
    if (hours < 11 || hours >= 22) {
      return "Les réservations sont possibles entre 11h00 et 22h00";
    }

    return null;
  };

  const handleMainFormChange = (e) => {
    const { name, value } = e.target;
    setMainFormData({ ...mainFormData, [name]: value });
    setErrorMessage(''); // Clear any previous error messages
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setModalFormData({ ...modalFormData, [name]: value });
  };

  const handleReservationClick = (e) => {
    e.preventDefault();
    
    // Validate the main form
    if (!mainFormData.partySize || !mainFormData.reservationTime) {
      setErrorMessage('Veuillez remplir tous les champs requis');
      return;
    }

    // Validate date and time
    const dateTimeError = validateDateTime(mainFormData.reservationTime);
    if (dateTimeError) {
      setErrorMessage(dateTimeError);
      return;
    }

    setErrorMessage('');
    setShowReservationModal(true);
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    setReservationSubmitting(true);
    setErrorMessage('');

    try {
      const reservationDateTime = new Date(mainFormData.reservationTime);
      
      // Format time as HH:mm:ss
      const formattedTime = reservationDateTime.toTimeString().split(' ')[0];
      // Format date as YYYY-MM-DD
      const formattedDate = reservationDateTime.toISOString().split('T')[0];

      const reservationData = {
        name: modalFormData.customerName,
        email: modalFormData.customerEmail,
        guests: parseInt(mainFormData.partySize),
        date: formattedDate,
        time: formattedTime,
        status: 'pending'
      };

      const response = await axios.post('http://localhost:3000/api/reservations', reservationData);

      if (response.status === 201) {
        setReservationSubmitting(false);
        setReservationSuccess(true);
      } else {
        throw new Error('Failed to create reservation');
      }
    } catch (error) {
      console.error('Error submitting reservation:', error);
      setReservationSubmitting(false);
      setErrorMessage(
        error.response?.data?.message || 
        "Une erreur s'est produite lors de la réservation. Veuillez réessayer."
      );
    }
  };

  const handleCloseModal = () => {
    setShowReservationModal(false);
    if (reservationSuccess) {
      setReservationSuccess(false);
      setMainFormData({
        partySize: 2,
        reservationTime: ''
      });
      setModalFormData({
        customerName: '',
        customerEmail: ''
      });
    }
  };

  return (
    <div className="bg-opacity-10 d-flex flex-column min-vh-100">
      {/* Hero Section */}
      <div className="position-relative mb-5">
        <img 
          src={heroImage} 
          alt="Délicieux plats népalais" 
          className="w-100" 
          style={{ height: '28rem', objectFit: 'cover' }}
        />
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white p-4" style={{ backgroundColor: '', borderRadius: '8px', width: '80%', maxWidth: '800px' }}>
          <h1 className="display-4 text-white fw-bold mb-3">
            Bienvenue au Restaurant Sagarmatha
          </h1>
          <p className="fs-5 text-white mb-4">
            Découvrez les saveurs authentiques du Népal
          </p>
          <Link 
            to="/menu" 
            className="btn btn-dark text-white fw-bold px-4 py-2" 
            style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}
          >
            Explorer le Menu
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        {/* Intro Section */}
        <section className="mb-5 text-center">
          <h2 className="h3 fw-bold mb-3" style={{ color: 'var(--accent-color)' }}>
            Saveurs d'Altitude : L'Héritage Culinaire du Toit du Monde
          </h2>
          <p className="fw-bold mb-3" style={{ color: 'var(--text-color)' }}>
            Bienvenue dans notre cuisine de l'Himalaya – fait maison, fait avec cœur.
          </p>
          <p className="mb-3" style={{ color: 'var(--text-color)', maxWidth: '900px', margin: '0 auto' }}>
            Voyagez au cœur des saveurs authentiques de l'Himalaya avec Sagarmatha, premier restaurant népalais de Paris. Notre carte vous invite à explore une riche diversité culinaire, mêlant les traditions du Népal, du Tibet et de l'Inde du Nord, le tout préparé "comme à la maison".
          </p>
        </section>

        {/* Temple Section */}
        <section className="row align-items-center mb-5 py-4">
          <div className="col-md-6 mb-4 mb-md-0 pe-md-5">
            <h2 className="h3 fw-bold mb-3" style={{ color: 'var(--accent-color)' }}>
              Découvrez notre Culture
            </h2>
            <p className="mb-4" style={{ color: 'var(--text-color)' }}>
              Chez Sagarmatha, nous ne servons pas que des plats – nous partageons une histoire. Inspirés par l'esprit d'hospitalité himalayenne, chaque détail, des moulins à prières aux arômes des épices torréfiées, célèbre un patrimoine culinaire transmis depuis des générations.
            </p>
            <Link 
              to="/menu" 
              className="btn btn-dark text-white fw-bold px-4" 
              style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}
            >
              En savoir plus
            </Link>
          </div>
          <div className="col-md-6">
            <img 
              src={templeImage} 
              alt="Temple népalais" 
              className="img-fluid rounded shadow"
              style={{ height: '18rem', objectFit: 'cover', width: '100%' }}
            />
          </div>
        </section>

        {/* Menu Preview */}
        <section className="mb-5 py-4">
          <h2 className="h3 fw-bold mb-4 text-center" style={{ color: 'var(--accent-color)' }}>Nos Spécialités</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="bg-opacity-25 p-4 rounded shadow h-100 card-hover" style={{ backgroundColor: 'var(--border-color)' }}>
                <img 
                  src={momoImage} 
                  alt="Momos" 
                  className="img-fluid rounded mb-3"
                  style={{ height: '12rem', objectFit: 'cover', width: '100%' }}
                />
                <h3 className="fw-bold h5 mb-2">Momos Traditionnels</h3>
                <p className="fw-bold mb-2">Raviolis népalais farcis et cuits à la vapeur</p>
                <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                  Plongez dans l'essence même de la street-food himalayenne avec nos Momos, véritables trésors de la cuisine népalaise. Ces délicats raviolis faits maison, enveloppés dans une pâte tendre et farcis de viande savoureuse ou de légumes frais, sont sublimés par une vapeur douce qui préserve toute leur authenticité. Servis avec notre chutney maison – un équilibre parfait d'épices, de tomates et de coriandre – chaque bouchée vous transporte dans les ruelles animées de Katmandou.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-opacity-25 p-4 rounded shadow h-100 card-hover" style={{ backgroundColor: 'var(--border-color)' }}>
                <img 
                  src={thaliImage} 
                  alt="Thali" 
                  className="img-fluid rounded mb-3"
                  style={{ height: '12rem', objectFit: 'cover', width: '100%' }}
                />
                <h3 className="fw-bold h5 mb-2">Thali Népalais</h3>
                <p className="fw-bold mb-2">Laissez-vous emporter par l'authentique expérience culinaire népalaise avec notre plateau traditionnel.</p>
                <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                  Ce repas complet et équilibré vous propose un savoureux Dal Bhat (lentilles parfumées), un curry de légumes frais du marché, un tarkari (sauté de saison), des achar (pickles maison épicés), accompagnés de riz basmati ou de roti tout juste sorti du four tandoor. Le tout est servi dans de véritables bols en laiton pour rester fidèle à la tradition, avec une touche de yaourt frais pour équilibrer les saveurs. Un véritable voyage gastronomique qui capture l'essence même de l'hospitalité népalaise.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-opacity-25 p-4 rounded shadow h-100 card-hover" style={{ backgroundColor: 'var(--border-color)' }}>
                <div className="row g-2 mb-3">
                  {[spiceImage, foodImage, dishImage, dessertImage].map((img, idx) => (
                    <div className="col-6" key={idx}>
                      <img 
                        src={img} 
                        alt="Cuisine Népalaise" 
                        className="img-fluid rounded"
                        style={{ height: '6rem', objectFit: 'cover', width: '100%' }}
                      />
                    </div>
                  ))}
                </div>
                <h3 className="fw-bold h5 mb-2">Le goût de l'authenticité</h3>
                <p className="fw-bold mb-2">Des recettes transmises de génération en génération, préparées avec des produits frais pour vous offrir l'authenticité d'un repas himalayen.</p>
                <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                  Découvrez notre menu complet, une invitation à voyager à travers les saveurs authentiques de l'Himalaya. De nos fameux Momos traditionnels aux réconfortants Thali Népalais, chaque plat raconte une histoire. Laissez-vous tenter par nos curries maison longuement mijotés, nos grillades Tandoori marinées 24h, ou notre incontournable Butter Chicken.
                </p>
              </div>
            </div>
          </div>
          <div className="text-center mt-5">
            <Link 
              to="/menu" 
              className="btn btn-dark text-white fw-bold px-5 py-2" 
              style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}
            >
              Explorer le Menu
            </Link>
          </div>
        </section>

        {/* Reservation Section */}
        <section className="bg-opacity-25 p-5 rounded shadow mt-5" style={{ backgroundColor: 'var(--border-color)' }}>
          <h2 className="h3 fw-bold text-center mb-4">Réservez une table</h2>
          {errorMessage && (
            <div className="alert alert-danger text-center mb-4">
              {errorMessage}
            </div>
          )}
          <Form onSubmit={handleReservationClick} className="row g-3 justify-content-center">
            <Form.Group className="col-md-4">
              <Form.Label>Nombre de personnes</Form.Label>
              <Form.Control
                type="number"
                name="partySize"
                value={mainFormData.partySize}
                onChange={handleMainFormChange}
                min="1"
                max="12"
                required
              />
            </Form.Group>

            <Form.Group className="col-md-4">
              <Form.Label>Date et Heure</Form.Label>
              <Form.Control
                type="datetime-local"
                name="reservationTime"
                value={mainFormData.reservationTime}
                onChange={handleMainFormChange}
                required
              />
            </Form.Group>

            <div className="col-12 text-center mt-4">
              <button
                type="submit"
                className="btn btn-dark text-white fw-bold px-5 py-2"
                style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}
              >
                Réserver
              </button>
            </div>
          </Form>
        </section>
      </div>

      {/* Modal */}
      <Modal show={showReservationModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{reservationSuccess ? 'Réservation Confirmée' : 'Confirmez votre Réservation'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && (
            <div className="alert alert-danger mb-3">
              {errorMessage}
            </div>
          )}
          {reservationSuccess ? (
            <div className="text-center py-4">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
              <h4 className="mt-3">Merci pour votre réservation!</h4>
              <p>Un email de confirmation a été envoyé à {modalFormData.customerEmail}</p>
              <p>
                Nous vous attendons le {new Date(mainFormData.reservationTime).toLocaleDateString()} à {new Date(mainFormData.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} pour {mainFormData.partySize} personnes.
              </p>
            </div>
          ) : (
            <Form onSubmit={handleSubmitReservation}>
              <Form.Group className="mb-3">
                <Form.Label>Nom complet</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  value={modalFormData.customerName}
                  onChange={handleModalInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="customerEmail"
                  value={modalFormData.customerEmail}
                  onChange={handleModalInputChange}
                  required
                />
              </Form.Group>

              <div className="d-grid mt-4">
                <Button
                  variant="dark"
                  type="submit"
                  disabled={reservationSubmitting}
                  style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}
                >
                  {reservationSubmitting ? 'Traitement en cours...' : 'Confirmer la réservation'}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
        {reservationSuccess && (
          <Modal.Footer>
            <Button variant="outline-dark" onClick={handleCloseModal}>Fermer</Button>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default Home;