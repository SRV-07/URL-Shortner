import { useState, useEffect } from 'react';
import UrlShortener from './components/UrlShortener';
import UrlList from './components/UrlList';
import RedirectHandler from './components/RedirectHandler';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [shortCode, setShortCode] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.length > 1) {
      const code = path.substring(1);
      setShortCode(code);
    }
  }, []);

  const handleUrlCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (shortCode) {
    return <RedirectHandler shortCode={shortCode} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <UrlShortener onUrlCreated={handleUrlCreated} />
        <UrlList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}

export default App;
