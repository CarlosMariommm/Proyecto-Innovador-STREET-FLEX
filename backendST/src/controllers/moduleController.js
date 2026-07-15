import Module from '../models/moduleModel.js';

const moduleController = {};

moduleController.createModule = async (req, res) => {
  try {
    const { name, active } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const newModule = await Module.create({ name, active });
    res.status(201).json({ message: "Module created", data: newModule });
  } catch (error) {
    console.error("Error creating module:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

moduleController.getModules = async (req, res) => {
  try {
    const modules = await Module.find({});
    res.json({ message: "Action done", data: modules });
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

moduleController.deleteModule = async (req, res) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);
    if (!module) return res.status(404).json({ message: "Module not found" });
    res.json({ message: "Module deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default moduleController;
