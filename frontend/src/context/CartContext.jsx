import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('streetflex_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Cargar el carrito desde el backend cuando el usuario se loguea
  useEffect(() => {
    const loadServerCart = async () => {
      if (user && user.role === 'client') {
        try {
          const res = await api.get(`/shopping-cars/client/${user._id}`);
          if (res.data.data) {
            // Convertir formato del backend al formato del frontend
            const serverItems = res.data.data.products.map(p => ({
              product: p.id_product, // ya viene populado
              quantity: p.amount
            }));
            setCart(serverItems);
          }
        } catch (err) {
          console.error('Error al cargar carrito del servidor:', err);
        }
      }
    };
    loadServerCart();
  }, [user]);

  // Guardar en localStorage siempre (para invitados o como respaldo)
  useEffect(() => {
    localStorage.setItem('streetflex_cart', JSON.stringify(cart));
  }, [cart]);

  // Sincronizar con el backend cuando cambie el carrito y el usuario esté logueado
  const syncToServer = useCallback(async (updatedCart) => {
    if (user && user.role === 'client') {
      try {
        const total = updatedCart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        await api.put(`/shopping-cars/sync/${user._id}`, {
          products: updatedCart.map(item => ({
            id_product: item.product._id,
            amount: item.quantity,
            subtotal: item.product.price * item.quantity
          })),
          total,
          discount: 0,
          total_w_discount: total
        });
      } catch (err) {
        console.error('Error al sincronizar carrito:', err);
      }
    }
  }, [user]);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.product._id === product._id);
      let newCart;
      if (existingProduct) {
        newCart = prevCart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prevCart, { product, quantity }];
      }
      syncToServer(newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.product._id !== productId);
      syncToServer(newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    
    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      );
      syncToServer(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    syncToServer([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

