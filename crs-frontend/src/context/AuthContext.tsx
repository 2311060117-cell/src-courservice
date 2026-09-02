import { createContext, useContext, useState, ReactNode } from 'react';
import { login as loginApi } from '../api/authApi';
import type { LoginRequest } from '../types/auth';

interface AuthUser {
    id: number;
    username: string;
    role: 'ADMIN' | 'STUDENT';
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });

    const login = async (credentials: LoginRequest) => {
        const res = await loginApi(credentials);
        const data = res.data;

        const authUser: AuthUser = { id: data.userId, username: data.username, role: data.role };

        setUser(authUser);
        setToken(data.token);

        localStorage.setItem('user', JSON.stringify(authUser));
        localStorage.setItem('token', data.token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}