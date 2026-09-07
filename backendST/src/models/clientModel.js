import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    full_name: { type: String, required: true },
    phone_number: { type: String },
    image: { type: String },
    active: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    // Codigo de 6 digitos que se manda por correo para verificar la cuenta
    // desde la app movil (fetch en React Native no puede seguir el link que
    // usa la web, asi que necesita algo que se pueda tipear a mano).
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('Client', clientSchema);
