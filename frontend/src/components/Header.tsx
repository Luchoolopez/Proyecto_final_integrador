import React from "react";
import '../styles/Header.css'

const Header = () => {
    return (
        <div className="header-container">
            <div className="title-container">
                <h1>TiendaRopa</h1>
            </div>
            <div className="home-login-container">
                <a href="/iniciar-sesion" className="login-link">Iniciar Sesión</a>
            </div>
        </div>
    )
}

export default Header