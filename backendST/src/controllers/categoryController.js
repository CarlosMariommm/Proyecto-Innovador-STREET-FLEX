import Category from '../models/categoryModel.js';
import Supplier from '../models/supplierModel.js';

const categoryController = {};

categoryController.createCategory = async (req, res) => {
  try {
    const { name, description, active, supplier, id_module } = req.body;
    
    if (!supplier) {
      return res.status(400).json({ message: "Supplier is required" });
    }

    const category = await Category.create({ name, description, active, supplier, id_module });

    if (category) {
      res.status(201).json({ message: "Category created", data: category });
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  } catch (error) {
    console.error('Error in createCategory:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

categoryController.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate('supplier', 'supp_name direction email phone_number')
      .populate('id_module', 'name image active');
    res.json({ message: "Action done", data: categories });
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

categoryController.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category updated", data: category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

categoryController.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default categoryController;
