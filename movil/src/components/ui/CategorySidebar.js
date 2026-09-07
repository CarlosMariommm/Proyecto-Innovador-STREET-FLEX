/*
 * CATEGORY SIDEBAR — unico lugar de la app donde se navega por categoria (ya
 * no hay fila de chips en Home, ver HomeScreen.js). Cada categoria se ve como
 * encabezado con sus subcategorias anidadas debajo, calcado del sidebar de la
 * maqueta de Figma (WOMEN/MEN > NEW COLLECTION/BEST SELLERS/ESSENTIALS >
 * JEANS/T-SHIRT/...).
 *
 * Los productos solo tienen categoria (no subcategoria todavia), asi que
 * tocar una subcategoria filtra por la categoria a la que pertenece — son
 * renglones de navegacion, no una dimension nueva de filtrado.
 *
 * Una View absoluta y no <Modal>: el Modal de React Native Web no dibuja un
 * fondo solido de verdad (se ve el resto de la pantalla transparentado por
 * debajo) — una capa absoluta normal se ve igual en web y en nativo.
 */

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

const CategorySidebar = ({ visible, categories, selectedCategory, onSelect, onClose }) => {
  const { top, bottom } = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.panel, { paddingTop: top + 20, paddingBottom: bottom + 20 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>CATEGORIAS</Text>
          <Pressable onPress={onClose} hitSlop={10} accessibilityRole="button" accessibilityLabel="Cerrar">
            <X size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => onSelect(null)} style={styles.categoryRow}>
            <Text style={[styles.categoryText, !selectedCategory && styles.textActive]}>TODO</Text>
          </Pressable>

          {categories.map((cat) => {
            const active = selectedCategory === cat._id;
            return (
              <View key={cat._id} style={styles.group}>
                <Pressable onPress={() => onSelect(cat._id)} style={styles.categoryRow}>
                  <Text style={[styles.categoryText, active && styles.textActive]}>{cat.name.toUpperCase()}</Text>
                </Pressable>

                {(cat.subcategories || []).map((sub) => (
                  <Pressable key={sub} onPress={() => onSelect(cat._id)} style={styles.subRow}>
                    <Text style={styles.subText}>{sub}</Text>
                  </Pressable>
                ))}
              </View>
            );
          })}
        </ScrollView>
      </View>

      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Cerrar menu" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 50,
    elevation: 50,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  panel: {
    width: '78%',
    maxWidth: 320,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
  },
  group: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.14)',
    paddingBottom: 6,
  },
  categoryRow: {
    paddingVertical: 13,
  },
  categoryText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subRow: {
    paddingVertical: 9,
    paddingLeft: 14,
  },
  subText: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 14,
    fontWeight: '500',
  },
  textActive: {
    color: '#FFFFFF',
  },
});

export default CategorySidebar;
