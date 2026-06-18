import Product from '../models/productModel.js';

const productController = {};

productController.createProduct = async (req, res) => {
  try {
    //#1- Valido los datos
    const { product_name, price, description, color, size, stock, material, units, category, sub_category, active, seson } = req.body;
    
    // Obtener la URL de la imagen subida a Cloudinary
    let image = req.body.image || '';
    if (req.file && req.file.path) {
      image = req.file.path;
    }

    //#2- Conecto con DB para guardar
    const product = await Product.create({
      product_name, price, description, color, size, stock, material, units, category, sub_category, image, active, seson
    });

    if (product) {
      res.json({ message: "Action done" });
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

productController.getProducts = async (req, res) => {
  try {
    //#1- Conecto con DB para buscar
    const products = await Product.find({});
    
    //#2- Retorno los datos
    res.json({ message: "Action done", data: products });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

productController.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (product) {
      res.json({ message: "Action done", data: product });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

export default productController;
