import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Accueil';
import About from './pages/APropos';
import Contact from './pages/Contact';
import Menu from './pages/Menu';
import Order from './pages/Commande';
import MenuPlats from './pages/MenuPlats';
import MenuDessert from './pages/MenuDessert';
import MenuBoisson from './pages/MenuBoisson';
import MenuFormulaire from './pages/MenuFormulaire';
import AdminPanel from './pages/Admin';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <CartProvider> 
      <Router>
        <Navbar />
        <Routes>
          <Route path="/accueil" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/commande" element={<Order />} />
          <Route path="/menuplats" element={<MenuPlats />} />
          <Route path="/menudessert" element={<MenuDessert />} />
          <Route path="/menuboisson" element={<MenuBoisson />} />
          <Route path="/menuformulaire" element={<MenuFormulaire />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;