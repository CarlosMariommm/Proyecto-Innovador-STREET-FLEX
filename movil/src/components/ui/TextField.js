/*
 * TEXTFIELD — input reutilizable con etiqueta, icono opcional a la izquierda,
 * ojo para mostrar/ocultar contrasena, y mensaje de error debajo. Se escribe
 * una sola vez aqui en vez de repetirlo en Login, Register y Checkout.
 */

import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';

const TextField = ({ label, icon: Icon, error, value, onChangeText, placeholder, isPassword = false, ...props }) => {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  const borderColor = error ? COLORS.error : focused ? COLORS.text : COLORS.border;

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={styles.wrapper}>
        {Icon && (
          <View style={styles.icon} pointerEvents="none">
            <Icon size={18} color={COLORS.placeholder} />
          </View>
        )}

        <TextInput
          style={[
            styles.field,
            { borderColor },
            !!Icon && styles.fieldWithIcon,
            isPassword && styles.fieldWithEye,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          secureTextEntry={isPassword && !visible}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />

        {isPassword && (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            style={styles.eye}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar contrasena' : 'Mostrar contrasena'}
          >
            {visible ? <EyeOff size={17} color={COLORS.placeholder} /> : <Eye size={17} color={COLORS.placeholder} />}
          </Pressable>
        )}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  wrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    left: 14,
    zIndex: 2,
    elevation: 2,
  },
  field: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderRadius: 6,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  fieldWithIcon: {
    paddingLeft: 44,
  },
  fieldWithEye: {
    paddingRight: 44,
  },
  eye: {
    position: 'absolute',
    right: 14,
    zIndex: 3,
    elevation: 3,
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 5,
  },
});

export default TextField;
