// src/components/Button.jsx
import React from 'react';

const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`group inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl
        bg-slate-100
        relative
        overflow-hidden
        transition-all duration-300 ease-out
        shadow shadow-slate-300
        hover:bg-gradient-to-br hover:from-cyan-400 hover:to-blue-400
        hover:ring-2 hover:ring-cyan-300/70
        hover:shadow-[0_0_12px_2px_rgba(56,189,248,0.5)]
        cursor-pointer
        ${className}`}
      {...props}
    >
      {/* Teks gradasi — muncul saat normal */}
      <span className="bg-gradient-to-br from-cyan-400 to-blue-400 bg-clip-text text-transparent
                      group-hover:opacity-0 transition-opacity duration-300">
        {children}
      </span>

      {/* Teks solid — muncul saat hover */}
      <span className="text-slate-100 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {children}
      </span>
    </button>
  );
};

export default Button;
