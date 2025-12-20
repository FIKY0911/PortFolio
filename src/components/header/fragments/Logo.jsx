// components/fragments/Logo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const Logo = ({ onClick }) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onClick) onClick(); // Jika diklik di mobile menu, tutup menu
  };

  return (
    <div ref={ref} className={`${inView ? 'animate__animated animate__flipInX' : ''}`}>
      <Link to="/" onClick={scrollToTop} className="group inline-block text-4xl">
        <span className="font-bold">
          <span className="bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:bg-gradient-to-tl transition-[background] duration-300 ease-out">
            Port
          </span>
          <span className="bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:bg-gradient-to-tr transition-[background] duration-300 ease-out">
            folio
          </span>
        </span>
      </Link>
    </div>
  );
};

export default Logo;
