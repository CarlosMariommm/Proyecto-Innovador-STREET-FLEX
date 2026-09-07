/*
 * STREET FLEX MOVIL — punto de entrada.
 *
 * Solo arma los providers y entrega el arbol a RootNavigator (src/navigation/):
 * la navegacion en si vive ahi, no aqui, para que App.js quede minimo
 * (criterio 9 de la rubrica: la mayor cantidad de codigo posible fuera de
 * App.js).
 *
 * El orden importa: AuthProvider va antes que CartProvider porque el carrito
 * necesita saber de quien es la sesion (llave por persona, ver CartContext).
 */

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
