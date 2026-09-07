import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Package } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { fetchSalesByClient } from '../../api/saleApi';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatCurrency';
import LoadingIndicator from '../../components/ui/LoadingIndicator';

const orderTotal = (sale) =>
  (sale.id_shoppig_car?.products || []).reduce((sum, p) => sum + (Number(p.subtotal) || 0), 0);

const OrderCard = ({ sale }) => {
  const products = sale.id_shoppig_car?.products || [];
  const date = sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : '';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Pedido #{String(sale._id).slice(-6).toUpperCase()}</Text>
        <Text style={styles.orderDate}>{date}</Text>
      </View>

      {products.map((p, i) => {
        const variantLabel = [p.size && `talla ${p.size}`, p.color].filter(Boolean).join(' · ');
        return (
          <Text key={i} style={styles.item} numberOfLines={1}>
            {p.id_product?.product_name || 'Producto'}
            {variantLabel ? ` (${variantLabel})` : ''} x{p.amount}
          </Text>
        );
      })}

      <View style={styles.cardFooter}>
        <Text style={styles.address} numberOfLines={1}>
          {sale.delivery_addres}, {sale.city}
        </Text>
        <Text style={styles.total}>{formatCurrency(orderTotal(sale))}</Text>
      </View>
    </View>
  );
};

const OrderHistoryScreen = () => {
  const { top } = useSafeAreaInsets();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      setError('');
      const data = await fetchSalesByClient(user._id);
      setOrders(data);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar tus pedidos');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) return <LoadingIndicator label="Cargando pedidos..." />;

  return (
    <View style={[styles.screen, { paddingTop: top }]}>
      <Text style={styles.title}>Mis pedidos</Text>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <OrderCard sale={item} />}
        ListEmptyComponent={
          !error ? (
            <View style={styles.empty}>
              <Package size={40} color={COLORS.placeholder} />
              <Text style={styles.emptyText}>Todavia no tienes pedidos.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  error: {
    color: COLORS.error,
    fontSize: 13,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  item: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  address: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textMuted,
    marginRight: 8,
  },
  total: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  empty: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 10,
  },
});

export default OrderHistoryScreen;
