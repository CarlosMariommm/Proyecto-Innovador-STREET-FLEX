/*
 * Semilla de datos de demostracion para la app movil (criterio 3 de la
 * rubrica: "deben existir datos dentro de la base de datos para demostrar
 * el funcionamiento de la app"). Idempotente: si ya hay productos, no hace
 * nada — no borra ni duplica lo que el equipo ya haya cargado desde el panel
 * admin.
 *
 * Uso:
 *   node seedMovilDemo.js
 */

import mongoose from 'mongoose';
import { config } from './config.js';
import Module from './src/models/moduleModel.js';
import Supplier from './src/models/supplierModel.js';
import Category from './src/models/categoryModel.js';
import Product from './src/models/productModel.js';
import Banner from './src/models/bannerModel.js';

const PLACEHOLDER = (seed, w = 600, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const CATEGORY_SEEDS = [
  { name: 'Camisetas', description: 'Camisetas y tops de calle' },
  { name: 'Hoodies', description: 'Buzos y hoodies' },
  { name: 'Pantalones', description: 'Jeans, joggers y cargo' },
  { name: 'Accesorios', description: 'Gorras, bolsos y mas' },
];

const PRODUCT_SEEDS = [
  { name: 'Camiseta Oversize Negra', category: 'Camisetas', price: 18.99, color: 'Negro', size: 'M', stock: 25, material: 'Algodon 100%' },
  { name: 'Camiseta Grafica Blanca', category: 'Camisetas', price: 19.99, color: 'Blanco', size: 'L', stock: 18, material: 'Algodon 100%' },
  { name: 'Hoodie Street Gris', category: 'Hoodies', price: 39.99, color: 'Gris', size: 'M', stock: 12, material: 'Fleece' },
  { name: 'Hoodie Negro Minimal', category: 'Hoodies', price: 42.99, color: 'Negro', size: 'L', stock: 4, material: 'Fleece' },
  { name: 'Jogger Cargo Verde Olivo', category: 'Pantalones', price: 34.99, color: 'Verde olivo', size: '32', stock: 15, material: 'Sarga' },
  { name: 'Jean Recto Azul', category: 'Pantalones', price: 44.99, color: 'Azul', size: '30', stock: 9, material: 'Denim' },
  { name: 'Gorra Bordada Negra', category: 'Accesorios', price: 14.99, color: 'Negro', size: 'Unica', stock: 30, material: 'Algodon' },
  { name: 'Bolso Crossbody Urbano', category: 'Accesorios', price: 24.99, color: 'Negro', size: 'Unica', stock: 0, material: 'Nylon' },
];

async function run() {
  await mongoose.connect(config.db.URI);
  console.log('DB conectada');

  const existingProducts = await Product.countDocuments();
  if (existingProducts > 0) {
    console.log(`Ya hay ${existingProducts} productos en la base de datos, no se sembro nada.`);
    await mongoose.disconnect();
    return;
  }

  const streetModule = await Module.findOneAndUpdate(
    { name: 'Streetwear' },
    { name: 'Streetwear', active: true },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const supplier = await Supplier.findOneAndUpdate(
    { supp_name: 'STREET FLEX Demo Supplier' },
    {
      supp_name: 'STREET FLEX Demo Supplier',
      email: 'demo-supplier@streetflex.test',
      phone_number: '0000-0000',
      direction: 'San Salvador',
      active: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const categoriesByName = {};
  for (const cat of CATEGORY_SEEDS) {
    const doc = await Category.create({
      name: cat.name,
      description: cat.description,
      supplier: supplier._id,
      id_module: streetModule._id,
      active: true,
    });
    categoriesByName[cat.name] = doc;
  }

  for (const p of PRODUCT_SEEDS) {
    await Product.create({
      product_name: p.name,
      price: p.price,
      description: `${p.name} — pieza streetwear de la coleccion STREET FLEX.`,
      color: p.color,
      size: p.size,
      stock: p.stock,
      material: p.material,
      category: categoriesByName[p.category]._id,
      id_module: streetModule._id,
      supplier: supplier._id,
      image: PLACEHOLDER(p.name.toLowerCase().replace(/\s+/g, '-')),
      active: true,
    });
  }

  await Banner.create([
    { id_module: streetModule._id, image: PLACEHOLDER('banner-1', 1200, 500), active: true },
    { id_module: streetModule._id, image: PLACEHOLDER('banner-2', 1200, 500), active: true },
  ]);

  console.log(`Listo: ${CATEGORY_SEEDS.length} categorias, ${PRODUCT_SEEDS.length} productos, 2 banners.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Error sembrando datos:', err);
  process.exit(1);
});
