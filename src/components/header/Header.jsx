// components/Header.jsx
import React, { useState, useEffect } from 'react';
import Logo from './fragments/Logo';
import Navbar from './fragments/Navbar';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8); // ubah jadi true jika scroll > 10px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 flex justify-between items-center transition-all duration-300 ${
        scrolled
          ? 'bg-slate-400/90 shadow-'        // saat discroll
          : 'bg-white shadow-md' // saat di atas
      }`}
    >
      <Logo />
      <Navbar />
    </header>
  );
};

export default Header;
