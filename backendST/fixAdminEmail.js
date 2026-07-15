import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './src/models/adminModel.js';

dotenv.config();

const fixEmail = async () => {
  try {
    await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/streetflex');
    console.log('✅ Conectado a MongoDB...');

    const oldEmail = 'spidey6809@gmial.com';
    const newEmail = 'spidey6809@gmail.com';

    const result = await Admin.findOneAndUpdate(
      { email: oldEmail },
      { email: newEmail },
      { new: true }
    );

    if (result) {
      console.log(`✅ Correo actualizado exitosamente a: ${result.email}`);
    } else {
      console.log('⚠️ No se encontró el administrador con el correo incorrecto.');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error actualizando el correo:', error);
    process.exit(1);
  }
};

fixEmail();
