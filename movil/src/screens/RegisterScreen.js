import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Calendar, Lock, Mail, Phone, User } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { registerClient } from '../api/authApi';
import {
  validateAge,
  validateEmail,
  validateForm,
  validatePassword,
  validatePhone,
  validateRequired,
  hasNoErrors,
} from '../utils/validations';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';

const RegisterScreen = ({ onGoToLogin, onRegistered }) => {
  const [values, setValues] = useState({
    full_name: '',
    username: '',
    email: '',
    phone_number: '',
    age: '',
    password: '',
    confirmPassword: '',
  });
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
      full_name: validateRequired('El nombre completo'),
      username: validateRequired('El usuario'),
      email: validateEmail,
      phone_number: validatePhone,
      age: validateAge,
      password: validatePassword,
      confirmPassword: (v) => (v === values.password ? null : 'Las contrasenas no coinciden'),
    });
    setErrors(found);
    if (!hasNoErrors(found)) return;

    try {
      setLoading(true);
      setServerError('');
      await registerClient({
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
        full_name: values.full_name.trim(),
        phone_number: values.phone_number.trim(),
        age: values.age.trim(),
      });
      onRegistered(values.email.trim());
    } catch (err) {
      setServerError(err.message || 'No se pudo crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Crea tu cuenta</Text>
          <Text style={styles.subtitle}>Registrate para comprar y guardar tus pedidos.</Text>

          <TextField
            label="Nombre completo"
            icon={User}
            placeholder="Juan Perez"
            value={values.full_name}
            onChangeText={handleChange('full_name')}
            error={errors.full_name}
          />

          <TextField
            label="Usuario"
            icon={User}
            placeholder="juanperez"
            value={values.username}
            onChangeText={handleChange('username')}
            error={errors.username}
            autoCapitalize="none"
          />

          <TextField
            label="Correo electronico"
            icon={Mail}
            placeholder="juan@ejemplo.com"
            value={values.email}
            onChangeText={handleChange('email')}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextField
            label="Telefono"
            icon={Phone}
            placeholder="7000-0000"
            value={values.phone_number}
            onChangeText={handleChange('phone_number')}
            error={errors.phone_number}
            keyboardType="phone-pad"
          />

          <TextField
            label="Edad"
            icon={Calendar}
            placeholder="18"
            value={values.age}
            onChangeText={handleChange('age')}
            error={errors.age}
            keyboardType="number-pad"
            maxLength={3}
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

          <TextField
            label="Confirmar contrasena"
            icon={Lock}
            placeholder="********"
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            isPassword
            autoCapitalize="none"
          />

          {!!serverError && (
            <View style={styles.notice}>
              <Text style={styles.noticeText}>{serverError}</Text>
            </View>
          )}

          <Button label="Registrarme" onPress={handleSubmit} loading={loading} />

          <Text style={styles.footer}>
            Ya tienes una cuenta?{' '}
            <Text style={styles.footerLink} onPress={onGoToLogin}>
              Inicia sesion
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
  body: {
    padding: 24,
    paddingTop: 48,
    paddingBottom: 48,
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

export default RegisterScreen;
