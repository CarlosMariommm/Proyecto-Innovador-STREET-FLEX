import Client from '../models/clientModel.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/mailer.js';

const clientController = {};

const CODE_TTL_MS = 15 * 60 * 1000; // 15 minutos
const generateVerificationCode = () => String(Math.floor(100000 + Math.random() * 900000));

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_AGE = 13;
const MAX_AGE = 100;

// La misma forma de cliente en todas las respuestas (login, perfil, edicion,
// verificacion): la app movil guarda esto tal cual como sesion.
const clientPayload = (client) => ({
  _id: client._id,
  username: client.username,
  email: client.email,
  full_name: client.full_name,
  phone_number: client.phone_number,
  age: client.age,
  favorites: client.favorites || [],
  image: client.image,
});

// Devuelve el mensaje del primer dato invalido, o null si todo esta bien. Las
// mismas reglas que valida la app movil (utils/validations.js): quien se salte
// la pantalla y le pegue directo a la API no se las salta tambien.
const validateClientFields = ({ full_name, username, email, phone_number, age }, { requireAll }) => {
  if ((requireAll || full_name !== undefined) && !String(full_name || '').trim()) {
    return 'El nombre completo es obligatorio';
  }
  if ((requireAll || username !== undefined) && !String(username || '').trim()) {
    return 'El nombre de usuario es obligatorio';
  }
  if (email !== undefined && !EMAIL_REGEX.test(String(email).trim())) {
    return 'El correo no tiene un formato valido';
  }
  if (phone_number !== undefined && phone_number !== '' && !/^[0-9+()\s-]{7,15}$/.test(String(phone_number).trim())) {
    return 'El telefono no es valido';
  }
  if (age !== undefined && age !== null && age !== '') {
    const n = Number(age);
    if (!Number.isInteger(n)) return 'La edad debe ser un numero entero';
    if (n < MIN_AGE || n > MAX_AGE) return `La edad debe estar entre ${MIN_AGE} y ${MAX_AGE} años`;
  }
  // La edad es opcional aqui a proposito: el registro de la web todavia no la
  // pide. La app movil si la exige (RegisterScreen).
  return null;
};

clientController.createClient = async (req, res) => {
  try {
    const { username, email, password, full_name, phone_number, age, image, active, verified } = req.body;

    const invalid = validateClientFields({ full_name, username, email, phone_number, age }, { requireAll: true });
    if (invalid) return res.status(400).json({ message: invalid });
    if (!password || String(password).length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const emailExists = await Client.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Ya existe una cuenta con ese correo" });
    }

    // username tambien es unique en el esquema (ver clientModel.js); sin este
    // chequeo el duplicado lo rechazaba Mongo directo (E11000) y el cliente
    // solo veia un generico "Server error" sin saber que el usuario ya estaba
    // tomado.
    const usernameExists = await Client.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Ese nombre de usuario ya esta en uso" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = Date.now() + CODE_TTL_MS;

    const client = await Client.create({
      username, email, password: hashedPassword, full_name, phone_number,
      age: age === undefined || age === '' ? undefined : Number(age),
      image, active, verified: false,
      verificationToken, verificationCode, verificationCodeExpires
    });

    if (client) {
      // Salvavidas para desarrollo: si el correo del servidor no esta
      // configurado (o falla), el codigo igual queda visible en la consola
      // del backend para poder probar sin depender del SMTP.
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEV] Codigo de verificacion para ${client.email}: ${verificationCode}`);
      }
      try {
        await sendVerificationEmail(client.email, { token: verificationToken, code: verificationCode });
      } catch (err) {
        console.error("Error al enviar correo:", err);
      }
      const token = generateToken(res, client._id);
      res.status(201).json({
        token,
        _id: client._id,
        username: client.username,
        email: client.email,
        full_name: client.full_name,
        phone_number: client.phone_number,
      });
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  } catch (error) {
    console.log("error" + error);
    // Salvavidas por si dos registros llegan al mismo tiempo y ambos pasan
    // los chequeos de arriba antes de que el primero termine de guardar.
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      const message = field === 'username' ? 'Ese nombre de usuario ya esta en uso' : 'Ya existe una cuenta con ese correo';
      return res.status(400).json({ message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

clientController.loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });

    if (client && (await bcrypt.compare(password, client.password))) {
      if (!client.verified) {
        // `needsVerification` deja que el cliente (movil) mande directo a la
        // pantalla de codigo en vez de solo mostrar el mensaje sin salida.
        return res.status(401).json({
          message: 'Por favor, verifica tu correo electrónico antes de iniciar sesión',
          needsVerification: true,
        });
      }

      const token = generateToken(res, client._id);

      res.json({ token, ...clientPayload(client) });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

clientController.logoutClient = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

clientController.getClientProfile = async (req, res) => {
  try {
    // req.admin holds the decoded id thanks to authMiddleware, 
    // pero vamos a usar un req.client o simplemente req.admin._id para buscar
    // Para no complicarlo ahora, el middleware 'protect' guarda en req.admin. 
    // Voy a cambiar authMiddleware para que decodifique generico?
    // En realidad, authMiddleware busca Admin.findById. Necesitamos un protectClient.
    // Lo manejaremos ahora asumiendo un protect genérico o busqueda por ID.
    const client = await Client.findById(req.client._id);

    if (client) {
      res.json(clientPayload(client));
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Edicion del perfil por el propio cliente (PUT /clients/profile). Solo deja
// tocar nombre, usuario, telefono y edad: el correo y la contraseña tienen sus
// propios flujos (verificacion / recuperacion) y el `active` es del admin.
clientController.updateClientProfile = async (req, res) => {
  try {
    const { full_name, username, phone_number, age } = req.body;

    const invalid = validateClientFields({ full_name, username, phone_number, age }, { requireAll: false });
    if (invalid) return res.status(400).json({ message: invalid });

    const client = await Client.findById(req.client._id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    if (username !== undefined && username.trim() !== client.username) {
      const taken = await Client.findOne({ username: username.trim(), _id: { $ne: client._id } });
      if (taken) return res.status(400).json({ message: 'Ese nombre de usuario ya esta en uso' });
      client.username = username.trim();
    }
    if (full_name !== undefined) client.full_name = full_name.trim();
    if (phone_number !== undefined) client.phone_number = String(phone_number).trim();
    if (age !== undefined && age !== null && age !== '') client.age = Number(age);

    await client.save();
    res.json(clientPayload(client));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ese nombre de usuario ya esta en uso' });
    }
    console.log('error' + error);
    res.status(500).json({ message: 'Server error' });
  }
};

clientController.getClients = async (req, res) => {
  try {
    const clients = await Client.find({}).select('-password');
    res.json({ message: "Action done", data: clients });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

clientController.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

clientController.addFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const client = await Client.findById(req.client._id); // Assuming protectClient sets req.client

    if (!client) return res.status(404).json({ message: 'Client not found' });

    if (!client.favorites.includes(productId)) {
      client.favorites.push(productId);
      await client.save();
    }
    res.json({ message: 'Product added to favorites', favorites: client.favorites });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

clientController.removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const client = await Client.findById(req.client._id);

    if (!client) return res.status(404).json({ message: 'Client not found' });

    client.favorites = client.favorites.filter(id => id.toString() !== productId);
    await client.save();
    
    res.json({ message: 'Product removed from favorites', favorites: client.favorites });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

clientController.getFavorites = async (req, res) => {
  try {
    const client = await Client.findById(req.client._id).populate({
      path: 'favorites',
      populate: { path: 'category', select: 'name' }
    });

    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.json(client.favorites);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

clientController.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const client = await Client.findOne({ verificationToken: token });

    if (!client) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    client.verified = true;
    client.verificationToken = undefined;
    client.verificationCode = undefined;
    client.verificationCodeExpires = undefined;
    await client.save();

    res.json({ message: 'Correo verificado con éxito' });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Verificacion por codigo de 6 digitos (app movil). Deja la cuenta verificada
// y devuelve un token, igual que login, para no obligar a tipear la
// contrasena otra vez justo despues de registrarse.
clientController.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(404).json({ message: 'No existe una cuenta con ese correo' });
    }

    if (!client.verified) {
      if (!client.verificationCode || client.verificationCode !== code) {
        return res.status(400).json({ message: 'El codigo es incorrecto' });
      }
      if (!client.verificationCodeExpires || client.verificationCodeExpires < Date.now()) {
        return res.status(400).json({ message: 'El codigo ha expirado, solicita uno nuevo' });
      }

      client.verified = true;
      client.verificationCode = undefined;
      client.verificationCodeExpires = undefined;
      client.verificationToken = undefined;
      await client.save();
    }

    const token = generateToken(res, client._id);
    res.json({ token, ...clientPayload(client) });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

clientController.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(404).json({ message: 'No existe una cuenta con ese correo' });
    }
    if (client.verified) {
      return res.status(400).json({ message: 'Esta cuenta ya esta verificada' });
    }

    const verificationCode = generateVerificationCode();
    client.verificationCode = verificationCode;
    client.verificationCodeExpires = Date.now() + CODE_TTL_MS;
    if (!client.verificationToken) client.verificationToken = crypto.randomBytes(20).toString('hex');
    await client.save();

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV] Codigo de verificacion para ${client.email}: ${verificationCode}`);
    }

    try {
      await sendVerificationEmail(client.email, { token: client.verificationToken, code: verificationCode });
    } catch (err) {
      console.error('Error al enviar correo:', err);
    }

    res.json({ message: 'Codigo reenviado' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

clientController.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(404).json({ message: 'No existe una cuenta con ese correo' });
    }

    // El link (web) vive 1 hora; el codigo de 6 digitos (app movil) 15 minutos,
    // porque es corto y por eso mas facil de adivinar si dura mucho.
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetCode = generateVerificationCode();
    client.resetPasswordToken = resetToken;
    client.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    client.resetCode = resetCode;
    client.resetCodeExpires = Date.now() + CODE_TTL_MS;
    await client.save();

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV] Codigo de recuperacion para ${client.email}: ${resetCode}`);
    }

    try {
      await sendPasswordResetEmail(client.email, { token: resetToken, code: resetCode });
    } catch (err) {
      console.error('Error al enviar correo de recuperacion:', err);
      // En desarrollo el codigo sale por la consola y se puede seguir; en
      // produccion, sin correo no hay recuperacion posible: se avisa.
      if (process.env.NODE_ENV === 'production') {
        return res.status(502).json({ message: 'No pudimos enviar el correo. Intenta de nuevo en un momento.' });
      }
    }

    res.json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Cambio de contraseña con el codigo de 6 digitos del correo (app movil).
clientController.resetPasswordWithCode = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Falta el correo o el codigo' });
    }
    if (!password || String(password).length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const client = await Client.findOne({ email });
    if (!client || !client.resetCode || client.resetCode !== String(code)) {
      return res.status(400).json({ message: 'El codigo es incorrecto' });
    }
    if (!client.resetCodeExpires || client.resetCodeExpires < Date.now()) {
      return res.status(400).json({ message: 'El codigo ha expirado, solicita uno nuevo' });
    }

    const salt = await bcrypt.genSalt(10);
    client.password = await bcrypt.hash(password, salt);
    client.resetCode = undefined;
    client.resetCodeExpires = undefined;
    client.resetPasswordToken = undefined;
    client.resetPasswordExpires = undefined;
    await client.save();

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

clientController.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const client = await Client.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!client) {
      return res.status(400).json({ message: 'El token es inválido o ha expirado' });
    }

    const salt = await bcrypt.genSalt(10);
    client.password = await bcrypt.hash(password, salt);
    client.resetPasswordToken = undefined;
    client.resetPasswordExpires = undefined;
    client.resetCode = undefined;
    client.resetCodeExpires = undefined;
    await client.save();

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

clientController.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    
    // Solo permitimos actualizar el estado activo
    const client = await Client.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    ).select('-password');
    
    if (client) {
      res.json({ message: "Action done", data: client });
    } else {
      res.status(404).json({ message: "Client not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default clientController;
