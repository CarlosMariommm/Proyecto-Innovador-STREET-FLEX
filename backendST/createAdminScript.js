import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './src/models/adminModel.js';

dotenv.config();

const createInitialAdmin = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/streetflex');
    console.log('✅ Conectado a MongoDB...');

    const email = 'admin@streetflex.com';
    const password = 'mypassword';

    // Verificar si ya existe
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      console.log('⚠️ El administrador ya existe. Puedes iniciar sesión con admin@streetflex.com');
      process.exit();
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear admin
    const admin = await Admin.create({
      username: 'admin_demo',
      email: email,
      password: hashedPassword,
      full_name: 'Ema Admin',
      active: true
    });

    console.log(`✅ ¡Administrador creado con éxito!`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit();
  } catch (error) {
    console.error('❌ Error creando administrador:', error);
    process.exit(1);
  }
};

createInitialAdmin();
