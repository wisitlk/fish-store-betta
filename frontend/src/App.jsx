import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import { GOOGLE_CLIENT_ID } from './config/api';

// Static demo builds (VITE_DEMO=true) run from a sandboxed page where the
// history API is unavailable, so they fall back to hash-based routing.
const Router = import.meta.env.VITE_DEMO === 'true' ? HashRouter : BrowserRouter;

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <footer>
            <div style={{ backgroundColor: 'var(--navy)', color: '#b8d4ec', padding: '3rem 0 2rem' }}>
              <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem'
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 'bold', fontSize: '1.3rem', color: '#fff', marginBottom: '0.75rem' }}>
                    🐠 AQUATIC JEWEL
                  </div>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                    Premium show-grade betta fish exported directly from Thailand's top
                    breeders to hobbyists worldwide since 2020.
                  </p>
                </div>
                {[
                  {
                    title: 'Shop', links: ['New Arrivals', 'Halfmoon', 'Plakat', 'HMPK', 'Crowntail', 'Weekly Specials']
                  },
                  {
                    title: 'Customer Service', links: ['Help Center', 'Order Status', 'Shipping & Transhipping', 'Live Arrival Guarantee', 'Returns & Refunds']
                  },
                  {
                    title: 'Resources', links: ['Betta Care Guide', 'Acclimation Guide', 'Breeder Profiles', 'About Us', 'Contact']
                  }
                ].map(col => (
                  <div key={col.title}>
                    <h4 style={{ color: '#fff', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.85rem' }}>{col.title}</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {col.links.map(l => (
                        <li key={l}><a href="#" style={{ color: '#b8d4ec', fontSize: '0.85rem', fontWeight: 400 }}>{l}</a></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              backgroundColor: 'var(--navy-dark)',
              textAlign: 'center',
              padding: '1rem',
              color: '#7fa8cc',
              fontSize: '0.8rem'
            }}>
              &copy; {new Date().getFullYear()} Aquatic Jewel. Premium Betta Exporters. All rights reserved.
            </div>
          </footer>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
