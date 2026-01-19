import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DefaultRedirect from './components/DefaultRedirect';
import NikkahPage from './pages/NikkahPage';
import HennaPage from './pages/HennaPage';
import RSVPPage from './pages/RSVPPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:token" element={<Layout />}>
          <Route index element={<DefaultRedirect />} />
          <Route path="nikkah" element={<NikkahPage />} />
          <Route path="henna" element={<HennaPage />} />
          <Route path="rsvp" element={<RSVPPage />} />
        </Route>
        <Route path="/" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
