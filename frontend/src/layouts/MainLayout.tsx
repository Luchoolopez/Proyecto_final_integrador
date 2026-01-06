import React, { useEffect } from 'react'; 
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header/header';
import { Footer } from '../components/Footer/footer';
import { SearchDrawer } from '../components/search/SearchDrawer'; 
import './MainLayout.style.css';

export const MainLayout: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <div className="app-container">
      <Header />
      <SearchDrawer /> 
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};