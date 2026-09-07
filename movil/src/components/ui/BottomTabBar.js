/*
 * BOTTOM TAB BAR — los cuatro apartados de la app, con los mismos iconos de
 * lucide que usa el Header web (User, ShoppingCart pasa a ser el carrito de
 * arriba, no una pestana). El apartado activo se marca con el icono relleno
 * en negro y trazo mas grueso; los demas van en gris, sin relleno.
 */

import { useEffect, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Home, Package, User } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';

export const TABS = [
  { key: 'home', icon: Home, label: 'Inicio' },
  { key: 'saved', icon: Heart, label: 'Favoritos' },
  { key: 'orders', icon: Package, label: 'Pedidos' },
  { key: 'account', icon: User, label: 'Cuenta' },
];

// Con el teclado abierto la barra estorba y en Android sube flotando sobre
// el; se oculta en los dos casos mientras se escribe.
const useKeyboardVisible = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const subShow = Keyboard.addListener(showEvent, () => setVisible(true));
    const subHide = Keyboard.addListener(hideEvent, () => setVisible(false));

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  return visible;
};

const BottomTabBar = ({ activeTab, onChange }) => {
  const { bottom } = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();

  if (keyboardVisible) return null;

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(bottom, 10) }]}>
      {TABS.map(({ key, icon: Icon, label }) => {
        const active = activeTab === key;

        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={label}
            style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
          >
            <Icon
              size={24}
              color={active ? COLORS.text : COLORS.textMuted}
              strokeWidth={active ? 2.4 : 1.8}
              fill={active ? COLORS.text : 'none'}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPressed: {
    backgroundColor: COLORS.secondary,
  },
});

export default BottomTabBar;
