/*
 * ============================================================
 * CART CONTEXT — carrito de compras
 * ============================================================
 * El carrito vive en el telefono (SecureStore, ver utils/storage.js) mientras
 * se arma: no tiene sentido pegarle al backend en cada toque de "+". Recien en
 * el Checkout se sincroniza con `PUT /shopping-cars/sync/:clientId` (crea o
 * actualiza el Shopping_Car del cliente) y de ahi se crea la Sale — asi lo
 * modela backendST (Sale.id_shoppig_car apunta a un Shopping_Car existente).
 *
 * Se guarda una llave por persona y otra para quien todavia no inicio sesion,
 * para que al cerrar sesion no quede a la vista el carrito de otra cuenta. Al
 * iniciar sesion, si el carrito de invitado tenia productos, se conserva
 * localmente (no se pierde) y ademas se intenta traer el carrito que el
 * cliente ya tuviera guardado desde la web, por si hay algo para retomar.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCartByClient, syncCart as syncCartApi } from '../api/cartApi';
import { readItem, removeItem, saveItem, storageKey } from '../utils/storage';
import { useAuth } from '../hooks/useAuth';

const CartContext = createContext(null);

const cartKey = (userId) => storageKey('streetflex', 'cart', userId || 'guest');

// La misma prenda en dos tallas distintas son dos lineas distintas del
// carrito, no una — de ahi que la "identidad" de una linea sea el producto
// MAS la variante elegida, y no solo el id del producto.
const lineKey = (productId, size, color) => `${productId}::${size || ''}::${color || ''}`;

const normalizeItems = (raw) => {
  try {
    const items = JSON.parse(raw || '[]');
    if (!Array.isArray(items)) return [];
    return items
      .filter((i) => i?.productId && i?.product && Number(i.amount) > 0)
      .map((i) => ({ ...i, key: i.key || lineKey(i.productId, i.size, i.color) }));
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const key = cartKey(user?._id);

  // Al abrir la app, o al cambiar de persona: leer el carrito de esa llave.
  useEffect(() => {
    let alive = true;
    setLoaded(false);
    (async () => {
      const raw = await readItem(key);
      if (!alive) return;
      setItems(normalizeItems(raw));
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, [key]);

  const persist = useCallback(
    (nextItems) => {
      setItems(nextItems);
      if (nextItems.length === 0) {
        removeItem(key);
      } else {
        saveItem(key, JSON.stringify(nextItems));
      }
    },
    [key]
  );

  const addToCart = useCallback(
    (product, amount = 1, variant = {}) => {
      if (!product?._id) return;
      const { size = null, color = null } = variant;
      const key = lineKey(product._id, size, color);
      const stock = Number(product.stock) || 0;
      const existing = items.find((i) => i.key === key);
      const nextAmount = Math.min((existing?.amount || 0) + amount, Math.max(stock, 0));
      if (nextAmount <= 0) return;

      const snapshot = {
        product_name: product.product_name,
        price: product.price,
        image: product.image,
        stock,
      };

      if (existing) {
        persist(items.map((i) => (i.key === key ? { ...i, amount: nextAmount, product: snapshot } : i)));
      } else {
        persist([...items, { key, productId: product._id, product: snapshot, amount: nextAmount, size, color }]);
      }
    },
    [items, persist]
  );

  const updateAmount = useCallback(
    (key, amount) => {
      if (amount <= 0) {
        persist(items.filter((i) => i.key !== key));
        return;
      }
      persist(items.map((i) => (i.key === key ? { ...i, amount } : i)));
    },
    [items, persist]
  );

  const removeFromCart = useCallback(
    (key) => persist(items.filter((i) => i.key !== key)),
    [items, persist]
  );

  const clearCart = useCallback(() => persist([]), [persist]);

  // Al iniciar sesion: si hay un carrito guardado en el backend para este
  // cliente (de una sesion web anterior, por ejemplo) y el carrito local esta
  // vacio, se trae ese para no arrancar en cero.
  useEffect(() => {
    if (!isAuthenticated || !user?._id || !loaded || items.length > 0) return;
    let alive = true;
    (async () => {
      try {
        const remote = await fetchCartByClient(user._id);
        if (!alive || !remote?.products?.length) return;
        const remoteItems = remote.products
          .filter((p) => p.id_product)
          .map((p) => {
            const productId = p.id_product._id || p.id_product;
            return {
              key: lineKey(productId, p.size, p.color),
              productId,
              product: {
                product_name: p.id_product.product_name,
                price: p.id_product.price,
                image: p.id_product.image,
                stock: p.id_product.stock,
              },
              amount: p.amount,
              size: p.size || null,
              color: p.color || null,
            };
          });
        if (remoteItems.length) persist(remoteItems);
      } catch {
        /* Sin carrito remoto no pasa nada: se sigue con el local (vacio). */
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?._id, loaded]);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + (Number(i.product.price) || 0) * i.amount, 0),
    [items]
  );

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.amount, 0), [items]);

  // Empuja el carrito local al backend (Shopping_Car) y devuelve el doc
  // guardado, listo para usarse como id_shoppig_car al crear la Sale.
  const syncToBackend = useCallback(async () => {
    if (!user?._id) throw new Error('Debe iniciar sesion para continuar');
    const products = items.map((i) => ({
      id_product: i.productId,
      amount: i.amount,
      subtotal: (Number(i.product.price) || 0) * i.amount,
      size: i.size || undefined,
      color: i.color || undefined,
    }));
    return syncCartApi(user._id, { products, total, discount: 0, total_w_discount: total });
  }, [items, total, user?._id]);

  const value = useMemo(
    () => ({
      items,
      loaded,
      total,
      itemCount,
      addToCart,
      updateAmount,
      removeFromCart,
      clearCart,
      syncToBackend,
    }),
    [items, loaded, total, itemCount, addToCart, updateAmount, removeFromCart, clearCart, syncToBackend]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
};
