import { StyleSheet, Text, View } from 'react-native';
import { CircleCheck } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';
import Button from '../components/ui/Button';

const ReceiptScreen = ({ order, onViewOrders, onGoHome }) => (
  <View style={styles.screen}>
    <CircleCheck size={64} color={COLORS.text} />
    <Text style={styles.title}>Pedido confirmado</Text>
    <Text style={styles.text}>Gracias por tu compra. Tu pedido esta siendo procesado.</Text>

    <View style={styles.summary}>
      <View style={styles.row}>
        <Text style={styles.label}>Productos</Text>
        <Text style={styles.value}>{order?.itemCount ?? 0}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.value}>{formatCurrency(order?.total)}</Text>
      </View>
    </View>

    <Button label="Ver mis pedidos" onPress={onViewOrders} style={styles.button} />
    <Button label="Seguir comprando" onPress={onGoHome} variant="outline" style={styles.button} />
  </View>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  summary: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 16,
    marginBottom: 28,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  button: {
    marginTop: 10,
  },
});

export default ReceiptScreen;
