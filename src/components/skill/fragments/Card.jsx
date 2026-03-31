/**
 * Card.jsx
 * ========
 * Komponen untuk menampilkan tools/teknologi dengan Marquee animation.
 * Digunakan di section Skill pada halaman Home.
 * 
 * FITUR:
 * - Marquee animation: Tools scroll otomatis dari kiri ke kanan
 * - Pause on hover: Berhenti saat mouse masuk ke area
 * - Responsive design: Menyesuaikan ukuran di berbagai device
 * - Hover effect (border, shadow, scale)
 * - Data diambil dari data.jsx (listTools)
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { listTools } from "../../../data/data";
import { Marquee } from "../../ui/marquee";

/**
 * Card Component (Main)
 * =====================
 * Komponen utama yang menampilkan tools dengan Marquee animation.
 * Tools akan scroll otomatis dari kiri ke kanan dengan pause saat hover.
 */
const Card = () => {
  const skills = listTools;
  const [hoveredId, setHoveredId] = useState(null);

  // Tampilkan pesan jika tidak ada data
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
    <div className="w-full mx-auto">
      <Marquee
        className="w-full"
        pauseOnHover={!hoveredId}
        repeat={2}
        isPaused={hoveredId !== null}>
        {skills.map((skill) => (
          <Link
            key={skill.id}
            to={`/skill/`}
            className="block mr-8"
            onMouseEnter={() => setHoveredId(skill.id)}
            onMouseLeave={() => setHoveredId(null)}>
            <div
              className={`bg-slate-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 flex items-center p-3 sm:p-4 group cursor-pointer overflow-hidden min-w-fit ${hoveredId === skill.id ? "border-blue-500 dark:border-blue-400 shadow-md scale-[1.02]" : ""}`}>
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mr-2 sm:mr-3 relative">
                {skill.image_url ? (
                  <img
                    src={skill.image_url}
                    alt={skill.name}
                    loading="lazy"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center min-w-0">
                <h3
                  className={`text-black dark:text-white font-semibold text-xs sm:text-sm md:text-base transition-colors truncate ${hoveredId === skill.id ? "text-blue-600 dark:text-blue-400" : ""}`}>
                  {skill.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 sm:mt-1">
                  {skill.keterangan}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </Marquee>
    </div>
  );
};

export default Card
