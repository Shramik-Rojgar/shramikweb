import React, { useState } from 'react';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignUpPage';
import AboutUsPage from './components/AboutUsPage';
import GalleryPage from './components/GalleryPage';
import SetPassword from './components/SetPassword';
import NotFoundPage from './components/NotFoundPage';
import './App.css';

const PATH_TO_PAGE = {
  '/':             'home',
  '/signup':       'signup',
  '/about':        'about',
  '/gallery':      'gallery',
  '/set-password': 'set-password',
};

const PAGE_TO_PATH = {
  home:    '/',
  signup:  '/signup',
  about:   '/about',
  gallery: '/gallery',
};

function App() {
  const pathname = window.location.pathname;
  const initialPage = PATH_TO_PAGE[pathname] ?? '404';

  const [currentPage, setCurrentPage] = useState(
    initialPage === 'set-password' || initialPage === '404' ? 'home' : initialPage
  );
  const [aud, setAud] = useState('hire'); // 'hire' | 'work'
  const [initialStep, setInitialStep] = useState('choose');
  const [language, setLanguage] = useState('hi'); // Default is Hindi as per guidelines

  const handleNavigate = (page, step = 'choose') => {
    setCurrentPage(page);
    setInitialStep(step);
    const path = PAGE_TO_PATH[page];
    if (path && window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const onPopState = () => {
      const page = PATH_TO_PAGE[window.location.pathname] ?? '404';
      if (page !== 'set-password' && page !== '404') {
        setCurrentPage(page);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  if (initialPage === 'set-password') return <SetPassword />;
  if (initialPage === '404') return <NotFoundPage onNavigate={handleNavigate} />;

  return (
    <div className="app-root">
      {currentPage === 'home' && (
        <HomePage 
          onNavigate={handleNavigate} 
          language={language} 
          onLanguageChange={setLanguage} 
          aud={aud}
          setAud={setAud}
        />
      )}
      {currentPage === 'signup' && (
        <SignUpPage 
          onNavigate={handleNavigate} 
          initialStep={initialStep} 
          language={language} 
          onLanguageChange={setLanguage} 
          aud={aud}
          setAud={setAud}
        />
      )}
      {currentPage === 'about' && (
        <AboutUsPage
          onNavigate={handleNavigate}
          language={language}
          onLanguageChange={setLanguage}
          aud={aud}
          setAud={setAud}
        />
      )}
      {currentPage === 'gallery' && (
        <GalleryPage
          onNavigate={handleNavigate}
          language={language}
          onLanguageChange={setLanguage}
          aud={aud}
          setAud={setAud}
        />
      )}
      {!['home', 'signup', 'about', 'gallery'].includes(currentPage) && (
        <NotFoundPage onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
