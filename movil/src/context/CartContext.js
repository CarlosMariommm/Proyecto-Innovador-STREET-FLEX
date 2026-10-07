/*
 * ============================================================
 * CART CONTEXT — carrito de compras
 * ============================================================
 * El carrito vive en el telefono (SecureStore, ver utils/storage.js) mientras
 * se arma: no tiene sentido pegarle al backend en cada toque de "+". Recien en
 * el Checkout se guarda como un Shopping_Car NUEVO (`POST /shopping-cars`) y de
 * ahi se crea la Sale que lo referencia — asi lo modela backendST. Es nuevo en
 * cada pedido a proposito: reutilizar uno solo por cliente hacia que un pedido
 * nuevo reescribiera los productos de los pedidos anteriores.
 *
 * Se guarda una llave por persona y otra para quien todavia no inicio sesion,
 * para que al cerrar sesion no quede a la vista el carrito de otra cuenta. Al
 * iniciar sesion, lo que se hubiera agregado como invitado se pasa al carrito
 * de la cuenta (quien llena el carrito y recien despues entra a pagar no lo
 * ve desaparecer).
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createOrderCart as createOrderCartApi } from '../api/cartApi';
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

// Suma las lineas del carrito de invitado a las de la cuenta. Si una misma
// prenda (misma talla y color) esta en las dos, se suman las cantidades sin
// pasar del stock que hay.
const mergeItems = (own, guest) => {
  const merged = [...own];
  guest.forEach((line) => {
    const index = merged.findIndex((i) => i.key === line.key);
    if (index === -1) {
      merged.push(line);
      return;
    }
    const stock = Number(line.product.stock) || Infinity;
    merged[index] = { ...merged[index], amount: Math.min(merged[index].amount + line.amount, stock) };
  });
  return merged;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const key = cartKey(user?._id);

  // Al abrir la app, o al cambiar de persona: leer el carrito de esa llave. Si
  // hay una cuenta con sesion, se le suma lo que se haya agregado de invitado.
  useEffect(() => {
    let alive = true;
    setLoaded(false);
    (async () => {
      let current = normalizeItems(await readItem(key));

      if (user?._id) {
        const guestKey = cartKey(null);
        const guest = normalizeItems(await readItem(guestKey));
        if (guest.length > 0) {
          current = mergeItems(current, guest);
          await saveItem(key, JSON.stringify(current));
          await removeItem(guestKey);
        }
      }

      if (!alive) return;
      setItems(current);
      setLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, [key, user?._id]);

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
      if (!product?._id) return { status: 'invalid' };
      const { size = null, color = null } = variant;
      const key = lineKey(product._id, size, color);
      const stock = Number(product.stock) || 0;
      const existing = items.find((i) => i.key === key);
      // El stock es del producto, no de cada talla/color: la misma prenda en dos
      // tallas comparte las mismas unidades, asi que se cuenta todo lo que ya
      // hay en el carrito de ese producto.
      const inCartTotal = items
        .filter((i) => i.productId === product._id)
        .reduce((sum, i) => sum + i.amount, 0);

      // Control de inventario: nunca se agrega mas de lo que hay. Se devuelve
      // que paso para que la pantalla le explique al cliente por que no se
      // agrego (antes simplemente no pasaba nada).
      if (stock <= 0) return { status: 'out_of_stock', stock: 0, inCart: inCartTotal };
      if (!Number.isInteger(amount) || amount <= 0) return { status: 'invalid', stock, inCart: inCartTotal };
      if (inCartTotal >= stock) return { status: 'limit', stock, inCart: inCartTotal };

      const toAdd = Math.min(amount, stock - inCartTotal);
      const nextAmount = (existing?.amount || 0) + toAdd;
      const result = {
        status: toAdd < amount ? 'capped' : 'added',
        stock,
        inCart: inCartTotal + toAdd,
      };

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

      return result;
    },
    [items, persist]
  );

  // Cambia la cantidad de una linea. Devuelve el tope si se intento pasar del
  // stock disponible (el total de ese producto entre todas sus tallas/colores).
  const updateAmount = useCallback(
    (key, amount) => {
      if (amount <= 0) {
        persist(items.filter((i) => i.key !== key));
        return { status: 'removed' };
      }
      const line = items.find((i) => i.key === key);
      if (!line) return { status: 'invalid' };

      const others = items
        .filter((i) => i.productId === line.productId && i.key !== key)
        .reduce((sum, i) => sum + i.amount, 0);
      const room = Math.max((Number(line.product.stock) || 0) - others, 0);
      const next = Math.min(amount, room);

      if (next <= 0) {
        persist(items.filter((i) => i.key !== key));
        return { status: 'removed' };
      }
      persist(items.map((i) => (i.key === key ? { ...i, amount: next } : i)));
      return next < amount ? { status: 'limit', stock: line.product.stock } : { status: 'ok' };
    },
    [items, persist]
  );

  const removeFromCart = useCallback(
    (key) => persist(items.filter((i) => i.key !== key)),
    [items, persist]
  );

  const clearCart = useCallback(() => persist([]), [persist]);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + (Number(i.product.price) || 0) * i.amount, 0),
    [items]
  );

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.amount, 0), [items]);

  // Guarda el carrito local como un Shopping_Car nuevo en el backend y devuelve
  // su id, listo para usarse como id_shoppig_car al crear la Sale. Uno nuevo
  // por pedido: asi cada pedido conserva sus propios productos.
  const saveOrderCart = useCallback(async () => {
    if (!user?._id) throw new Error('Debe iniciar sesion para continuar');
    if (items.length === 0) throw new Error('Tu carrito esta vacio');
    const products = items.map((i) => ({
      id_product: i.productId,
      amount: i.amount,
      subtotal: (Number(i.product.price) || 0) * i.amount,
      size: i.size || undefined,
      color: i.color || undefined,
    }));
    return createOrderCartApi({ products, id_client: user._id, total, discount: 0, total_w_discount: total });
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
      saveOrderCart,
    }),
    [items, loaded, total, itemCount, addToCart, updateAmount, removeFromCart, clearCart, saveOrderCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
};
