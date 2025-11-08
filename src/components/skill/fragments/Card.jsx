// src/components/fragment/Card.jsx
import React from 'react';
import { listTools } from '../../../data/data';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const AnimatedCard = ({ tool, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const animationDelay = `${index * 100}ms`;

  return (
    <Link
      ref={ref}
      to={`/skill/${tool.params}`}
      className={`block ${inView ? 'animate__animated animate__fadeInRight' : ''}`}
      style={{ animationDelay }}
    >
      <div className="bg-slate-100 rounded-lg border border-gray-700 hover:border-blue-500 hover:scale-[1.02] transition-all duration-300 flex items-center p-4 group cursor-pointer">
        {/* Ikon */}
        <div className="shrink-0 w-12 h-12 flex items-center justify-center mr-3">
          <img
            src={tool.image}
            alt={tool.ket}
            className="w-full h-full object-contain rounded-md"
          />
        </div>

        {/* Teks */}
        <div className="flex flex-col justify-center">
          <h3 className="text-black font-semibold text-sm md:text-base group-hover:text-blue-400 transition-colors">
            {tool.ket}
          </h3>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            {tool.name || 'Framework / Library'}
          </p>
        </div>
      </div>
    </Link>
  );
};

const Card = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Grid responsif */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20 md:mb-60">
        {listTools.map((tool, index) => (
          <AnimatedCard key={tool.id} tool={tool} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Card;
