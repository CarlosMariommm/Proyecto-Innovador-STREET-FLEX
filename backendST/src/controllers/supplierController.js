import Supplier from '../models/supplierModel.js';

const supplierController = {};

supplierController.createSupplier = async (req, res) => {
  try {
    //#1- Valido los datos
    const { supp_name, email, phone_number, direction, active } = req.body;
    
    let image = req.body.image || '';
    if (req.file && req.file.path) {
      image = req.file.path;
    }

    //#2- Conecto con DB para guardar
    const supplier = await Supplier.create({
      supp_name, email, phone_number, direction, image, active
    });

    if (supplier) {
      res.json({ message: "Action done" });
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

supplierController.getSuppliers = async (req, res) => {
  try {
    //#1- Conecto con DB para buscar
    const suppliers = await Supplier.find({});
    
    //#2- Retorno los datos
    res.json({ message: "Action done", data: suppliers });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

export default supplierController;
