import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  console.log('NotFound page rendered');
  console.log('Current URL:', window.location.href);
  console.log('Current pathname:', window.location.pathname);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200 max-w-md">
        <h1 className="text-4xl font-playfair text-pink-800 mb-4">404</h1>
        <h2 className="text-2xl font-playfair text-pink-700 mb-4">Page Not Found</h2>
        <p className="text-pink-600 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Current path: {window.location.pathname}
        </p>
        <div className="space-y-2">
          <Link 
            to="/" 
            className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 px-4 rounded-lg transition-all"
          >
            Go Home
          </Link>
          <Link 
            to="/auth" 
            className="block w-full border border-purple-300 text-purple-700 hover:bg-purple-50 py-2 px-4 rounded-lg transition-all"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
