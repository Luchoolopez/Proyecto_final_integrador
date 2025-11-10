import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { User, LoginData, RegisterData } from '../types/user';


interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (values: LoginData) => Promise<User | void>;
    register: (values: RegisterData) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { login: apiLogin, register, logout: apiLogout, loading: apiLoading, error } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);

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
            console.error("Error al parsear el usuario de localStorage", e);
            localStorage.removeItem('user');
            setUser(null);
        }finally{
            setInitializing(false);
        }
    }, []);

    const handleLogin = async (values: LoginData): Promise<User | void> => {
        try {
            const userdData = await apiLogin(values);
            
            setUser(userdData);
            return userdData;
        } catch (error) {
            console.error("handleLogin fallo: ", (error as Error).message);
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
        register,
        logout: handleLogout,
        loading: apiLoading || initializing,
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