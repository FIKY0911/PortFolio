// src/pages/Contact.jsx
import React from 'react';
import { useInView } from 'react-intersection-observer';
import Button from '../components/Button'; // Import the Button component

const Contact = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className={`max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md ${inView ? 'animate__animated animate__fadeInUp' : ''}`}>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Hubungi Saya
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Kirim pesan, saya akan balas secepatnya!
        </p>

        <form>
          {/* Nama Lengkap */}
          <div className="mb-5">
            <label
              htmlFor="fullName"
              className="block text-gray-700 font-medium mb-2"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              autoComplete="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
              placeholder="Masukkan nama lengkap Anda"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
              placeholder="nama@email.com"
            />
          </div>

          {/* Pesan */}
          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-gray-700 font-medium mb-2"
            >
              Pesan
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
              placeholder="Tulis pesan Anda di sini..."
            ></textarea>
          </div>

          {/* Tombol Kirim */}
          <Button
            type="submit"
            className="w-full"
          >
            Kirim Pesan
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
