import Shopping_Car from '../models/shoppingCarModel.js';

const shoppingCarController = {};

// Crear un carrito nuevo (se usa al hacer checkout)
shoppingCarController.createShoppingCar = async (req, res) => {
  try {
    const { products, id_client, total, discount, total_w_discount } = req.body;

    const cart = await Shopping_Car.create({
      products, id_client, total, discount, total_w_discount
    });

    if (cart) {
      res.json({ message: "Action done", cartId: cart._id });
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

// Obtener todos los carritos (para admin)
shoppingCarController.getShoppingCars = async (req, res) => {
  try {
    const carts = await Shopping_Car.find({}).populate('id_client').populate('products.id_product');
    res.json({ message: "Action done", data: carts });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

// Obtener el carrito activo de un cliente específico
shoppingCarController.getCartByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const cart = await Shopping_Car.findOne({ id_client: clientId }).populate('products.id_product');
    
    if (cart) {
      res.json({ message: "Action done", data: cart });
    } else {
      res.json({ message: "No cart found", data: null });
    }
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

// Sincronizar (upsert) el carrito de un cliente
// Si ya existe un carrito para ese cliente, lo actualiza; si no, lo crea.
shoppingCarController.syncCart = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { products, total, discount, total_w_discount } = req.body;

    const cart = await Shopping_Car.findOneAndUpdate(
      { id_client: clientId },
      { products, total, discount, total_w_discount },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ message: "Cart synced", data: cart });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

export default shoppingCarController;
