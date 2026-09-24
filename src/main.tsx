import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App.tsx';
import ViralPage from './pages/ViralPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ChallengePage from './pages/ChallengePage';
import CategoryPage from './pages/CategoryPage';
import { AuthCallback } from './pages/AuthCallback';
import './index.css';

// Wrapper to pass theme to CategoryPage
const CategoryPageWrapper = () => {
  const savedTheme = localStorage.getItem('player_theme') || 'dark';
  return <CategoryPage theme={savedTheme as 'dark' | 'light'} />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/viral" element={<ViralPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/challenge/:code" element={<ChallengePage />} />
        <Route path="/category/:slug" element={<CategoryPageWrapper />} />
        <Route path="/category/all" element={<CategoryPageWrapper />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
