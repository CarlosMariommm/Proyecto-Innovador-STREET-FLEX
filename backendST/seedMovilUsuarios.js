/*
 * Datos de demostracion para la revision de la app movil: la rubrica pide
 * "usuarios que tengan realizados pedidos para comprobar el historial de
 * pedidos y la valoracion de productos".
 *
 * Crea 3 clientes de prueba YA VERIFICADOS, con pedidos entregados (para el
 * historial), un pedido pendiente por cliente (para demostrar la cancelacion
 * y que el stock se devuelve) y valoraciones con comentario en los productos
 * que compraron.
 *
 * Es idempotente: si los clientes de demostracion ya existen no hace nada, y
 * nunca borra ni modifica datos que no sean de ellos.
 *
 * Uso:   node seedMovilUsuarios.js
 * Cuentas (solo para demostracion):  <correo>  /  Demo1234
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './config.js';
import Client from './src/models/clientModel.js';
import Product from './src/models/productModel.js';
import Shopping_Car from './src/models/shoppingCarModel.js';
import Sale from './src/models/saleModel.js';

const DEMO_PASSWORD = 'Demo1234';

const DEMO_CLIENTS = [
  { full_name: 'Ana Martinez', username: 'ana_demo', email: 'ana.demo@streetflex.test', phone_number: '7000-1111', age: 24, city: 'San Salvador', address: 'Colonia Escalon, Calle 1 #12' },
  { full_name: 'Luis Hernandez', username: 'luis_demo', email: 'luis.demo@streetflex.test', phone_number: '7000-2222', age: 31, city: 'Santa Tecla', address: 'Residencial Los Pinos, Casa 8' },
  { full_name: 'Sofia Ramirez', username: 'sofia_demo', email: 'sofia.demo@streetflex.test', phone_number: '7000-3333', age: 19, city: 'Soyapango', address: 'Colonia Montecristo, Pasaje 3' },
];

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

// Un pedido: arma el carrito, la venta y devuelve las lineas para valorar.
const createOrder = async ({ client, picks, status, createdAt }) => {
  const products = picks.map(({ product, amount, size, color }) => ({
    id_product: product._id,
    amount,
    subtotal: Number(product.price) * amount,
    size,
    color,
  }));
  const total = products.reduce((sum, p) => sum + p.subtotal, 0);

  const car = await Shopping_Car.create({
    products,
    id_client: client._id,
    total,
    discount: 0,
    total_w_discount: total,
    createdAt,
  });

  await Sale.create({
    id_shoppig_car: car._id,
    delivery_addres: client.address,
    city: client.city,
    payment_method: 'Simulado (Wompi)',
    payment_status: 'true',
    status,
    createdAt,
  });

  // Un pedido pendiente ya "reservo" su stock, igual que haria createSale: asi,
  // si se cancela desde la app, el stock que se devuelve cuadra con el real.
  if (status === 'Pendiente') {
    await Promise.all(
      picks.map(({ product, amount }) => Product.updateOne({ _id: product._id }, { $inc: { stock: -amount } }))
    );
  }
};

const addReview = async ({ productId, clientId, rating, comment, date }) => {
  await Product.updateOne({ _id: productId }, { $push: { reviews: { id_client: clientId, rating, comment, date } } });
  const fresh = await Product.findById(productId).select('reviews').lean();
  const ratings = (fresh.reviews || []).map((r) => r.rating);
  const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  await Product.updateOne({ _id: productId }, { $set: { average_rating: Number(average.toFixed(2)) } });
};

async function run() {
  await mongoose.connect(config.db.URI);
  console.log('DB conectada');

  const already = await Client.countDocuments({ email: { $in: DEMO_CLIENTS.map((c) => c.email) } });
  if (already > 0) {
    console.log('Los clientes de demostracion ya existen, no se sembro nada.');
    await mongoose.disconnect();
    return;
  }

  const products = await Product.find({ active: { $ne: false } }).lean();
  if (products.length < 3) {
    console.log('Hacen falta al menos 3 productos para sembrar pedidos. Crea productos primero (node seedMovilDemo.js).');
    await mongoose.disconnect();
    return;
  }

  // Reparte los productos entre los clientes: cada uno compra cosas distintas.
  const pick = (i) => products[i % products.length];
  const variant = (product, key) => {
    const list = product[key] || [];
    return list.length ? list[0] : undefined;
  };
  const line = (i, amount = 1) => {
    const product = pick(i);
    return { product, amount, size: variant(product, 'sizes'), color: variant(product, 'colors') };
  };

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(DEMO_PASSWORD, salt);

  const reviewTexts = [
    [5, 'Excelente calidad, llego rapido y la talla es la correcta.'],
    [4, 'Muy bonito, el material se siente bien. Lo recomiendo.'],
    [5, 'Me encanto, justo como en las fotos.'],
    [3, 'Esta bien, aunque esperaba un acabado un poco mejor.'],
    [4, 'Buena compra por el precio, volveria a pedir.'],
    [5, 'Comodo y con buen estilo, cumple perfecto.'],
  ];

  for (let c = 0; c < DEMO_CLIENTS.length; c++) {
    const data = DEMO_CLIENTS[c];
    const client = await Client.create({
      username: data.username,
      email: data.email,
      password,
      full_name: data.full_name,
      phone_number: data.phone_number,
      age: data.age,
      verified: true,
      active: true,
    });
    client.address = data.address;
    client.city = data.city;

    // Dos pedidos entregados (historial) y uno pendiente (para cancelar).
    const delivered1 = [line(c * 2), line(c * 2 + 1, 2)];
    const delivered2 = [line(c * 2 + 2)];
    const pending = [line(c * 2 + 3)];

    await createOrder({ client, picks: delivered1, status: 'Entregado', createdAt: daysAgo(20 - c) });
    await createOrder({ client, picks: delivered2, status: 'Entregado', createdAt: daysAgo(9 - c) });
    await createOrder({ client, picks: pending, status: 'Pendiente', createdAt: daysAgo(1) });

    // Valoraciones en lo que compro y ya le llego.
    const reviewed = new Set();
    let r = 0;
    for (const { product } of [...delivered1, ...delivered2]) {
      const id = String(product._id);
      if (reviewed.has(id)) continue;
      reviewed.add(id);
      const [rating, comment] = reviewTexts[(c * 2 + r) % reviewTexts.length];
      await addReview({
        productId: product._id,
        clientId: client._id,
        rating,
        comment,
        date: daysAgo(5 - r),
      });
      r++;
    }

    console.log(`Cliente ${data.email}: 2 pedidos entregados, 1 pendiente, ${reviewed.size} valoraciones.`);
  }

  console.log(`Listo. Cuentas de demostracion: ${DEMO_CLIENTS.map((c) => c.email).join(', ')} / ${DEMO_PASSWORD}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Error sembrando datos:', err);
  process.exit(1);
});
