// components/fragments/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ scrolled = false, onLinkClick }) => {
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/skill/detail', label: 'Skill' },
    { path: '/project', label: 'Project' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden lg:flex gap-6 font-semibold text-xl">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onLinkClick}
            className={`px-4 py-2 rounded-xl transition-all duration-300 relative
              ${scrolled ? 'text-slate-100' : 'text-slate-400'}
              hover:text-slate-100
              hover:bg-gradient-to-br from-cyan-400 to-blue-400
              hover:ring-2 hover:ring-cyan-300/70
              hover:shadow-[0_0_12px_2px_rgba(56,189,248,0.5)]
            `}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu (akan dipakai di Header saat mobileMenuOpen = true) */}
      <div className="lg:hidden flex flex-col gap-5 py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onLinkClick}
            className="text-xl font-semibold text-gray-700 hover:text-cyan-600 transition"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navbar;
