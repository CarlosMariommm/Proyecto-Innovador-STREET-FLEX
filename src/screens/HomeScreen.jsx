import React, { useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';
import Sidebar from '../components/Sidebar';

const HomeScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="home-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <main>
        <HeroSection />
        <ProductGrid />
      </main>
    </div>
  );
};

export default HomeScreen;
