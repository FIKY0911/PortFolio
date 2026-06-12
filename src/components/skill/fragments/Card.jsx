/**
 * Card.jsx
 * ========
 * Komponen Modern Fluid Skill Grid.
 * Ikon-ikon berada dalam grid yang rapi namun terhubung secara elastis.
 * Menarik satu ikon akan memberikan efek riak (ripple) ke ikon lainnya.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useDataStore } from "../../../store/dataStore";

/**
 * Individual Fluid Skill Card
 * Menggunakan spring physics untuk mengikuti pergerakan global secara elastis.
 */
const FluidSkillCard = ({ skill, index, activeOffset, draggedId }) => {
  // Spring untuk gerakan halus dan elastis
  // Kita beri sedikit variasi stiffness/damping agar efek ripple lebih terasa organik
  const springConfig = { 
    stiffness: 100 + (index % 5) * 10, 
    damping: 20 + (index % 3) * 2 
  };
  
  const x = useSpring(useTransform(activeOffset.x, (val) => val * 0.15), springConfig);
  const y = useSpring(useTransform(activeOffset.y, (val) => val * 0.15), springConfig);

  // Jika kartu ini yang sedang ditarik, ia akan mengikuti mouse secara 1:1
  const isDragged = draggedId === skill.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.4}
      onDrag={(e, info) => {
          activeOffset.x.set(info.offset.x);
          activeOffset.y.set(info.offset.y);
      }}
      onDragStart={() => {}}
      onDragEnd={() => {
          activeOffset.x.set(0);
          activeOffset.y.set(0);
      }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
      style={{ x: isDragged ? 0 : x, y: isDragged ? 0 : y }}
      className="relative"
    >
      <Link to={`/skill/`} className="block group">
        <div className="flex flex-col items-center justify-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-4 rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-sm group-hover:shadow-xl group-hover:border-blue-500/50 transition-all duration-300 w-24 h-24 sm:w-28 sm:h-28">
          <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 transform group-hover:scale-110 transition-transform duration-300">
            {skill.image_url ? (
              <img
                src={skill.image_url}
                alt={skill.name}
                loading="lazy"
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-[10px]">No Icon</span>
              </div>
            )}
          </div>
          <h3 className="text-gray-900 dark:text-white font-bold text-[10px] sm:text-xs text-center select-none">
            {skill.name}
          </h3>
          <p className="text-blue-500/80 dark:text-blue-400/80 text-[8px] sm:text-[10px] font-medium text-center select-none mt-0.5">
            {skill.keterangan}
          </p>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>
    </motion.div>
  );
};

/**
 * Card Component (Main Container for Fluid Grid)
 */
const Card = () => {
  const skills = useDataStore((state) => state.tools);
  
  // Shared Motion Values untuk koordinasi gerakan ripple
  const activeOffsetX = useMotionValue(0);
  const activeOffsetY = useMotionValue(0);
  
  const [draggedId, setDraggedId] = useState(null);

  if (skills.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Tidak ada skill yang ditampilkan
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative py-12 px-4 overflow-visible flex items-center justify-center min-h-[400px]">
      {/* Glow effect di belakang */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Grid Ikon yang Elastis */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 max-w-4xl relative z-10">
        {skills.map((skill, index) => (
          <FluidSkillCard 
            key={skill.id} 
            skill={skill} 
            index={index} 
            activeOffset={{ x: activeOffsetX, y: activeOffsetY }}
            draggedId={draggedId}
          />
        ))}
      </div>
    </div>
  );
};

export default Card;
