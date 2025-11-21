import { useState, useEffect } from 'react';
import { BarChart3, Trash2, ExternalLink, Copy, Check } from 'lucide-react';
import { getAllUrls, deleteUrl } from '../lib/urlService';
import { UrlRecord } from '../lib/supabase';
import UrlStats from './UrlStats';

interface UrlListProps {
  refreshTrigger: number;
}

export default function UrlList({ refreshTrigger }: UrlListProps) {
  const [urls, setUrls] = useState<UrlRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState<UrlRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadUrls();
  }, [refreshTrigger]);

  const loadUrls = async () => {
    setLoading(true);
    const { data } = await getAllUrls();
    if (data) {
      setUrls(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    await deleteUrl(id);
    loadUrls();
  };

  const copyToClipboard = (shortCode: string, id: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-600 text-center">Loading...</p>
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-600 text-center">No URLs yet. Create your first shortened URL above!</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Short URL</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Original URL</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Clicks</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {urls.map((url) => (
                <tr key={url.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-blue-600 font-medium">/{url.short_code}</code>
                      <button
                        onClick={() => copyToClipboard(url.short_code, url.id)}
                        className="text-gray-400 hover:text-blue-600 transition"
                      >
                        {copiedId === url.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={url.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-blue-600 flex items-center gap-1 max-w-md truncate"
                    >
                      <span className="truncate">{url.original_url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {url.clicks}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(url.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedUrl(url)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                        title="View statistics"
                      >
                        <BarChart3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(url.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUrl && (
        <UrlStats
          url={selectedUrl}
          onClose={() => setSelectedUrl(null)}
        />
      )}
    </>
  );
}
