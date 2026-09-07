/*
 * BUTTON — el mismo boton negro solido en toda la app: ancho completo,
 * esquinas rectas (a tono con el estilo minimalista del Header web), y una
 * rueda de carga en vez de apagarse sin avisar nada.
 */

import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';

const Button = ({ label, onPress, loading = false, disabled = false, icon = null, variant = 'primary', style }) => {
  const inactive = loading || disabled;
  const outlined = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        outlined && styles.outlineButton,
        pressed && !inactive && (outlined ? styles.outlinePressed : styles.pressed),
        inactive && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={outlined ? COLORS.text : '#FFFFFF'} />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.label, outlined && styles.outlineLabel]}>{label}</Text>
          {icon}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: COLORS.text,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.text,
  },
  pressed: {
    backgroundColor: COLORS.accent,
  },
  outlinePressed: {
    backgroundColor: COLORS.secondary,
  },
  disabled: {
    opacity: 0.4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  outlineLabel: {
    color: COLORS.text,
  },
});

export default Button;
