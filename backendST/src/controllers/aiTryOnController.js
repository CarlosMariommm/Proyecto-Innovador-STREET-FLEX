import AI_TryOn from '../models/aiTryOnModel.js';

const aiTryOnController = {};

aiTryOnController.createAITryOn = async (req, res) => {
  try {
    //#1- Valido los datos
    const { name, id_product, image_client, saved } = req.body;

    //#2- Conecto con DB para guardar
    const tryon = await AI_TryOn.create({
      name, id_product, image_client, saved
    });

    if (tryon) {
      res.json({ message: "Action done" });
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

aiTryOnController.getAITryOns = async (req, res) => {
  try {
    //#1- Conecto con DB para buscar
    const tryons = await AI_TryOn.find({}).populate('id_product');
    
    //#2- Retorno los datos
    res.json({ message: "Action done", data: tryons });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

export default aiTryOnController;
