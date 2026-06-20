import React, { useState } from 'react';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignUpPage';
import AboutUsPage from './components/AboutUsPage';
import SetPassword from './components/SetPassword';
import NotFoundPage from './components/NotFoundPage';
import './App.css';

const PATH_TO_PAGE = {
  '/':            'home',
  '/signup':      'signup',
  '/about':       'about',
  '/set-password': 'set-password',
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
  };

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
      {!['home', 'signup', 'about'].includes(currentPage) && (
        <NotFoundPage onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
