import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import SafeRoutePage from './pages/SafeRoutePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SafetyReports from './pages/SafetyReports';
import CommunityForum from './pages/CommunityForum';
import ResourcesHelp from './pages/ResourcesHelp';
import DiscussionForum from './pages/DiscussionForum';
import LoginForm from './pages/LoginForm';
import HeatMapPage from './pages/HeatMapPage';
import SignupForm from './pages/SignUpForm';
import ProtectedRoute from './components/ProtectedRoute';
import './theme.css';
import UserCreateChannel from './components/CreateChannel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ZoneMap from './pages/ZoneMap';
import SafeRouteMap from './pages/SafeRouteMap';
import StartNavigation from './pages/StartNavigation';


function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/discussion';

  // Dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    
    <div className="app">
     
      {!hideNavbar && <Navbar />}
<ToastContainer position="top-right" autoClose={3000} />
      <main style={!hideNavbar ? { marginTop: '75px' } : {}} className="min-h-[calc(100vh-120px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saferoute" element={<SafeRoutePage />} />
          <Route path="/reports" element={<SafetyReports />} />
          <Route path="/forum" element={<CommunityForum />} />
          <Route path="/safetyroute" element={<SafeRouteMap />} />
          <Route path="/resources" element={<ResourcesHelp />} />
          <Route path="/heatmap" element={<HeatMapPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/zonemap" element={<ZoneMap />} />
          <Route path="/navigation" element={<StartNavigation />} />

          <Route
            path="/discussion"
            element={
              <ProtectedRoute>
                <DiscussionForum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-channel"
            element={
              <ProtectedRoute>
                <UserCreateChannel />
              </ProtectedRoute>
            }
          />
          <Route path="/discussion/:channelId" element={
            <ProtectedRoute>
            <DiscussionForum />
            </ProtectedRoute>
            } />

        </Routes>
      </main>

      {!hideNavbar && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
