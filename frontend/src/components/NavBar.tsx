import React from "react";
import '../styles/Navbar.css'
import { LuChartLine } from "react-icons/lu";
import { FaBell } from "react-icons/fa";


const Navbar = () => {
    return (
        <nav className="navbar-container">
            <section className="navbar-section">
                <h3 className="navbar-section-title">INFORMES</h3>
                <div className="navbar-links">
                    <a href="#dashboard" className="nav-link">
                        <LuChartLine className="nav-icon"/>
                        <span>Dashboard</span>
                    </a>
                    <a href="#notificaciones" className="nav-link">
                        <FaBell className="nav-icon"/>
                        <span>Notificaciones</span>
                    </a>
                </div>
            </section>
        </nav>
    )
}

export default Navbar;