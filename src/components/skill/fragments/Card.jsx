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
      <div className="bg-slate-100 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex items-center p-3 sm:p-4 group cursor-pointer overflow-hidden">
        {/* Ikon — responsif di semua layar */}
        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mr-2 sm:mr-3">
          <img
            src={tool.image}
            alt={tool.ket}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Teks — ukuran fleksibel */}
        <div className="flex flex-col justify-center min-w-0">
          <h3 className="text-black font-semibold text-xs sm:text-sm md:text-base group-hover:text-blue-600 transition-colors truncate">
            {tool.ket}
          </h3>
          <p className="text-gray-500 text-xs mt-0.5 sm:mt-1">
            {tool.name || 'Framework / Library'}
          </p>
        </div>
      </div>
    </Link>
  );
};

const Card = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-16">
        {listTools.map((tool, index) => (
          <AnimatedCard key={tool.id} tool={tool} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Card;
