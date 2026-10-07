/*
 * HOME SCREEN — catalogo: banners, categorias y grilla de productos, todo
 * desde datos reales de backendST (GET /banners, /categories, /products).
 * Version movil de frontend/src/screens/web/HomeScreen.jsx.
 *
 * Pensada como catalogo de archivo/boutique: una sola foto de portada a la
 * vez (con puntos de pagina, no una fila de recortes a medias), tipografia
 * editorial y una grilla de fichas sin botones — se entra al detalle para
 * comprar, la portada es para mirar.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Menu, Search, ShoppingCart, X } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { fetchProducts } from '../api/productApi';
import { fetchCategories } from '../api/categoryApi';
import { fetchBanners } from '../api/bannerApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import ProductCard from '../components/ui/ProductCard';
import LoadingIndicator from '../components/ui/LoadingIndicator';
import CategorySidebar from '../components/ui/CategorySidebar';

const SIDE_PADDING = 20;

const BannerCarousel = ({ banners, pageWidth }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onMomentumScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
    setActiveIndex(index);
  };

  if (banners.length === 0) return null;

  return (
    <View style={styles.bannerSection}>
      <FlatList
        data={banners}
        keyExtractor={(item) => item._id}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        snapToInterval={pageWidth}
        contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.image }}
            style={[styles.banner, { width: pageWidth - SIDE_PADDING * 2 }]}
            contentFit="cover"
          />
        )}
      />

      {banners.length > 1 && (
        <View style={styles.dots}>
          {banners.map((item, i) => (
            <View key={item._id} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
};

const HomeScreen = ({ onOpenProduct, onOpenCart }) => {
  const { top } = useSafeAreaInsets();
  const { itemCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { width } = useWindowDimensions();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadCatalog = useCallback(async () => {
    try {
      setError('');
      const [productsData, categoriesData, bannersData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchBanners(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setBanners(bannersData);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el catalogo');
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadCatalog();
      setLoading(false);
    })();
  }, [loadCatalog]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCatalog();
    setRefreshing(false);
  }, [loadCatalog]);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (selectedCategory) {
      list = list.filter((p) => (p.category?._id || p.category) === selectedCategory);
    }
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.product_name?.toLowerCase().includes(term) ||
          p.category?.name?.toLowerCase().includes(term)
      );
    }
    return list;
  }, [products, selectedCategory, search]);

  const activeCategory = useMemo(
    () => categories.find((c) => c._id === selectedCategory) || null,
    [categories, selectedCategory]
  );

  if (loading) return <LoadingIndicator label="Cargando catalogo..." />;

  return (
    <View style={[styles.screen, { paddingTop: top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => setSidebarOpen(true)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Ver categorias"
        >
          <Menu size={22} color={COLORS.text} strokeWidth={1.75} />
        </Pressable>

        <Text style={styles.brand}>STREET FLEX</Text>

        <Pressable onPress={onOpenCart} accessibilityRole="button" accessibilityLabel="Ver carrito" style={styles.cartButton}>
          <ShoppingCart size={21} color={COLORS.text} strokeWidth={1.75} />
          {itemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <CategorySidebar
        visible={sidebarOpen}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={(id) => {
          setSelectedCategory(id);
          setSidebarOpen(false);
        }}
        onClose={() => setSidebarOpen(false)}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.text} />}
        ListHeaderComponent={
          <View>
            {isAuthenticated && !!user?.full_name && (
              <View style={styles.welcome}>
                <Text style={styles.welcomeLabel}>BIENVENIDO DE NUEVO</Text>
                <Text style={styles.welcomeName} numberOfLines={1}>
                  Hola, {user.full_name}
                </Text>
              </View>
            )}

            <BannerCarousel banners={banners} pageWidth={width} />

            <View style={styles.searchWrapper}>
              <Search size={15} color={COLORS.placeholder} strokeWidth={1.75} style={styles.searchIcon} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar en el archivo"
                placeholderTextColor={COLORS.placeholder}
                style={styles.searchInput}
              />
            </View>

            {!!error && <Text style={styles.errorText}>{error}</Text>}

            {activeCategory && (
              <Pressable onPress={() => setSelectedCategory(null)} style={styles.activeFilter}>
                <Text style={styles.activeFilterText}>{activeCategory.name.toUpperCase()}</Text>
                <X size={13} color={COLORS.background} strokeWidth={2.5} />
              </Pressable>
            )}

            {filteredProducts.length > 0 && <Text style={styles.sectionLabel}>PIEZAS DISPONIBLES</Text>}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <ProductCard product={item} onPress={() => onOpenProduct(item._id)} />
          </View>
        )}
        ListEmptyComponent={
          !error ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No hay piezas que coincidan con la busqueda.</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIDE_PADDING,
    paddingVertical: 16,
  },
  brand: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: COLORS.text,
  },
  cartButton: {
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: COLORS.text,
    borderRadius: 8,
    minWidth: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.background,
    fontSize: 8.5,
    fontWeight: '700',
  },
  welcome: {
    paddingHorizontal: SIDE_PADDING,
    marginBottom: 18,
  },
  welcomeLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  bannerSection: {
    marginBottom: 26,
  },
  banner: {
    aspectRatio: 1.4,
    borderRadius: 2,
    backgroundColor: COLORS.background,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: 12,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.text,
    width: 14,
  },
  searchWrapper: {
    marginHorizontal: SIDE_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: COLORS.text,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.text,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginHorizontal: SIDE_PADDING,
    marginTop: 18,
  },
  activeFilterText: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginHorizontal: SIDE_PADDING,
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.textMuted,
    marginHorizontal: SIDE_PADDING,
    marginTop: 28,
    marginBottom: 4,
  },
  row: {
    gap: 20,
    paddingHorizontal: SIDE_PADDING,
  },
  listContent: {
    paddingBottom: 32,
  },
  cell: {
    flex: 1,
    marginTop: 24,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
});

export default HomeScreen;
