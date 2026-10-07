/*
 * FORGOT PASSWORD — primer paso de la recuperacion: se pide el correo y el
 * servidor manda un codigo de 6 digitos (POST /clients/forgot-password). El
 * segundo paso es ResetPasswordScreen, donde se escribe el codigo junto con la
 * contrasena nueva.
 */

import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { KeyRound, Mail } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { requestPasswordReset } from '../api/authApi';
import { validateEmail } from '../utils/validations';
import BackHeader from '../components/ui/BackHeader';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';

const ForgotPasswordScreen = ({ onBack, onCodeSent }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (text) => {
    setEmail(text);
    if (error) setError('');
  };

  const handleSubmit = async () => {
    const invalid = validateEmail(email);
    if (invalid) {
      setError(invalid);
      return;
    }

    try {
      setLoading(true);
      setError('');
      await requestPasswordReset(email.trim());
      onCodeSent(email.trim());
    } catch (err) {
      setError(err.message || 'No se pudo enviar el codigo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <BackHeader title="Recuperar contrasena" onBack={onBack} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <KeyRound size={44} color={COLORS.text} style={styles.icon} />
          <Text style={styles.title}>Olvidaste tu contrasena?</Text>
          <Text style={styles.text}>
            Escribe el correo de tu cuenta y te enviaremos un codigo de 6 digitos para crear una contrasena nueva.
          </Text>

          <TextField
            label="Correo electronico"
            icon={Mail}
            placeholder="juan@ejemplo.com"
            value={email}
            onChangeText={handleChange}
            error={error}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Button label="Enviar codigo" onPress={handleSubmit} loading={loading} />
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
    paddingTop: 40,
    paddingBottom: 48,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
});

export default ForgotPasswordScreen;
