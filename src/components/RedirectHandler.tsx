import { useEffect, useState } from 'react';
import { getUrlByShortCode, trackClick } from '../lib/urlService';

interface RedirectHandlerProps {
  shortCode: string;
}

export default function RedirectHandler({ shortCode }: RedirectHandlerProps) {
  const [error, setError] = useState('');

  useEffect(() => {
    const handleRedirect = async () => {
      const { data, error } = await getUrlByShortCode(shortCode);

      if (error || !data) {
        setError('URL not found');
        return;
      }

      const userAgent = navigator.userAgent;
      const referrer = document.referrer;

      trackClick(data.id, userAgent, referrer);

      window.location.href = data.original_url;
    };

    handleRedirect();
  }, [shortCode]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">404</h1>
          <p className="text-gray-700 mb-6">This short URL does not exist.</p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-700">Redirecting...</p>
      </div>
    </div>
  );
}
