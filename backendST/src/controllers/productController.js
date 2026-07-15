import Product from '../models/productModel.js';
import Sale from '../models/saleModel.js';
import Shopping_Car from '../models/shoppingCarModel.js';

const productController = {};

productController.createProduct = async (req, res) => {
  try {
    const { product_name, price, description, color, size, stock, material, units, category, supplier, active, seson } = req.body;
    
    let image = req.body.image || '';
    if (req.file && req.file.path) {
      image = req.file.path;
    }

    const product = await Product.create({
      product_name, price, description, color, size, stock, material, units, category, supplier, image, active, seson
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
    const products = await Product.find({}).populate('category').populate('supplier').populate('reviews.id_client', 'full_name image');
    res.json({ message: "Action done", data: products });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

productController.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('reviews.id_client', 'full_name image');
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

productController.addReview = async (req, res) => {
  try {
    const { id } = req.params; // Product ID
    const { id_client, rating, comment } = req.body;

    // 1. Validar si el usuario compró el producto
    const clientCarts = await Shopping_Car.find({ id_client }).select('_id');
    const cartIds = clientCarts.map(c => c._id);
    const sales = await Sale.find({ id_shoppig_car: { $in: cartIds } }).populate('id_shoppig_car');
    
    let hasPurchased = false;
    for (const sale of sales) {
      if (sale.id_shoppig_car && sale.id_shoppig_car.products) {
        const productFound = sale.id_shoppig_car.products.find(p => p.id_product.toString() === id);
        if (productFound) {
          hasPurchased = true;
          break;
        }
      }
    }

    if (!hasPurchased) {
      return res.status(403).json({ message: "Solo puedes valorar productos que hayas comprado." });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verificar si ya comentó
    const alreadyReviewed = product.reviews.find(r => r.id_client.toString() === id_client);
    if (alreadyReviewed) {
      return res.status(400).json({ message: "Ya has valorado este producto." });
    }

    // Agregar review
    const review = {
      id_client,
      rating: Number(rating),
      comment
    };
    product.reviews.push(review);

    // Actualizar promedio
    const totalReviews = product.reviews.length;
    const sumRatings = product.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    product.average_rating = sumRatings / totalReviews;

    await product.save();
    res.json({ message: "Valoración agregada con éxito" });

  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

export default productController;
