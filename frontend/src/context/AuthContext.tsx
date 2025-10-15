import { createContext, useState, useContext, useEffect,type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { User, LoginData, RegisterData } from '../types/user';

interface AuthContextType {
    isAuthenticated: boolean;      
    user: User | null;             
    login: (values: LoginData) => Promise<void>;
    register: (values: RegisterData) => Promise<void>;
    logout: () => void;
    loading: boolean;             
    error: string | null;          
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { login: apiLogin, register, logout: apiLogout, loading, error } = useAuth();
        const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.error("Error al parsear el usuario de localStorage", e);
            setUser(null);
        }
    }, []); 
    
    const handleLogin = async (values: LoginData) => {
        await apiLogin(values); 
        
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    };

    const handleLogout = () => {
        apiLogout(); 
        setUser(null); 
    };
    const value = {
        isAuthenticated: !!user,
        user,
        login: handleLogin,
        register, 
        logout: handleLogout,
        loading,
        error,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
    }
    return context;
};