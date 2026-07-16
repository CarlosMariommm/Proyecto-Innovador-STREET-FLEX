import Client from '../models/clientModel.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/mailer.js';

const clientController = {};

clientController.createClient = async (req, res) => {
  try {
    const { username, email, password, full_name, phone_number, image, active, verified } = req.body;

    const clientExists = await Client.findOne({ email });

    if (clientExists) {
      return res.status(400).json({ message: "Client already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(20).toString('hex');

    const client = await Client.create({
      username, email, password: hashedPassword, full_name, phone_number, image, active, verified: false, verificationToken
    });

    if (client) {
      try {
        await sendVerificationEmail(client.email, verificationToken);
      } catch (err) {
        console.error("Error al enviar correo:", err);
      }
      generateToken(res, client._id);
      res.status(201).json({
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
    res.status(500).json({ message: "Server error" });
  }
};

clientController.loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });

    if (client && (await bcrypt.compare(password, client.password))) {
      if (!client.verified) {
        return res.status(401).json({ message: 'Por favor, verifica tu correo electrónico antes de iniciar sesión' });
      }

      generateToken(res, client._id);
      
      res.json({
        _id: client._id,
        username: client.username,
        email: client.email,
        full_name: client.full_name,
        phone_number: client.phone_number,
        favorites: client.favorites || [],
        image: client.image
      });
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
      res.json({
        _id: client._id,
        username: client.username,
        email: client.email,
        full_name: client.full_name,
        phone_number: client.phone_number,
        favorites: client.favorites || [],
        image: client.image
      });
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
    await client.save();

    res.json({ message: 'Correo verificado con éxito' });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

clientController.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(404).json({ message: 'No existe una cuenta con ese correo' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    client.resetPasswordToken = resetToken;
    client.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await client.save();

    await sendPasswordResetEmail(client.email, resetToken);

    res.json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
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
