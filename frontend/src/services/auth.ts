import api from '../api/client';

export const login = async (email: string, password: string) => {
    try {
        const { data } = await api.post('/auth/login', { email, password }, { withCredentials: true });

        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
        }
        return data;
    } catch (error) {
        throw error;
    }
};

export const refreshToken = async () => {
    try {
        const response = await api.post('/auth/refresh', {}, { withCredentials: true });
        const { data } = response;

        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const register = async (name: string, email: string, password: string) => {
    try {
        const response = await api.post('/auth/register', { name, email, password });
        return response;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    api.post('/auth/logout', { withCredentials: true }).catch((error) => {
        console.error("Logout failed:", error);
    });
};

export const googleURI = async () => {
    try {
        const response = await api.get('/auth/generate-url');
        return response.data.oauth_url;
    } catch (error) {
        console.error("Google login URL generation failed:", error);
        throw error;
    }
}; 