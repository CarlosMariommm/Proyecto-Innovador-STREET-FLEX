import Category from '../models/categoryModel.js';
import Supplier from '../models/supplierModel.js';

const categoryController = {};

// El formulario del admin manda "Jeans, T-Shirt" como un solo texto; esto lo
// vuelve a partir en ['Jeans', 'T-Shirt']. Si ya llega como arreglo se deja
// tal cual (mismo criterio que productController.toList).
const toList = (value) => {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((v) => v.trim()).filter(Boolean);
  return [];
};

categoryController.createCategory = async (req, res) => {
  try {
    const { name, description, active, supplier, id_module, subcategories } = req.body;

    if (!supplier) {
      return res.status(400).json({ message: "Supplier is required" });
    }

    const category = await Category.create({ name, description, active, supplier, id_module, subcategories: toList(subcategories) });

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
    const updateData = { ...req.body };
    if ('subcategories' in updateData) updateData.subcategories = toList(updateData.subcategories);
    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
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
