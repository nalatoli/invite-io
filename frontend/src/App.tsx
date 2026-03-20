import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DefaultRedirect from './components/DefaultRedirect';
import NikkahPage from './pages/NikkahPage';
import HennaPage from './pages/HennaPage';
import RSVPPage from './pages/RSVPPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Token-based routes (full access including RSVP) */}
        <Route path="/:token" element={<Layout />}>
          <Route index element={<DefaultRedirect />} />
          <Route path="nikkah" element={<NikkahPage />} />
          <Route path="henna" element={<HennaPage />} />
          <Route path="rsvp" element={<RSVPPage />} />
        </Route>
        {/* Public routes (no token - only Nikkah and Henna) */}
        <Route path="/" element={<Layout publicMode />}>
          <Route index element={<Navigate to="/nikkah" replace />} />
          <Route path="nikkah" element={<NikkahPage />} />
          <Route path="henna" element={<HennaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
