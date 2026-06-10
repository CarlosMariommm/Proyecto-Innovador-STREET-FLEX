import User from '../models/User.js';

const employeeController = {};

employeeController.getAll = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }).select('-password');
        res.json(employees);
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

employeeController.getById = async (req, res) => {
    try {
        const employee = await User.findOne({ _id: req.params.id, role: 'employee' }).select('-password');
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

employeeController.create = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, address } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'El correo ya está en uso' });

        const employee = new User({
            firstName,
            lastName,
            email,
            password,
            phone,
            address,
            role: 'employee'
        });
        await employee.save();

        res.json({ message: 'Action done' });
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

employeeController.update = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, address } = req.body;

        const employee = await User.findOne({ _id: req.params.id, role: 'employee' });
        
        if (employee) {
            employee.firstName = firstName || employee.firstName;
            employee.lastName = lastName || employee.lastName;
            employee.email = email || employee.email;
            employee.phone = phone || employee.phone;
            employee.address = address || employee.address;
            
            if (password) {
                employee.password = password; 
            }

            await employee.save();
            res.json({ message: 'Action done' });
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

employeeController.delete = async (req, res) => {
    try {
        const employee = await User.findOne({ _id: req.params.id, role: 'employee' });

        if (employee) {
            await employee.deleteOne();
            res.json({ message: 'Action done' });
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export default employeeController;
