/*
 * ORDER STATUS TAG — la etiqueta con el estado de un pedido (Pendiente,
 * Entregado, Cancelado). La usan el historial y el detalle del pedido, para
 * que el mismo estado se vea igual en los dos.
 */

import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';

const VARIANTS = {
  Pendiente: { box: { borderColor: COLORS.text }, text: { color: COLORS.text } },
  Entregado: { box: { backgroundColor: COLORS.text, borderColor: COLORS.text }, text: { color: COLORS.background } },
  Cancelado: { box: { borderColor: COLORS.placeholder }, text: { color: COLORS.textMuted } },
};

const OrderStatusTag = ({ status = 'Pendiente' }) => {
  const variant = VARIANTS[status] || VARIANTS.Pendiente;

  return (
    <View style={[styles.tag, variant.box]}>
      <Text style={[styles.text, variant.text]}>{status.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});

export default OrderStatusTag;
