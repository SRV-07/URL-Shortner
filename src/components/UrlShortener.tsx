import { useState } from 'react';
import { Link2, Copy, Check } from 'lucide-react';
import { shortenUrl } from '../lib/urlService';

interface UrlShortenerProps {
  onUrlCreated: () => void;
}

export default function UrlShortener({ onUrlCreated }: UrlShortenerProps) {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setCopied(false);

    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);

    const { shortCode, error: apiError } = await shortenUrl(url);

    setLoading(false);

    if (apiError) {
      setError(apiError);
      return;
    }

    const fullShortUrl = `${window.location.origin}/${shortCode}`;
    setShortUrl(fullShortUrl);
    setUrl('');
    onUrlCreated();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Link2 className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">URL Shortener</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your long URL here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>

      {shortUrl && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Your shortened URL:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-blue-600 font-medium"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
