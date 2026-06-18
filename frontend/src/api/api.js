import axios from 'axios';

// #1 Crear la instancia base de Axios con el backend 
// Se lee la URL del backend desde Vite (.env) o usa el fallback http://localhost:5000/api
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api', 
    withCredentials: true, // CRÍTICO: Permite que el frontend envíe y reciba cookies
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// #2 Interceptor para manejar respuestas y errores globalmente
api.interceptors.response.use(
    (response) => {
        // Si todo sale bien, devolver la respuesta tal cual
        return response;
    },
    (error) => {
        // Manejo de fallos de red (Backend apagado, o error de CORS)
        if (!error.response) {
            console.error('Error de conexión con el servidor. Verifica que el backend esté encendido.');
            return Promise.reject(error);
        }

        const { status, data } = error.response;

        // Acciones automáticas basadas en códigos HTTP
        switch (status) {
            case 400:
                console.warn("Petición incorrecta o faltan datos:", data?.message);
                break;
            case 401:
                console.warn("Sesión expirada o inválida. Debes iniciar sesión.");
                // TODO: Limpiar Zustand o localStorage aquí
                // window.location.href = '/login'; 
                break;
            case 403:
                console.error("Acceso denegado. No tienes permisos.");
                // window.location.href = '/unauthorized'; 
                break;
            case 500:
                console.error("Error interno del servidor.");
                break;
            default:
                console.error("Error inesperado:", data?.message);
        }

        return Promise.reject(error);
    }
);

export default api;
