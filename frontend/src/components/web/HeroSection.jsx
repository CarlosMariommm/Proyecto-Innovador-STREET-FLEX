import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bannerService } from '../../api/bannerService';
import './HeroSection.css';

const HeroSection = () => {
  const [banners, setBanners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await bannerService.getBanners();
        setBanners(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  return (
    <section className="hero-section">
      {banners.filter(b => b.active).map((banner) => (
        <div 
          key={banner._id} 
          className="hero-block"
          onClick={() => navigate(`/?module=${banner.id_module?._id || banner.id_module}`)}
          style={{ cursor: 'pointer' }}
        >
          <div className="hero-image-container">
            <img 
              src={banner.image} 
              alt={banner.id_module?.name || 'Banner'} 
              className="hero-image"
            />
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-text">
            <h2 className="hero-title">{banner.id_module?.name}</h2>
          </div>
        </div>
      ))}
    </section>
  );
};

export default HeroSection;
