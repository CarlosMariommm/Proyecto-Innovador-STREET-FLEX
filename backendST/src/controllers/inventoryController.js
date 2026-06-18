import Inventory from '../models/inventoryModel.js';

const inventoryController = {};

inventoryController.createInventory = async (req, res) => {
  try {
    //#1- Valido los datos
    const { id_product, id_supplier, date_of_entry } = req.body;

    //#2- Conecto con DB para guardar
    const inventory = await Inventory.create({
      id_product, id_supplier, date_of_entry
    });

    if (inventory) {
      res.json({ message: "Action done" });
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

inventoryController.getInventories = async (req, res) => {
  try {
    //#1- Conecto con DB para buscar
    const inventories = await Inventory.find({}).populate('id_product id_supplier');
    
    //#2- Retorno los datos
    res.json({ message: "Action done", data: inventories });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

export default inventoryController;
