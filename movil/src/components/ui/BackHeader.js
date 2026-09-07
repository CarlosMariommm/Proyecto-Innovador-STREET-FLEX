/*
 * BACK HEADER — barra superior con boton de volver, usada en las pantallas
 * del Stack que van con `headerShown: false` (ver RootNavigator) para poder
 * controlar su estilo igual que el resto de la app.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';

const BackHeader = ({ title, onBack, right = null }) => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top + 10 }]}>
      <Pressable onPress={onBack} hitSlop={10} accessibilityRole="button" accessibilityLabel="Volver" style={styles.back}>
        <ChevronLeft size={24} color={COLORS.text} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  back: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  right: {
    width: 36,
    alignItems: 'flex-end',
  },
});

export default BackHeader;
