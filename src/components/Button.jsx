/**
 * src/components/Button.jsx
 * =========================
 * Reusable Button Component dengan efek hover gradient dan glow.
 * 
 * FITUR:
 * - Dark mode: Button gelap dengan teks terang
 * - Light mode: Button terang dengan teks gelap
 * - Background gradient saat hover (cyan → blue)
 * - Efek glow/bayangan bersinar di dark mode
 * - Fully customizable via className prop
 * 
 * PROPS:
 * @param {ReactNode} children - Content/teks di dalam button
 * @param {string} className - Custom CSS classes (opsional)
 * @param {...any} props - Props tambahan (onClick, type, disabled, dll)
 */
import React from 'react';

const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`
        /* === LAYOUT & SIZING === */
        group
        inline-flex items-center justify-center
        px-6 py-3
        font-medium rounded-xl
        relative
        overflow-hidden
        cursor-pointer

        /* === BACKGROUND === */
        bg-white                        /* Light mode: background putih/terang */
        dark:bg-gray-800                /* Dark mode: background gelap */

        /* === SHADOW & BORDER === */
        shadow-md shadow-slate-200      /* Light mode: shadow lembut */
        dark:shadow-lg dark:shadow-gray-900/50  /* Dark mode: shadow lebih dalam */
        border border-gray-200          /* Light mode: border abu-abu terang */
        dark:border-gray-700            /* Dark mode: border abu-abu gelap */

        /* === TRANSITION === */
        transition-all duration-300 ease-out

        /* === HOVER EFFECTS === */
        hover:bg-gradient-to-br hover:from-cyan-400 hover:to-blue-500
        hover:ring-2 hover:ring-cyan-300/70
        hover:border-transparent
        hover:shadow-lg
        
        /* === GLOW EFFECT (DARK MODE ONLY) === */
        dark:hover:shadow-[0_0_20px_4px_rgba(56,189,248,0.4)]

        ${className}
      `}
      {...props}
    >
      {/* 
        TEKS (State Normal)
        - Light mode: teks gelap
        - Dark mode: teks terang
        - Hilang saat hover untuk diganti teks putih
      */}
      <span className="
        text-gray-700 dark:text-gray-100
        font-semibold
        group-hover:opacity-0 
        transition-opacity duration-300
      ">
        {children}
      </span>

      {/* 
        TEKS (State Hover)
        - Warna putih untuk kontras dengan background gradient
      */}
      <span className="
        text-white
        font-semibold
        absolute 
        opacity-0 group-hover:opacity-100 
        transition-opacity duration-300
      ">
        {children}
      </span>
    </button>
  );
};

export default Button;
