import Employee from '../models/employeeModel.js';

const employeeController = {};

employeeController.createEmployee = async (req, res) => {
  try {
    //#1- Valido los datos
    const { username, email, password, full_name, single_document, phone_number, active } = req.body;
    
    let image = req.body.image || '';
    if (req.file && req.file.path) {
      image = req.file.path;
    }

    //#2- Conecto con DB para guardar
    const employee = await Employee.create({
      username, email, password, full_name, single_document, phone_number, image, active
    });

    if (employee) {
      res.json({ message: "Action done" });
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

employeeController.getEmployees = async (req, res) => {
  try {
    //#1- Conecto con DB para buscar
    const employees = await Employee.find({});
    
    //#2- Retorno los datos
    res.json({ message: "Action done", data: employees });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

export default employeeController;
