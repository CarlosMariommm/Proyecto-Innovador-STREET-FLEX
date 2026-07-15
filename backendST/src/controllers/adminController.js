import Admin from '../models/adminModel.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

const adminController = {};

adminController.createAdmin = async (req, res) => {
  try {
    const { username, email, password, full_name, image, active } = req.body;

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      console.log("error: Admin already exists");
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
      full_name,
      image,
      active
    });

    if (admin) {
      generateToken(res, admin._id);
      res.status(201).json({
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
      });
    } else {
      console.log("error: Invalid admin data");
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

adminController.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      generateToken(res, admin._id);
      
      res.json({
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
        image: admin.image
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

adminController.logoutAdmin = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

adminController.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (admin) {
      res.json({
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
        image: admin.image,
        active: admin.active
      });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

adminController.updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (admin) {
      admin.full_name = req.body.full_name || admin.full_name;

      const updatedAdmin = await admin.save();

      res.json({
        _id: updatedAdmin._id,
        username: updatedAdmin.username,
        email: updatedAdmin.email,
        full_name: updatedAdmin.full_name,
        image: updatedAdmin.image,
        active: updatedAdmin.active
      });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

adminController.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}).select('-password');
    res.json({ message: "Action done", data: admins });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

export default adminController;
