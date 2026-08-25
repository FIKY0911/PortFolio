import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const About = () => {
  const { t } = useTranslation();

  const { ref: textRef, inView: textInView } = useInView({
    triggerOnce: true,
  });

  const { ref: imageRef, inView: imageInView } = useInView({
    triggerOnce: true,
  });

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
            {t("about.title")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("about.subtitle")}
          </p>
        </div>

        {/* Konten Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Teks */}
          <div
            ref={textRef}
            className={`space-y-6 ${
              textInView ? "animate__animated animate__fadeInUp" : ""
            }`}>
            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
              {t("about.intro")} <strong>Fiky</strong> {t("about.description1")}
            </p>
            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
              {t("about.description2")} <strong>{t("about.highlight")}</strong>
              {t("about.description3")}
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Link to="/project">
                <Button>{t("about.viewProjects")}</Button>
              </Link>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-6 pt-4">
              <a
                href="https://instagram.com/filas756"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram">
                <i className="ri-instagram-fill ri-2x text-gray-700 dark:text-gray-300 hover:text-pink-500 transition-colors duration-200"></i>
              </a>
              <a
                href="https://linkedin.com/in/fiky"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn">
                <i className="ri-linkedin-fill ri-2x text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors duration-200"></i>
              </a>
            </div>
          </div>

          {/* Bento Grid Info - Modern Replacement for Image */}
          <div
            ref={imageRef}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card: Education */}
            <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:scale-[1.02] transition-transform duration-300 ${
              imageInView ? "animate__animated animate__fadeInUp animate__delay-100ms" : "opacity-0"
            }`}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                <i className="ri-graduation-cap-line ri-xl"></i>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t("about.education_title")}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("about.education_desc")}
              </p>
            </div>

            {/* Card: Values */}
            <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:scale-[1.02] transition-transform duration-300 ${
              imageInView ? "animate__animated animate__fadeInUp animate__delay-200ms" : "opacity-0"
            }`}>
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4 text-cyan-600 dark:text-cyan-400">
                <i className="ri-lightbulb-flash-line ri-xl"></i>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t("about.values_title")}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("about.values_desc")}
              </p>
            </div>

            {/* Card: Experience (Large) - Mission focused on AI */}
            <div className={`sm:col-span-2 bg-gradient-to-br from-blue-600 to-cyan-600 p-6 rounded-2xl shadow-xl text-white hover:scale-[1.01] transition-transform duration-300 ${
              imageInView ? "animate__animated animate__fadeInUp animate__delay-300ms" : "opacity-0"
            }`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <i className="ri-brain-line ri-xl"></i>
                </div>
                <h3 className="font-bold text-xl">{t("about.experience_title")}</h3>
              </div>
              <p className="text-blue-50/90">
                {t("about.experience_desc")}
              </p>
            </div>

            {/* Card: Hobbies/Interests - Focused on AI Integration */}
            <div className={`sm:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:scale-[1.01] transition-transform duration-300 ${
              imageInView ? "animate__animated animate__fadeInUp animate__delay-400ms" : "opacity-0"
            }`}>
               <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{t("about.tech_stack_title")}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t("about.tech_stack_desc")}</p>
               </div>
               <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-white">JS</div>
                  <div className="w-10 h-10 rounded-full bg-cyan-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-white">RE</div>
                  <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-bold text-white">NX</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
