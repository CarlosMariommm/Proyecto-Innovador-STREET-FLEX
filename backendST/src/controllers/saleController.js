import Sale, { SALE_STATUS } from '../models/saleModel.js';
import Shopping_Car from '../models/shoppingCarModel.js';
import Product from '../models/productModel.js';

const saleController = {};

// Descuenta el stock de cada linea del carrito de forma atomica: el filtro
// `stock: { $gte: amount }` hace que el descuento falle si otro pedido se llevo
// las unidades un instante antes, asi nunca queda un stock negativo. Si alguna
// linea falla, se devuelven las que ya se habian descontado.
const reserveStock = async (lines) => {
  const reserved = [];

  for (const line of lines) {
    const updated = await Product.findOneAndUpdate(
      { _id: line.id_product, stock: { $gte: line.amount } },
      { $inc: { stock: -line.amount } },
      { new: true }
    );

    if (!updated) {
      await Promise.all(
        reserved.map((r) => Product.findByIdAndUpdate(r.id_product, { $inc: { stock: r.amount } }))
      );
      const product = await Product.findById(line.id_product).select('product_name stock');
      const name = product?.product_name || 'un producto';
      const available = Math.max(Number(product?.stock) || 0, 0);
      return {
        ok: false,
        message:
          available > 0
            ? `No hay suficiente stock de ${name}: solo quedan ${available}.`
            : `${name} ya no tiene stock disponible.`,
      };
    }

    reserved.push(line);
  }

  return { ok: true };
};

saleController.createSale = async (req, res) => {
  try {
    const { id_shoppig_car, delivery_addres, city, payment_method, payment_status } = req.body;

    if (!id_shoppig_car) {
      return res.status(400).json({ message: 'Falta el carrito del pedido.' });
    }
    if (!delivery_addres || !String(delivery_addres).trim() || !city || !String(city).trim()) {
      return res.status(400).json({ message: 'La direccion y la ciudad son obligatorias.' });
    }

    const shoppingCar = await Shopping_Car.findById(id_shoppig_car);
    if (!shoppingCar) {
      return res.status(404).json({ message: 'No se encontro el carrito del pedido.' });
    }

    const lines = (shoppingCar.products || []).filter((p) => p.id_product);
    if (lines.length === 0) {
      return res.status(400).json({ message: 'No se puede hacer un pedido sin productos.' });
    }
    if (lines.some((p) => !Number.isFinite(Number(p.amount)) || Number(p.amount) <= 0)) {
      return res.status(400).json({ message: 'Las cantidades del pedido deben ser mayores a cero.' });
    }

    const reservation = await reserveStock(lines);
    if (!reservation.ok) {
      return res.status(409).json({ message: reservation.message });
    }

    const sale = await Sale.create({
      id_shoppig_car,
      delivery_addres: String(delivery_addres).trim(),
      city: String(city).trim(),
      payment_method,
      payment_status,
      status: SALE_STATUS.PENDING,
    });

    res.json({ message: 'Action done', data: sale });
  } catch (error) {
    console.log('error' + error);
    res.status(500).json({ message: 'Server error' });
  }
};

saleController.getSales = async (req, res) => {
  try {
    const sales = await Sale.find({}).populate({
      path: 'id_shoppig_car',
      populate: [
        { path: 'id_client', select: 'full_name email' },
        { path: 'products.id_product' }
      ]
    });
    res.json({ message: "Action done", data: sales });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

// Obtener las ventas/pedidos de un cliente específico
saleController.getSalesByClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Primero encontrar todos los carritos de este cliente
    const clientCarts = await Shopping_Car.find({ id_client: clientId }).select('_id');
    const cartIds = clientCarts.map(c => c._id);

    // Buscar las ventas asociadas a esos carritos
    const sales = await Sale.find({ id_shoppig_car: { $in: cartIds } })
      .populate({
        path: 'id_shoppig_car',
        populate: { path: 'products.id_product' }
      })
      .sort({ createdAt: -1 });

    res.json({ message: "Action done", data: sales });
  } catch (error) {
    console.log("error" + error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancela un pedido del cliente que lo hizo y devuelve el stock de sus
// productos para que vuelvan a estar disponibles. Solo se puede cancelar
// mientras sigue pendiente (uno entregado o ya cancelado no se toca).
saleController.cancelSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('id_shoppig_car');
    if (!sale) return res.status(404).json({ message: 'No se encontro el pedido.' });

    const car = sale.id_shoppig_car;
    if (!car || String(car.id_client) !== String(req.client._id)) {
      return res.status(403).json({ message: 'Este pedido no es tuyo.' });
    }

    const status = sale.status || SALE_STATUS.PENDING;
    if (status === SALE_STATUS.CANCELLED) {
      return res.status(400).json({ message: 'Este pedido ya estaba cancelado.' });
    }
    if (status === SALE_STATUS.DELIVERED) {
      return res.status(400).json({ message: 'Un pedido entregado ya no se puede cancelar.' });
    }

    // Se marca primero como cancelado con una condicion, para que dos toques
    // seguidos no devuelvan el stock dos veces.
    const updated = await Sale.findOneAndUpdate(
      { _id: sale._id, status: { $ne: SALE_STATUS.CANCELLED } },
      { status: SALE_STATUS.CANCELLED },
      { new: true }
    );
    if (!updated) return res.status(400).json({ message: 'Este pedido ya estaba cancelado.' });

    await Promise.all(
      (car.products || [])
        .filter((p) => p.id_product && Number(p.amount) > 0)
        .map((p) => Product.findByIdAndUpdate(p.id_product, { $inc: { stock: Number(p.amount) } }))
    );

    res.json({ message: 'Pedido cancelado y stock devuelto.', data: updated });
  } catch (error) {
    console.log('error' + error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default saleController;
