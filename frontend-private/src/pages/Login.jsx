import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../api/auth';
import { useAuth } from '../components/Auth/AuthContext';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { Lock } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const user = await loginUser(data.email, data.password);
      login(user);
      toast.success(`Bienvenido, ${user.name}`);
      
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Antigravity Admin & Tienda
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="admin@antigravity.com"
              {...register('email', { 
                required: 'El correo es obligatorio',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Dirección de correo inválida'
                }
              })}
              error={errors.email?.message}
            />
            
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              {...register('password', { 
                required: 'La contraseña es obligatoria',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres'
                }
              })}
              error={errors.password?.message}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full flex justify-center py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando...' : 'Ingresar'}
          </Button>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
            <Link to="/register" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
