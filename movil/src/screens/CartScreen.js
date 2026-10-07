import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Package, X } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatCurrency';
import { pendingDestination, navigateTo } from '../navigation/navigationRef';
import BackHeader from '../components/ui/BackHeader';
import Button from '../components/ui/Button';

const CartScreen = ({ onBack, onCheckout }) => {
  const { items, total, updateAmount, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [stockNotice, setStockNotice] = useState('');

  const handleIncrease = (item) => {
    const result = updateAmount(item.key, item.amount + 1);
    setStockNotice(
      result.status === 'limit'
        ? `Solo hay ${result.stock} unidades disponibles de ${item.product.product_name}.`
        : ''
    );
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      pendingDestination.current = 'Cart';
      navigateTo('Login');
      return;
    }
    onCheckout();
  };

  return (
    <View style={styles.screen}>
      <BackHeader title="Carrito" onBack={onBack} />

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Package size={48} color={COLORS.placeholder} />
          <Text style={styles.emptyText}>Tu carrito esta vacio.</Text>
          <Button label="Seguir viendo la tienda" onPress={onBack} variant="outline" style={styles.emptyButton} />
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const variantLabel = [item.size && `Talla ${item.size}`, item.color && item.color]
                .filter(Boolean)
                .join(' · ');

              return (
                <View style={styles.row}>
                  <View style={styles.imageFrame}>
                    {item.product.image ? (
                      <Image source={{ uri: item.product.image }} style={styles.image} contentFit="contain" />
                    ) : (
                      <Package size={26} color={COLORS.placeholder} />
                    )}
                  </View>

                  <View style={styles.details}>
                    <View style={styles.detailsHeader}>
                      <Text style={styles.name} numberOfLines={2}>
                        {item.product.product_name}
                      </Text>
                      <Text style={styles.linePrice}>{formatCurrency(item.product.price * item.amount)}</Text>
                    </View>

                    {!!variantLabel && <Text style={styles.variant}>{variantLabel}</Text>}

                    <View style={styles.stepper}>
                      <Pressable
                        onPress={() => updateAmount(item.key, item.amount - 1)}
                        style={styles.stepperButton}
                        accessibilityRole="button"
                        accessibilityLabel="Restar"
                      >
                        <Text style={styles.stepperText}>-</Text>
                      </Pressable>
                      <Text style={styles.stepperValue}>{item.amount}</Text>
                      <Pressable
                        onPress={() => handleIncrease(item)}
                        style={styles.stepperButton}
                        accessibilityRole="button"
                        accessibilityLabel="Sumar"
                      >
                        <Text style={styles.stepperText}>+</Text>
                      </Pressable>
                    </View>
                  </View>

                  <Pressable
                    onPress={() => removeFromCart(item.key)}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={`Quitar ${item.product.product_name}`}
                    style={styles.remove}
                  >
                    <X size={18} color={COLORS.textMuted} />
                  </Pressable>
                </View>
              );
            }}
          />

          <View style={styles.footer}>
            {!!stockNotice && <Text style={styles.stockNotice}>{stockNotice}</Text>}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>
            <Button label="Ir a pagar" onPress={handleCheckout} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 12,
    marginBottom: 24,
  },
  emptyButton: {
    maxWidth: 260,
  },
  list: {
    padding: 16,
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  imageFrame: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  linePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  variant: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 3,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  stepperButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  stepperValue: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  remove: {
    padding: 4,
  },
  stockNotice: {
    fontSize: 12.5,
    color: COLORS.error,
    marginBottom: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
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
});

export default CartScreen;
