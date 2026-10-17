import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { useDataStore } from "../store/dataStore";

const About = () => {
  const { t } = useTranslation();
  const profile = useDataStore((state) => state.profile);

  const { ref: textRef, inView: textInView } = useInView({
    triggerOnce: true,
  });

  const { ref: imageRef, inView: imageInView } = useInView({
    triggerOnce: true,
  });

  const handleDownloadCV = () => {
    if (profile?.cv_url) {
      const link = document.createElement("a");
      link.href = profile.cv_url;
      link.download = "CV - Mohamad Fiky.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {t("about.title")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("about.subtitle")}
          </p>
        </div>

        {/* Konten Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Profil & Narasi */}
          <div
            ref={textRef}
            className={`lg:col-span-6 space-y-6 ${
              textInView ? "animate__animated animate__fadeInUp" : ""
            }`}
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("about.status", "Available for Projects & Collaboration")}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Mohamad Fiky Ba&apos;dafitro
              </h3>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                {t("about.intro")}{" "}
                <strong className="text-blue-600 dark:text-blue-400">
                  Mohamad Fiky
                </strong>
                {t("about.description1")}
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                {t("about.description2")}{" "}
                <strong className="text-cyan-600 dark:text-cyan-400">
                  {t("about.highlight")}
                </strong>
                {t("about.description3")}
              </p>

              {/* Quick Key Facts */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                    {t("about.factEducation", "Universitas")}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Esa Unggul (IPK 3.88)
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                    {t("about.factOrg", "Organisasi")}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Sekretaris ROCHI
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                    {t("about.factFocus", "Fokus Rekayasa")}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Full-Stack &amp; AI
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                    {t("about.factLocation", "Lokasi")}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Jakarta, Indonesia
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button onClick={handleDownloadCV} className="flex items-center gap-2">
                  <i className="ri-download-2-line" />
                  <span>{t("about.downloadLatestCV", "Unduh CV Terbaru")}</span>
                </Button>
                <Link to="/project">
                  <button className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200">
                    {t("about.viewProjects")}
                  </button>
                </Link>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {t("about.connect", "Hubungkan:")}
                </span>
                <a
                  href="https://linkedin.com/in/mohamad-fiky"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <i className="ri-linkedin-fill ri-lg" />
                </a>
                <a
                  href="https://github.com/mohamadfiky"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <i className="ri-github-fill ri-lg" />
                </a>
                <a
                  href="https://instagram.com/filas756"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/40 transition-colors"
                >
                  <i className="ri-instagram-fill ri-lg" />
                </a>
                <a
                  href="mailto:linkidnmohamadfiky@gmail.com"
                  aria-label="Email"
                  className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-colors"
                >
                  <i className="ri-mail-line ri-lg" />
                </a>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Bento Grid Credentials & Architecture */}
          <div
            ref={imageRef}
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Card 1: Pendidikan & GPA */}
            <div
              className={`bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 hover:scale-[1.02] transition-transform duration-300 ${
                imageInView
                  ? "animate__animated animate__fadeInUp animate__delay-100ms"
                  : "opacity-0"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <i className="ri-graduation-cap-line ri-xl" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 ring-1 ring-emerald-300 dark:ring-emerald-700">
                  IPK 3.88 / 4.00
                </span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                {t("about.education_title")}
              </h3>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                Universitas Esa Unggul (2024 / 2028)
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("about.education_desc")}
              </p>
            </div>

            {/* Card 2: Organisasi & Kepemimpinan */}
            <div
              className={`bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 hover:scale-[1.02] transition-transform duration-300 ${
                imageInView
                  ? "animate__animated animate__fadeInUp animate__delay-200ms"
                  : "opacity-0"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <i className="ri-team-line ri-xl" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  2024 / 2026
                </span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                {t("about.org_title", "Pengalaman Organisasi")}
              </h3>
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
                Sekretaris: Organisasi ROCHI UEU
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("about.org_desc", "Supervisi korespondensi kelembagaan, alur arsip dokumen operasional, serta sinkronisasi jadwal dan target antar-divisi.")}
              </p>
            </div>

            {/* Card 3: AI-Assisted Engineering (Featured Large Card) */}
            <div
              className={`sm:col-span-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 p-6 rounded-3xl shadow-xl text-white hover:scale-[1.01] transition-transform duration-300 ${
                imageInView
                  ? "animate__animated animate__fadeInUp animate__delay-300ms"
                  : "opacity-0"
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <i className="ri-robot-2-line ri-xl text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">
                    {t("about.ai_title", "AI-Assisted Engineering")}
                  </h3>
                  <p className="text-xs text-blue-100">
                    {t("about.ai_subtitle", "Modern AI Tooling & Autonomous Agents")}
                  </p>
                </div>
              </div>
              <p className="text-blue-50/90 text-sm leading-relaxed mb-4">
                {t("about.ai_desc", "Memanfaatkan akselerasi AI (AI Code Generation, Prompt Engineering for Refactoring, dan integrasi AI Agent) untuk siklus rilis cepat dengan standar ketat pada kebersihan kode dan keandalan sistem.")}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-sm text-white">
                  AI Agents Integration
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-sm text-white">
                  Automated Refactoring
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-sm text-white">
                  Accelerated Debugging
                </span>
              </div>
            </div>

            {/* Card 4: Arsitektur & Prinsip Rekayasa */}
            <div
              className={`sm:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 hover:scale-[1.01] transition-transform duration-300 ${
                imageInView
                  ? "animate__animated animate__fadeInUp animate__delay-400ms"
                  : "opacity-0"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                  <i className="ri-node-tree ri-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    {t("about.arch_title", "Arsitektur Sistem & Desain Modular")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    {t("about.arch_desc", "Menegakkan batas tegas klien-server (Client-Server Separation), perancangan RESTful API terstruktur, skema database relasional (PostgreSQL/MySQL), dan ORM Prisma.")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      Separation of Concerns
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      RESTful Contract
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      Strict TypeScript
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
