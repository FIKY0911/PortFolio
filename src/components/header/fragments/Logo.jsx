import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const Logo = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  const scrolToTop = () => {
    window.scrollTo({top: 0, behavior:"smooth"})
  }
  return (
    <div ref={ref} className={`${inView ? 'animate__animated animate__flipInX' : ''}`}>
      <Link to="/" onClick={scrolToTop} className="group inline-block text-4xl">
        <div className="font-bold bg-clip-text text-transparent">
          <span className="bg-gradient-to-br from-cyan-400 to-blue-400  bg-clip-text text-transparent group-hover:bg-gradient-to-tl transition-[background] duration-300 ease-out">
            Port
          </span>
          <span className="bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:bg-gradient-to-tr transition-[background] duration-300 ease-out">
            folio
          </span>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
