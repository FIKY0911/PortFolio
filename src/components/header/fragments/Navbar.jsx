import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex gap-6 font-semibold text-xl">
      {['/', '/about', '/skill/detail', '/project', '/contact'].map((path, id) => {
        const label = ['Home', 'About', 'Skill', 'Project', 'Contact'][id];
        return (
          <Link
            key={path}
            to={path}
            className={`px-4 py-2 rounded-xl
              transition-all duration-300
              relative
              ${
                scrolled
                  ? 'text-slate-100'
                  : 'text-slate-400'
              }
              hover:text-slate-100
              hover:bg-gradient-to-br from-cyan-400 to-blue-400
              hover:ring-2 hover:ring-cyan-300/70
              hover:shadow-[0_0_12px_2px_rgba(56,189,248,0.5)]
            `}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
};

export default Navbar;
