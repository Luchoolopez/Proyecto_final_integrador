import {Header} from '../components/Header/index';
import { Footer } from '../components/Footer';
import { Outlet } from 'react-router-dom';
import './MainLayout.style.css';

export const MainLayout = () => {
    return (
        <div className="main-layout-container">
            <Header/>
            <main className="main-content">
                <Outlet/>
            </main>
            <Footer/>
        </div>
    )
}