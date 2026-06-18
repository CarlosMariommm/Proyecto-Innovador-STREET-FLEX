import Client from '../models/clientModel.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

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

    const client = await Client.create({
      username, email, password: hashedPassword, full_name, phone_number, image, active, verified
    });

    if (client) {
      generateToken(res, client._id);
      res.status(201).json({
        _id: client._id,
        username: client.username,
        email: client.email,
        full_name: client.full_name,
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
      generateToken(res, client._id);
      
      res.json({
        _id: client._id,
        username: client.username,
        email: client.email,
        full_name: client.full_name,
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
    const client = await Client.findById(req.user._id);

    if (client) {
      res.json({
        _id: client._id,
        username: client.username,
        email: client.email,
        full_name: client.full_name,
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

clientController.addFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const client = await Client.findById(req.user._id); // Assuming protectClient sets req.user

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
    const client = await Client.findById(req.user._id);

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
    const client = await Client.findById(req.user._id).populate('favorites');

    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.json(client.favorites);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default clientController;
