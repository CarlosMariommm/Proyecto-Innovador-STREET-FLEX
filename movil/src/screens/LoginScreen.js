import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock, Mail, X } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { loginClient } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validateForm, hasNoErrors } from '../utils/validations';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';

const LoginScreen = ({ onGoToRegister, onNeedsVerification, onSkip }) => {
  const { login } = useAuth();
  const { top } = useSafeAreaInsets();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (text) => {
    setValues((v) => ({ ...v, [field]: text }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async () => {
    const found = validateForm(values, {
      email: validateEmail,
      password: (v) => (v ? null : 'La contrasena es requerida'),
    });
    setErrors(found);
    if (!hasNoErrors(found)) return;

    try {
      setLoading(true);
      setServerError('');
      const res = await loginClient({ email: values.email.trim(), password: values.password });
      login(res.token, {
        _id: res._id,
        username: res.username,
        email: res.email,
        full_name: res.full_name,
        phone_number: res.phone_number,
        favorites: res.favorites || [],
        image: res.image,
      });
    } catch (err) {
      // Cuenta creada pero nunca verificada: en vez de dejarlo leyendo el
      // error sin poder hacer nada, se manda directo a poner el codigo.
      if (err.data?.needsVerification) {
        onNeedsVerification(values.email.trim());
        return;
      }
      setServerError(err.message || 'No se pudo iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      {!!onSkip && (
        <Pressable
          onPress={onSkip}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Seguir viendo la tienda"
          style={[styles.skip, { top: top + 12 }]}
        >
          <X size={22} color={COLORS.text} />
        </Pressable>
      )}

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.brand}>STREET FLEX</Text>
          <Text style={styles.title}>Inicia sesion</Text>
          <Text style={styles.subtitle}>Puedes seguir viendo la tienda sin cuenta.</Text>

          <TextField
            label="Correo electronico"
            icon={Mail}
            placeholder="juan@ejemplo.com"
            value={values.email}
            onChangeText={handleChange('email')}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextField
            label="Contrasena"
            icon={Lock}
            placeholder="********"
            value={values.password}
            onChangeText={handleChange('password')}
            error={errors.password}
            isPassword
            autoCapitalize="none"
          />

          {!!serverError && (
            <View style={styles.notice}>
              <Text style={styles.noticeText}>{serverError}</Text>
            </View>
          )}

          <Button label="Iniciar sesion" onPress={handleSubmit} loading={loading} />

          <Text style={styles.footer}>
            No tienes una cuenta?{' '}
            <Text style={styles.footerLink} onPress={onGoToRegister}>
              Registrate
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  skip: {
    position: 'absolute',
    right: 16,
    zIndex: 2,
    padding: 6,
  },
  body: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 48,
  },
  brand: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 28,
  },
  notice: {
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  noticeText: {
    color: COLORS.error,
    fontSize: 13,
    lineHeight: 19,
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 24,
  },
  footerLink: {
    color: COLORS.text,
    fontWeight: '700',
  },
});

export default LoginScreen;
