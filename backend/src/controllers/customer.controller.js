import User from '../models/User.js';

const customerController = {};

customerController.getAll = async (req, res) => {
    try {
        const customers = await User.find({ role: 'customer' }).select('-password');
        res.json(customers);
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

customerController.getById = async (req, res) => {
    try {
        const customer = await User.findOne({ _id: req.params.id, role: 'customer' }).select('-password');
        if (customer) {
            res.json(customer);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

customerController.create = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, address } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'El correo ya está en uso' });

        const customer = new User({
            firstName,
            lastName,
            email,
            password,
            phone,
            address,
            role: 'customer'
        });
        await customer.save();

        res.json({ message: 'Action done' });
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

customerController.update = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, address } = req.body;

        const customer = await User.findOne({ _id: req.params.id, role: 'customer' });
        
        if (customer) {
            customer.firstName = firstName || customer.firstName;
            customer.lastName = lastName || customer.lastName;
            customer.email = email || customer.email;
            customer.phone = phone || customer.phone;
            customer.address = address || customer.address;
            
            if (password) {
                customer.password = password; 
            }

            await customer.save();
            res.json({ message: 'Action done' });
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

customerController.delete = async (req, res) => {
    try {
        const customer = await User.findOne({ _id: req.params.id, role: 'customer' });

        if (customer) {
            await customer.deleteOne();
            res.json({ message: 'Action done' });
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export default customerController;
