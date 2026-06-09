import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../api/auth';
import { useAuth } from '../components/Auth/AuthContext';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const user = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password
      });
      login(user);
      toast.success('¡Registro exitoso!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Error al registrar el usuario');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-green-100 rounded-full">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Únete a la tienda Antigravity
          </p>
        </div>
        
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nombre Completo"
            placeholder="Juan Pérez"
            {...register('name', { required: 'El nombre es obligatorio' })}
            error={errors.name?.message}
          />

          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="tucorreo@ejemplo.com"
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

          <Input
            label="Confirmar Contraseña"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword', { 
              validate: value => value === password || 'Las contraseñas no coinciden'
            })}
            error={errors.confirmPassword?.message}
          />

          <Button 
            type="submit" 
            variant="primary"
            className="w-full py-3 mt-6 bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </Button>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">¿Ya tienes cuenta? </span>
            <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Inicia sesión aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
