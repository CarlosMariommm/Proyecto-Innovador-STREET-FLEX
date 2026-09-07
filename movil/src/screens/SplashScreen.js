/*
 * SPLASH SCREEN — pantalla de carga adicional a la de Expo (criterio 7/14 de
 * la rubrica). El splash nativo de app.json se va en cuanto el JS arranca;
 * esta la reemplaza mientras se revisa si hay sesion guardada (useSplashTimer
 * la mantiene un minimo de tiempo para que no parpadee).
 */

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';

const SplashScreen = () => (
  <View style={styles.container}>
    <View style={styles.brand}>
      <Text style={styles.brandSmall}>BIENVENIDO A</Text>
      <Text style={styles.brandName}>STREET FLEX</Text>
    </View>
    <ActivityIndicator size="large" color={COLORS.text} style={styles.indicator} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  brand: {
    alignItems: 'center',
  },
  brandSmall: {
    fontSize: 13,
    color: COLORS.textMuted,
    letterSpacing: 2,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 1,
    marginTop: 6,
  },
  indicator: {
    marginTop: 32,
  },
});

export default SplashScreen;
