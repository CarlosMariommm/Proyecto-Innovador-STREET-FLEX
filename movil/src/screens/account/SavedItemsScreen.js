import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Heart } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { fetchFavorites } from '../../api/clientApi';
import ProductCard from '../../components/ui/ProductCard';
import LoadingIndicator from '../../components/ui/LoadingIndicator';

const SavedItemsScreen = ({ onOpenProduct }) => {
  const { top } = useSafeAreaInsets();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchFavorites();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar tus favoritos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Se vuelve a pedir cada vez que este apartado gana foco, no solo la
  // primera vez: los tabs de abajo no desmontan sus pantallas al cambiar de
  // apartado, asi que marcar un favorito y venir aca mostraba lo viejo hasta
  // reabrir la app entera.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) return <LoadingIndicator label="Cargando favoritos..." />;

  return (
    <View style={[styles.screen, { paddingTop: top }]}>
      <Text style={styles.title}>Favoritos</Text>

      {!!error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={favorites}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <ProductCard product={item} onPress={() => onOpenProduct(item._id)} />
          </View>
        )}
        ListEmptyComponent={
          !error ? (
            <View style={styles.empty}>
              <Heart size={40} color={COLORS.placeholder} />
              <Text style={styles.emptyText}>Todavia no guardaste productos.</Text>
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
  row: {
    gap: 20,
    paddingHorizontal: 20,
  },
  list: {
    paddingBottom: 24,
  },
  cell: {
    flex: 1,
    marginBottom: 24,
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

export default SavedItemsScreen;
