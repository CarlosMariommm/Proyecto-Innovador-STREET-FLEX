import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Heart, Package, Star } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { fetchProductById, addProductReview } from '../api/productApi';
import { addFavorite, removeFavorite } from '../api/clientApi';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import BackHeader from '../components/ui/BackHeader';
import Button from '../components/ui/Button';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import RatingStars from '../components/product/RatingStars';
import ReviewItem from '../components/product/ReviewItem';

// Nombres de color comunes -> un tono aproximado, solo para pintar un puntito
// junto al texto de la pildora. Si el color no esta en la lista, la pildora
// se queda solo con el texto — no vale la pena adivinar un hex incorrecto.
const COLOR_SWATCHES = {
  negro: '#000000',
  blanco: '#FFFFFF',
  gris: '#9E9E9E',
  azul: '#1E3A8A',
  celeste: '#60A5FA',
  rojo: '#B91C1C',
  verde: '#166534',
  amarillo: '#EAB308',
  dorado: '#B8860B',
  plateado: '#B0B0B0',
  cafe: '#6B4226',
  marron: '#6B4226',
  beige: '#D9C7A3',
  rosado: '#EC4899',
  rosa: '#EC4899',
  morado: '#6D28D9',
  naranja: '#EA580C',
};

const swatchFor = (name) => COLOR_SWATCHES[String(name).trim().toLowerCase()];

const VariantPicker = ({ label, options, selected, onSelect, showSwatch }) => (
  <View style={styles.variantGroup}>
    <Text style={styles.variantLabel}>{label}</Text>
    <View style={styles.pillRow}>
      {options.map((option) => {
        const active = selected === option;
        const swatch = showSwatch ? swatchFor(option) : null;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={[styles.pill, active && styles.pillActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            {!!swatch && (
              <View style={[styles.swatchDot, { backgroundColor: swatch }, swatch === '#FFFFFF' && styles.swatchDotBorder]} />
            )}
            <Text style={[styles.pillText, active && styles.pillTextActive]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

const ProductDetailsScreen = ({ productId, onBack }) => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [variantError, setVariantError] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewNotice, setReviewNotice] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchProductById(productId);
      setProduct(data);
      // Si solo hay una opcion de cada una, se preselecciona: nadie necesita
      // "elegir" cuando no hay entre que elegir.
      setSelectedSize(data.sizes?.length === 1 ? data.sizes[0] : null);
      setSelectedColor(data.colors?.length === 1 ? data.colors[0] : null);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el producto');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setIsFavorite((user?.favorites || []).some((id) => id === productId || id?._id === productId));
  }, [user, productId]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) return;
    try {
      if (isFavorite) {
        const res = await removeFavorite(productId);
        setIsFavorite(false);
        updateUser({ favorites: res.favorites });
      } else {
        const res = await addFavorite(productId);
        setIsFavorite(true);
        updateUser({ favorites: res.favorites });
      }
    } catch {
      /* Si falla, el corazon se queda como estaba: no hay nada mas que avisar aqui. */
    }
  };

  const submitReview = async () => {
    if (!user?._id) return;
    try {
      setSubmittingReview(true);
      setReviewNotice('');
      await addProductReview({ productId, id_client: user._id, rating: reviewRating, comment: reviewComment });
      setReviewComment('');
      setReviewNotice('Gracias por tu resena.');
      load();
    } catch (err) {
      setReviewNotice(err.message || 'No se pudo enviar la resena');
    } finally {
      setSubmittingReview(false);
    }
  };

  const hasSizes = (product?.sizes?.length || 0) > 0;
  const hasColors = (product?.colors?.length || 0) > 0;

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      setVariantError('Elegi una talla');
      return;
    }
    if (hasColors && !selectedColor) {
      setVariantError('Elegi un color');
      return;
    }
    setVariantError('');
    addToCart(product, quantity, { size: selectedSize, color: selectedColor });
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <BackHeader title="Producto" onBack={onBack} />
        <LoadingIndicator label="Cargando producto..." />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.screen}>
        <BackHeader title="Producto" onBack={onBack} />
        <View style={styles.center}>
          <Text style={styles.errorText}>{error || 'Producto no encontrado'}</Text>
        </View>
      </View>
    );
  }

  const outOfStock = Number(product.stock) <= 0;

  return (
    <View style={styles.screen}>
      <BackHeader
        title={product.product_name}
        onBack={onBack}
        right={
          isAuthenticated ? (
            <Pressable onPress={toggleFavorite} hitSlop={8} accessibilityRole="button" accessibilityLabel="Favorito">
              <Heart size={22} color={COLORS.text} fill={isFavorite ? COLORS.text : 'none'} />
            </Pressable>
          ) : null
        }
      />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.imageFrame}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.image} contentFit="contain" />
          ) : (
            <Package size={64} color={COLORS.placeholder} />
          )}
        </View>

        {!!product.category?.name && <Text style={styles.category}>{product.category.name.toUpperCase()}</Text>}
        <Text style={styles.name}>{product.product_name}</Text>
        <RatingStars rating={product.average_rating} />
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>

        <Text style={styles.stock}>{outOfStock ? 'Sin existencias' : `${product.stock} disponibles`}</Text>

        {!!product.description && <Text style={styles.description}>{product.description}</Text>}

        {hasSizes && (
          <VariantPicker label="Talla" options={product.sizes} selected={selectedSize} onSelect={(v) => { setSelectedSize(v); setVariantError(''); }} />
        )}
        {hasColors && (
          <VariantPicker
            label="Color"
            options={product.colors}
            selected={selectedColor}
            onSelect={(v) => { setSelectedColor(v); setVariantError(''); }}
            showSwatch
          />
        )}
        {!!variantError && <Text style={styles.variantErrorText}>{variantError}</Text>}

        <View style={styles.quantityRow}>
          <Text style={styles.quantityLabel}>Cantidad</Text>
          <View style={styles.stepper}>
            <Pressable
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              style={styles.stepperButton}
              accessibilityRole="button"
              accessibilityLabel="Restar"
            >
              <Text style={styles.stepperText}>-</Text>
            </Pressable>
            <Text style={styles.stepperValue}>{quantity}</Text>
            <Pressable
              onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              style={styles.stepperButton}
              accessibilityRole="button"
              accessibilityLabel="Sumar"
            >
              <Text style={styles.stepperText}>+</Text>
            </Pressable>
          </View>
        </View>

        <Button
          label={outOfStock ? 'Sin existencias' : 'Agregar al carrito'}
          onPress={handleAddToCart}
          disabled={outOfStock}
        />

        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Resenas ({product.reviews?.length || 0})</Text>
          {product.reviews?.length ? (
            product.reviews.map((r, i) => <ReviewItem key={r._id || i} review={r} />)
          ) : (
            <Text style={styles.noReviews}>Este producto todavia no tiene resenas.</Text>
          )}

          {isAuthenticated && (
            <View style={styles.reviewForm}>
              <Text style={styles.reviewFormTitle}>Dejar una resena</Text>
              <View style={styles.starPicker}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Pressable key={n} onPress={() => setReviewRating(n)} hitSlop={6}>
                    <Star size={22} color={COLORS.text} fill={n <= reviewRating ? COLORS.text : 'none'} />
                  </Pressable>
                ))}
              </View>
              {!!reviewNotice && <Text style={styles.reviewNotice}>{reviewNotice}</Text>}
              <Button
                label="Enviar resena"
                onPress={submitReview}
                loading={submittingReview}
                variant="outline"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
  },
  body: {
    padding: 20,
    paddingBottom: 48,
  },
  imageFrame: {
    backgroundColor: COLORS.background,
    height: 240,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 4,
  },
  stock: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    marginBottom: 14,
  },
  description: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 21,
    marginBottom: 8,
  },
  variantGroup: {
    marginTop: 18,
  },
  variantLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textMuted,
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 7,
  },
  pillActive: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  pillTextActive: {
    color: COLORS.background,
  },
  swatchDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  swatchDotBorder: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  variantErrorText: {
    color: COLORS.error,
    fontSize: 12.5,
    marginTop: 10,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  stepperButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  stepperValue: {
    minWidth: 28,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  reviewsSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  noReviews: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  reviewForm: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  reviewFormTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  starPicker: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  reviewNotice: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    marginBottom: 10,
  },
});

export default ProductDetailsScreen;
