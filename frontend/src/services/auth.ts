import api from '../api/client';

export const login = async (email: string, password: string) => {
    try {
        const { data } = await api.post('/auth/login', { email, password }, { withCredentials: true });
        localStorage.setItem('token', data['access_token']);
        return data;
    } catch (error) {
        throw error;
    }
};

export const register = async (name: string, email: string, password: string) => {
    try {
        const { data } = await api.post('/auth/register', { name, email, password });
        return data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};
