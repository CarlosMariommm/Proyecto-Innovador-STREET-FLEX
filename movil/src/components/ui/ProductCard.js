/*
 * PRODUCT CARD — la pieza en la grilla de Home. Pensada como ficha de
 * catalogo/archivo: la foto ocupa toda la tarjeta (sin caja recuadrada
 * adentro), tipografia editorial (nombre como titulo, precio chico debajo) y
 * sin boton de accion — se toca la ficha entera para ver el detalle, que es
 * donde vive "agregar al carrito". Menos botones por tarjeta, catalogo mas
 * limpio.
 */

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
// expo-image en vez del Image nativo: decodifica mejor los .webp que sirve
// Cloudinary para las fotos de producto.
import { Image } from 'expo-image';
import { Package } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductCard = ({ product, onPress }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const outOfStock = Number(product.stock) <= 0;

  return (
    <Pressable
      onPress={() => onPress?.(product)}
      accessibilityRole="button"
      accessibilityLabel={`${product.product_name}, ${formatCurrency(product.price)}`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.imageFrame}>
        {product.image && !imageFailed ? (
          <Image
            source={{ uri: product.image }}
            contentFit="contain"
            style={styles.image}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <Package size={30} color={COLORS.placeholder} />
        )}

        {outOfStock && (
          <View style={styles.soldOutTag}>
            <Text style={styles.soldOutText}>AGOTADO</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        {!!product.category?.name && (
          <Text style={styles.category} numberOfLines={1}>
            {product.category.name.toUpperCase()}
          </Text>
        )}
        <Text style={styles.name} numberOfLines={2}>
          {product.product_name}
        </Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  cardPressed: {
    opacity: 0.75,
  },
  imageFrame: {
    backgroundColor: COLORS.background,
    aspectRatio: 0.8,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  soldOutTag: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    backgroundColor: COLORS.background,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  soldOutText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: COLORS.text,
  },
  body: {
    paddingTop: 10,
  },
  category: {
    fontSize: 9.5,
    color: COLORS.textMuted,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 18,
  },
  price: {
    fontSize: 12.5,
    fontWeight: '400',
    color: COLORS.textMuted,
    marginTop: 4,
  },
});

export default ProductCard;
