/*
 * CHECKOUT — mismos campos que frontend/src/screens/web/ReceiptScreen.jsx
 * (telefono, ciudad, direccion, codigo postal) y el mismo flujo en dos pasos
 * contra backendST: se sincroniza el Shopping_Car del cliente y despues se
 * crea la Sale que lo referencia.
 */

import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { createSale } from '../api/saleApi';
import { validateForm, validatePhone, validateRequired, hasNoErrors } from '../utils/validations';
import { formatCurrency } from '../utils/formatCurrency';
import BackHeader from '../components/ui/BackHeader';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';

const PAYMENT_METHOD = 'Simulado (Wompi)';

const CheckoutScreen = ({ onBack, onConfirmed }) => {
  const { user } = useAuth();
  const { items, total, syncToBackend, clearCart } = useCart();

  const [values, setValues] = useState({
    phone: user?.phone_number || '',
    city: '',
    address: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (text) => {
    setValues((v) => ({ ...v, [field]: text }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
  };

  const handleConfirm = async () => {
    const found = validateForm(values, {
      phone: validatePhone,
      city: validateRequired('La ciudad'),
      address: validateRequired('La direccion'),
    });
    setErrors(found);
    if (!hasNoErrors(found)) return;

    try {
      setLoading(true);
      setServerError('');
      const cart = await syncToBackend();
      const sale = await createSale({
        id_shoppig_car: cart._id,
        delivery_addres: values.address.trim(),
        city: values.city.trim(),
        payment_method: PAYMENT_METHOD,
        payment_status: true,
      });
      clearCart();
      onConfirmed({ sale, total, itemCount: items.length });
    } catch (err) {
      setServerError(err.message || 'No se pudo procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <BackHeader title="Pagar" onBack={onBack} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total a pagar</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>

          <Text style={styles.sectionTitle}>Datos de entrega</Text>

          <TextField
            label="Telefono"
            value={values.phone}
            onChangeText={handleChange('phone')}
            error={errors.phone}
            keyboardType="phone-pad"
          />
          <TextField label="Ciudad" value={values.city} onChangeText={handleChange('city')} error={errors.city} />
          <TextField
            label="Direccion"
            value={values.address}
            onChangeText={handleChange('address')}
            error={errors.address}
          />
          <TextField
            label="Codigo postal"
            value={values.postalCode}
            onChangeText={handleChange('postalCode')}
          />

          <Text style={styles.sectionTitle}>Productos</Text>
          {items.map((item) => {
            const variantLabel = [item.size && `Talla ${item.size}`, item.color].filter(Boolean).join(' · ');
            return (
              <View key={item.key} style={styles.item}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.product.product_name}
                  {variantLabel ? ` (${variantLabel})` : ''} x{item.amount}
                </Text>
                <Text style={styles.itemPrice}>{formatCurrency(item.product.price * item.amount)}</Text>
              </View>
            );
          })}

          {!!serverError && (
            <View style={styles.notice}>
              <Text style={styles.noticeText}>{serverError}</Text>
            </View>
          )}

          <Button
            label={loading ? 'Procesando...' : 'Confirmar pedido (pago simulado)'}
            onPress={handleConfirm}
            loading={loading}
            style={styles.confirmButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  body: {
    padding: 20,
    paddingBottom: 48,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  notice: {
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 20,
  },
  noticeText: {
    color: COLORS.error,
    fontSize: 13,
  },
  confirmButton: {
    marginTop: 24,
  },
});

export default CheckoutScreen;
