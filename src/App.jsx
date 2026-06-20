import React, { useState } from 'react';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignUpPage';
import AboutUsPage from './components/AboutUsPage';
import SetPassword from './components/SetPassword';
import NotFoundPage from './components/NotFoundPage';
import './App.css';

const VALID_PATHS = ['/', '/set-password'];

function App() {
  const pathname = window.location.pathname;
  const isSetPassword = pathname === '/set-password';
  const isUnknownPath = !VALID_PATHS.includes(pathname);

  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'signup' | 'about'
  const [aud, setAud] = useState('hire'); // 'hire' | 'work'
  const [initialStep, setInitialStep] = useState('choose');
  const [language, setLanguage] = useState('hi'); // Default is Hindi as per guidelines

  const handleNavigate = (page, step = 'choose') => {
    setCurrentPage(page);
    setInitialStep(step);
  };

  if (isSetPassword) return <SetPassword />;
  if (isUnknownPath) return <NotFoundPage onNavigate={handleNavigate} />;

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
