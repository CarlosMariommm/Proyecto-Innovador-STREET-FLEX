import Order from '../models/Order.js';

const orderController = {};

orderController.getAll = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id firstName lastName');
        res.json(orders);
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

orderController.getById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

orderController.create = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No hay artículos en el pedido' });
        } else {
            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice
            });

            const createdOrder = await order.save();
            
            res.status(201).json({ message: 'Action done', orderId: createdOrder._id });
        }
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

orderController.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            
            if (status === 'Entregado') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            if (status === 'Cancelado') {
            }

            await order.save();
            res.json({ message: 'Action done' });
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

orderController.delete = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            await order.deleteOne();
            res.json({ message: 'Action done' });
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export default orderController;
