import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { User, LoginData, RegisterData } from '../types/user';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (values: LoginData) => Promise<User | void>;
    loginWithGoogle: (idToken: string) => Promise<User | void>;
    register: (values: RegisterData) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Extraemos loginWithGoogle del hook useAuth actualizado
    const { 
        login: apiLogin, 
        loginWithGoogle: apiGoogleLogin, 
        register, 
        logout: apiLogout, 
        loading: apiLoading, 
        error 
    } = useAuth();

    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const accessToken = localStorage.getItem('accessToken');
            if (storedUser && storedUser !== 'undefined' && storedUser !== 'null' && accessToken) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        } catch (e) {
            console.error("Error al recuperar sesión:", e);
            localStorage.clear();
            setUser(null);
        } finally {
            setInitializing(false);
        }
    }, []);

    const handleLogin = async (values: LoginData): Promise<User | void> => {
        try {
            const userData = await apiLogin(values);
            setUser(userData);
            return userData;
        } catch (error) {
            setUser(null);
        }
    };

    const handleGoogleLogin = async (idToken: string): Promise<User | void> => {
        try {
            const userData = await apiGoogleLogin(idToken);
            setUser(userData);
            return userData;
        } catch (error) {
            setUser(null);
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
        loginWithGoogle: handleGoogleLogin,
        register,
        logout: handleLogout,
        loading: apiLoading || initializing,
        error,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        setUser: setUser
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