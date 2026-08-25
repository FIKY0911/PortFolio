// Mengimpor hook useRouteError dan komponen Link dari react-router-dom
import { Link, useRouteError} from "react-router-dom";

// Komponen untuk menampilkan halaman error
function ErrorPage() {
  // Menggunakan hook useRouteError untuk mendapatkan detail error
  const error = useRouteError();

  // Mengembalikan JSX untuk halaman error
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-300">
      <div className="text-center max-w-lg p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Judul error */}
        <p className="text-7xl font-extrabold text-gray-800 dark:text-white" aria-hidden="true">404</p>

        <h1 className="text-2xl font-semibold mt-4 text-gray-700 dark:text-gray-200">
          Oops! Halaman Tidak Ditemukan
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-3">
          {error?.statusText || error?.message || "Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan."}
        </p>

        {/* Tombol Kembali ke Beranda */}
        <Link
          to="/"
          className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-400 transition duration-200 font-medium"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

// Mengekspor komponen ErrorPage sebagai default
export default ErrorPage;
