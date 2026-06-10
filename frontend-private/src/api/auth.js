export const loginUser = async (email, password) => {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.message || 'Credenciales inválidas');
    }
    
    return data;
};

export const registerUser = async (userData) => {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.message || 'Error en registro');
    }
    
    return data;
};

export const logoutUser = async () => {
    const res = await fetch('/api/auth/logout', {
        method: 'POST'
    });
    
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.message || 'Error al cerrar sesión');
    }
    
    return data;
};
