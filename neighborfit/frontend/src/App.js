import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar, Footer } from './components/layout';
import { ToastContainer } from './components/ui';
import { 
  SignIn, 
  ForgotPassword, 
  ResetPassword, 
  EmailVerification, 
  Onboarding 
} from './components/features/auth';
import { Dashboard, Profile } from './components/features/dashboard';
import { Explore, NeighborhoodDetail } from './components/features/explore';
import Home from './pages/Home';
import About from './pages/About';
import TestToast from './pages/TestToast';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Help from './pages/Help';
import Contact from './pages/Contact';
import { ROUTES } from './constants';

function App() {
  return (
    <UserProvider>
      <ToastProvider>
        <Router>
          <div className="App min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-16 lg:pt-20 bg-gray-50">
              <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.ONBOARDING} element={<Onboarding />} />
                <Route path={ROUTES.SIGNIN} element={<SignIn />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path={ROUTES.VERIFY_EMAIL} element={<EmailVerification />} />
                <Route path={ROUTES.EXPLORE} element={<Explore />} />
                <Route path="/neighborhoods/:id" element={<NeighborhoodDetail />} />
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />
                <Route path={ROUTES.ABOUT} element={<About />} />
                <Route path={ROUTES.CONTACT} element={<Contact />} />
                <Route path={ROUTES.HELP} element={<Help />} />
                <Route path={ROUTES.PRIVACY} element={<Privacy />} />
                <Route path={ROUTES.TERMS} element={<Terms />} />
                <Route path="/test-toast" element={<TestToast />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </Router>
      </ToastProvider>
    </UserProvider>
  );
}

export default App;
