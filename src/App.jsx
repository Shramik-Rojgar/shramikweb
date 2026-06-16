import React, { useState } from 'react';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignUpPage';
import AboutUsPage from './components/AboutUsPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'signup' | 'about'
  const [aud, setAud] = useState('hire'); // 'hire' | 'work'
  const [initialStep, setInitialStep] = useState('choose');
  const [language, setLanguage] = useState('hi'); // Default is Hindi as per guidelines

  const handleNavigate = (page, step = 'choose') => {
    setCurrentPage(page);
    setInitialStep(step);
  };

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
    </div>
  );
}

export default App;
