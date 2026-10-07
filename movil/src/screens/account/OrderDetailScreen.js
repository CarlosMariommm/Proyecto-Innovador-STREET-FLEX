/*
 * ORDER DETAIL — el detalle de un pedido del historial: productos con su
 * talla/color y cantidad, datos de entrega, total y estado.
 *
 * Aqui se cancela un pedido pendiente (el servidor devuelve el stock de sus
 * productos, ver saleController.cancelSale) y de aqui se llega a valorar cada
 * producto comprado, que es el "RATE" de la maqueta de Figma.
 *
 * La confirmacion de cancelar es un aviso dentro de la propia pantalla y no un
 * Alert del sistema: Alert no existe en web, y asi se ve igual en todos lados.
 */

import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Package } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { cancelSale } from '../../api/saleApi';
import { formatCurrency } from '../../utils/formatCurrency';
import BackHeader from '../../components/ui/BackHeader';
import Button from '../../components/ui/Button';
import OrderStatusTag from '../../components/ui/OrderStatusTag';

const orderTotal = (sale) =>
  (sale.id_shoppig_car?.products || []).reduce((sum, p) => sum + (Number(p.subtotal) || 0), 0);

const OrderDetailScreen = ({ sale: initialSale, onBack, onOpenProduct }) => {
  const [status, setStatus] = useState(initialSale.status || 'Pendiente');
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  const products = initialSale.id_shoppig_car?.products || [];
  const date = initialSale.createdAt ? new Date(initialSale.createdAt).toLocaleDateString() : '';
  const canCancel = status === 'Pendiente';
  const canRate = status !== 'Cancelado';

  const handleCancel = async () => {
    try {
      setCancelling(true);
      setMessage({ text: '', isError: false });
      await cancelSale(initialSale._id);
      setStatus('Cancelado');
      setConfirming(false);
      setMessage({ text: 'Pedido cancelado. El stock de los productos volvio a estar disponible.', isError: false });
    } catch (err) {
      setMessage({ text: err.message || 'No se pudo cancelar el pedido', isError: true });
      setConfirming(false);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <View style={styles.screen}>
      <BackHeader title={`Pedido #${String(initialSale._id).slice(-6).toUpperCase()}`} onBack={onBack} />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <View>
            <Text style={styles.label}>FECHA</Text>
            <Text style={styles.value}>{date}</Text>
          </View>
          <OrderStatusTag status={status} />
        </View>

        <Text style={styles.sectionTitle}>PRODUCTOS</Text>
        {products.map((p, i) => {
          const product = p.id_product;
          const productId = product?._id || product;
          const variant = [p.size && `Talla ${p.size}`, p.color].filter(Boolean).join(' · ');
          return (
            <View key={i} style={styles.line}>
              <View style={styles.thumb}>
                {product?.image ? (
                  <Image source={{ uri: product.image }} style={styles.thumbImage} contentFit="contain" />
                ) : (
                  <Package size={22} color={COLORS.placeholder} />
                )}
              </View>
              <View style={styles.lineInfo}>
                <Text style={styles.lineName} numberOfLines={2}>
                  {product?.product_name || 'Producto'}
                </Text>
                {!!variant && <Text style={styles.lineVariant}>{variant}</Text>}
                <Text style={styles.lineQty}>
                  {p.amount} x {formatCurrency(product?.price)}
                </Text>
                {canRate && !!productId && (
                  <Pressable onPress={() => onOpenProduct(productId)} hitSlop={8}>
                    <Text style={styles.rate}>Valorar producto</Text>
                  </Pressable>
                )}
              </View>
              <Text style={styles.lineSubtotal}>{formatCurrency(p.subtotal)}</Text>
            </View>
          );
        })}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(orderTotal(initialSale))}</Text>
        </View>

        <Text style={styles.sectionTitle}>ENTREGA</Text>
        <Text style={styles.detail}>{initialSale.delivery_addres}</Text>
        <Text style={styles.detail}>{initialSale.city}</Text>
        {!!initialSale.payment_method && <Text style={styles.detailMuted}>Pago: {initialSale.payment_method}</Text>}

        {!!message.text && (
          <Text style={[styles.message, message.isError && styles.messageError]}>{message.text}</Text>
        )}

        {canCancel && !confirming && (
          <Button label="Cancelar pedido" onPress={() => setConfirming(true)} variant="outline" style={styles.cancel} />
        )}

        {canCancel && confirming && (
          <View style={styles.confirm}>
            <Text style={styles.confirmText}>Seguro que quieres cancelar este pedido?</Text>
            <Button label="Si, cancelar pedido" onPress={handleCancel} loading={cancelling} />
            <Button
              label="No, mantenerlo"
              onPress={() => setConfirming(false)}
              variant="outline"
              disabled={cancelling}
              style={styles.keep}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  body: {
    padding: 20,
    paddingBottom: 48,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.textMuted,
    marginBottom: 3,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.textMuted,
    marginTop: 26,
    marginBottom: 12,
  },
  line: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  lineInfo: {
    flex: 1,
  },
  lineName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  lineVariant: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  lineQty: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  rate: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    textDecorationLine: 'underline',
    marginTop: 6,
  },
  lineSubtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  detail: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 3,
  },
  detailMuted: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  message: {
    fontSize: 13,
    color: COLORS.success,
    marginTop: 22,
    lineHeight: 19,
  },
  messageError: {
    color: COLORS.error,
  },
  cancel: {
    marginTop: 28,
  },
  confirm: {
    marginTop: 28,
    gap: 10,
  },
  confirmText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  keep: {
    marginTop: 0,
  },
});

export default OrderDetailScreen;
