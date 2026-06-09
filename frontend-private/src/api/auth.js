const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const loginUser = async (email, password) => {
  await delay(800);
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  if (email === 'admin@gmail.com' && password === 'admin123') {
    return { id: 1, name: 'Admin', email, role: 'admin' };
  }

  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  throw new Error('Credenciales inválidas');
};

export const registerUser = async (userData) => {
  await delay(800);
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  if (users.find(u => u.email === userData.email)) {
    throw new Error('El correo ya está registrado');
  }

  const newUser = {
    id: Date.now(),
    ...userData,
    role: 'user'
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};
