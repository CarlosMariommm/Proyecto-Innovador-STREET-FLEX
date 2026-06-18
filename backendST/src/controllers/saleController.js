import Sale from '../models/saleModel.js';

const saleController = {};

saleController.createSale = async (req, res) => {
  try {
    //#1- Valido los datos
    const { id_shoppig_car, delivery_addres, city, payment_method, payment_status } = req.body;

    //#2- Conecto con DB para guardar
    const sale = await Sale.create({
      id_shoppig_car, delivery_addres, city, payment_method, payment_status
    });

    if (sale) {
      res.json({ message: "Action done" });
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
    //#1- Conecto con DB para buscar
    const sales = await Sale.find({}).populate('id_shoppig_car');
    
    //#2- Retorno los datos
    res.json({ message: "Action done", data: sales });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

export default saleController;
