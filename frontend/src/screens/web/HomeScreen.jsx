import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/web/Header';
import HeroSection from '../../components/web/HeroSection';
import ProductGrid from '../../components/web/ProductGrid';
import Sidebar from '../../components/web/Sidebar';

const HomeScreen = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const moduleFilter = searchParams.get('module');

  return (
    <div className="home-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <main>
        {!moduleFilter && <HeroSection />}
        <ProductGrid />
      </main>
    </div>
  );
};

export default HomeScreen;
