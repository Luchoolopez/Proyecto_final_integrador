import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from 'lucide-react';

export const ThemeToggleButton: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="form-check form-switch d-flex align-items-center">
            <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="themeSwitch"
                checked={isDark}
                onChange={toggleTheme}
                aria-label={`Activar modo ${isDark ? 'claro' : 'oscuro'}`}
            />
            <label className="form-check-label ms-2" htmlFor="themeSwitch" style={{ cursor: 'pointer' }}>
                {isDark ? (
                    <Moon size={20} aria-hidden="true" />
                ) : (
                    <Sun size={20} aria-hidden="true" />
                )}
            </label>
        </div>
    );
}
