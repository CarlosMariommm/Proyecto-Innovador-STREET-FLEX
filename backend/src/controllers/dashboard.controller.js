import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const dashboardController = {};

dashboardController.getMetrics = async (req, res) => {
    try {
        const customersCount = await User.countDocuments({ role: 'customer' });
        const employeesCount = await User.countDocuments({ role: 'employee' });
        const productsCount = await Product.countDocuments();
        const categoriesCount = await Category.countDocuments();
        const ordersCount = await Order.countDocuments();

        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'firstName lastName');

        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            metrics: {
                customersCount,
                employeesCount,
                productsCount,
                categoriesCount,
                ordersCount,
                totalRevenue
            },
            recentOrders,
            ordersByStatus
        });

    } catch (error) {
        console.log("error" + error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export default dashboardController;
