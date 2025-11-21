import { useState, useEffect } from 'react';
import { X, ExternalLink, Calendar, MousePointer } from 'lucide-react';
import { getUrlClicks } from '../lib/urlService';
import { UrlRecord, UrlClick } from '../lib/supabase';

interface UrlStatsProps {
  url: UrlRecord;
  onClose: () => void;
}

export default function UrlStats({ url, onClose }: UrlStatsProps) {
  const [clicks, setClicks] = useState<UrlClick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClicks();
  }, [url.id]);

  const loadClicks = async () => {
    setLoading(true);
    const { data } = await getUrlClicks(url.id);
    if (data) {
      setClicks(data);
    }
    setLoading(false);
  };

  const shortUrl = `${window.location.origin}/${url.short_code}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Statistics</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <code className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-medium">{shortUrl}</code>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Total Clicks</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{url.clicks}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Created</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(url.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Original URL</span>
              </div>
              <a
                href={url.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 truncate block"
              >
                {url.original_url}
              </a>
            </div>
          </div>

          <div className="border rounded-lg">
            <div className="bg-gray-50 px-6 py-3 border-b">
              <h3 className="font-semibold text-gray-800">Recent Clicks</h3>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-600">Loading...</div>
              ) : clicks.length === 0 ? (
                <div className="p-6 text-center text-gray-600">No clicks yet</div>
              ) : (
                clicks.map((click) => (
                  <div key={click.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          {new Date(click.clicked_at).toLocaleString()}
                        </p>
                        {click.user_agent && (
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {click.user_agent}
                          </p>
                        )}
                        {click.referrer && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            From: {click.referrer}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
