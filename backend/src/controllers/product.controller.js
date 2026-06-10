import Product from '../models/Product.js';

const productController = {};

productController.getAll = async (req, res) => {
    try {
        const products = await Product.find({}).populate('category', 'name');
        res.json(products);
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

productController.getById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

productController.create = async (req, res) => {
    try {
        const { name, description, price, category, countInStock } = req.body;
        
        const imageUrl = req.file ? req.file.path : '';

        if (!imageUrl) {
            return res.status(400).json({ message: 'La imagen es obligatoria' });
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            countInStock,
            imageUrl
        });
        await product.save();

        res.json({ message: 'Action done' });
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

productController.update = async (req, res) => {
    try {
        const { name, description, price, category, countInStock } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.countInStock = countInStock || product.countInStock;
            
            if (req.file) {
                product.imageUrl = req.file.path;
            }

            await product.save();
            res.json({ message: 'Action done' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

productController.delete = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Action done' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export default productController;
