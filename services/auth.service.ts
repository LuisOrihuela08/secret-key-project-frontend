import { API_BASE_URL, API_ENDPOINTS } from '../lib/api-config';
import type { RegisterRequest, AuthRequest, AuthResponse } from '@/types/auth';

class AuthService {
    private getHeaders(includeAuth: boolean = false): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.register}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({
                    message: 'Error en el registro'
                }));
                throw new Error(error.message || 'Error en el registro');
            }

            const authResponse: AuthResponse = await response.json();

            // Guardar token y usuario
            this.setToken(authResponse.token);
            this.setUser(authResponse);

            return authResponse;
        } catch (error) {
            console.error('Error en register:', error);
            throw error;
        }
    }

    async login(data: AuthRequest): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.login}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({
                    message: 'Credenciales inválidas'
                }));
                throw new Error(error.message || 'Credenciales inválidas');
            }

            const authResponse: AuthResponse = await response.json();

            // Guardar token y usuario
            this.setToken(authResponse.token);
            this.setUser(authResponse);

            return authResponse;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    }

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }

    setUser(user: AuthResponse): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }

    getUser(): AuthResponse | null {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // Método para hacer peticiones autenticadas a otros endpoints
    async authenticatedFetch(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<Response> {
        const token = this.getToken();

        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        };

        return fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
    }
}

// Exportar instancia única del servicio (Singleton)
export const authService = new AuthService();