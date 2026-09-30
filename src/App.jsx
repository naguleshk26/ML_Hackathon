import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { EntityProvider } from './context/EntityContext';
import AppLayout from './layouts/AppLayout';

import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import MatchingPage from './pages/MatchingPage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <ToastProvider>
      <EntityProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="upload" element={<UploadPage />} />
              <Route path="matching" element={<MatchingPage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </EntityProvider>
    </ToastProvider>
  );
}
