import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (error: any) => void;
}> = [];

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const request = error.config;

        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        if (request._retry) {
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
        request._retry = true;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(() => {
                    return api(request);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        }

        isRefreshing = true;

        try {
            const refreshUrl = `${api.defaults.baseURL}/auth/refresh`;
            const res = await axios.post(refreshUrl, {}, { withCredentials: true });
            const { access_token } = res.data;
            localStorage.setItem('token', access_token);

            isRefreshing = false;
            failedQueue.forEach((prom) => prom.resolve());
            failedQueue = [];

            request.headers['Authorization'] = `Bearer ${access_token}`;
            return api(request);
        } catch (err) {
            isRefreshing = false;
            failedQueue.forEach((prom) => prom.reject(err));
            failedQueue = [];

            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
            return Promise.reject(err);
        }
    }
);

export default api;