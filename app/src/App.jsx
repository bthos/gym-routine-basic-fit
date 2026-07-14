import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BottomTabBar } from './components/BottomTabBar.jsx';
import { ImportScreen } from './screens/ImportScreen.jsx';
import { HomeScreen } from './screens/HomeScreen.jsx';
import { ProgramScreen } from './screens/ProgramScreen.jsx';
import { ActiveSessionScreen } from './screens/ActiveSessionScreen.jsx';
import { HistoryScreen } from './screens/HistoryScreen.jsx';
import { ExportScreen } from './screens/ExportScreen.jsx';
import { CatalogScreen } from './screens/CatalogScreen.jsx';
import { getActiveRutina } from './lib/db.js';

/**
 * Inner shell that has access to location (must be inside HashRouter).
 * Loads the active rutina from IndexedDB once on mount; screens that need it
 * receive it as a prop. ImportScreen calls onImported() to refresh.
 */
function Shell() {
  const location = useLocation();
  const [rutina, setRutina] = useState(undefined); // undefined = loading, null = not imported yet
  const [loadError, setLoadError] = useState(false);

  const loadRutina = () => {
    getActiveRutina()
      .then((r) => setRutina(r ? r.rutina : null))
      .catch(() => { setLoadError(true); setRutina(null); });
  };

  useEffect(() => { loadRutina(); }, []);

  const hideNav = location.pathname === '/import';

  if (rutina === undefined) return null; // still loading — avoids flash

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <Routes>
          <Route
            path="/import"
            element={<ImportScreen onImported={() => { loadRutina(); }} />}
          />
          <Route
            path="/"
            element={
              rutina
                ? <HomeScreen rutina={rutina} loadError={loadError} onGoImport={() => { window.location.hash = '/import'; }} />
                : <Navigate to="/import" replace />
            }
          />
          <Route
            path="/program"
            element={rutina ? <ProgramScreen rutina={rutina} /> : <Navigate to="/import" replace />}
          />
          <Route
            path="/program/:dayIndex"
            element={rutina ? <ProgramScreen rutina={rutina} /> : <Navigate to="/import" replace />}
          />
          <Route path="/session" element={<ActiveSessionScreen />} />
          <Route path="/history" element={<HistoryScreen />} />
          <Route path="/export" element={<ExportScreen />} />
          <Route path="/catalog" element={<CatalogScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideNav && <BottomTabBar />}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
