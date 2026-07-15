import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Inicialmente podemos leer de localStorage o usar dark por defecto (estilo PROTOtypes)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('street-flex-theme');
    return saved || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('street-flex-theme', theme);
    // Aplicamos clase global al documento para facilitar estilos con Tailwind o CSS plano
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
