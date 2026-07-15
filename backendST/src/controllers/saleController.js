import Sale from '../models/saleModel.js';
import Shopping_Car from '../models/shoppingCarModel.js';

const saleController = {};

saleController.createSale = async (req, res) => {
  try {
    const { id_shoppig_car, delivery_addres, city, payment_method, payment_status } = req.body;

    const sale = await Sale.create({
      id_shoppig_car, delivery_addres, city, payment_method, payment_status
    });

    if (sale) {
      res.json({ message: "Action done", data: sale });
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

saleController.getSales = async (req, res) => {
  try {
    const sales = await Sale.find({}).populate({
      path: 'id_shoppig_car',
      populate: [
        { path: 'id_client', select: 'full_name email' },
        { path: 'products.id_product' }
      ]
    });
    res.json({ message: "Action done", data: sales });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

// Obtener las ventas/pedidos de un cliente específico
saleController.getSalesByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    // Primero encontrar todos los carritos de este cliente
    const clientCarts = await Shopping_Car.find({ id_client: clientId }).select('_id');
    const cartIds = clientCarts.map(c => c._id);

    // Buscar las ventas asociadas a esos carritos
    const sales = await Sale.find({ id_shoppig_car: { $in: cartIds } })
      .populate({
        path: 'id_shoppig_car',
        populate: { path: 'products.id_product' }
      })
      .sort({ createdAt: -1 });

    res.json({ message: "Action done", data: sales });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

export default saleController;

