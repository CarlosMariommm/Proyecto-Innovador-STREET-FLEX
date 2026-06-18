import Shopping_Car from '../models/shoppingCarModel.js';

const shoppingCarController = {};

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

shoppingCarController.getShoppingCars = async (req, res) => {
  try {
    //#1- Conecto con DB para buscar
    const carts = await Shopping_Car.find({}).populate('id_client').populate('products.id_product');
    
    //#2- Retorno los datos
    res.json({ message: "Action done", data: carts });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

export default shoppingCarController;
