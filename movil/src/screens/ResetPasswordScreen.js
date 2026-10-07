/*
 * RESET PASSWORD — segundo paso de la recuperacion: el codigo que llego al
 * correo mas la contrasena nueva (POST /clients/reset-password-code). Al
 * terminar manda a Login con la contrasena ya cambiada.
 */

import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Lock, MailCheck } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { requestPasswordReset, resetPasswordWithCode } from '../api/authApi';
import {
  hasNoErrors,
  validateForm,
  validatePassword,
  validateVerificationCode,
} from '../utils/validations';
import BackHeader from '../components/ui/BackHeader';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';

const RESEND_COOLDOWN = 30;

const ResetPasswordScreen = ({ email, onBack, onDone }) => {
  const [values, setValues] = useState({ code: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleChange = (field) => (text) => {
    const value = field === 'code' ? text.replace(/[^0-9]/g, '').slice(0, 6) : text;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async () => {
    const found = validateForm(values, {
      code: validateVerificationCode,
      password: validatePassword,
      confirmPassword: (v) => (v === values.password ? null : 'Las contrasenas no coinciden'),
    });
    setErrors(found);
    if (!hasNoErrors(found)) return;

    try {
      setLoading(true);
      setServerError('');
      await resetPasswordWithCode({ email, code: values.code, password: values.password });
      onDone();
    } catch (err) {
      setServerError(err.message || 'No se pudo cambiar la contrasena');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setServerError('');
      setNotice('');
      await requestPasswordReset(email);
      setNotice('Te enviamos un nuevo codigo.');
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setServerError(err.message || 'No se pudo reenviar el codigo');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.screen}>
      <BackHeader title="Nueva contrasena" onBack={onBack} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <MailCheck size={44} color={COLORS.text} style={styles.icon} />
          <Text style={styles.text}>
            Enviamos un codigo de 6 digitos a{'\n'}
            <Text style={styles.email}>{email}</Text>
          </Text>

          <TextField
            label="Codigo"
            placeholder="000000"
            value={values.code}
            onChangeText={handleChange('code')}
            error={errors.code}
            keyboardType="number-pad"
            maxLength={6}
          />

          <TextField
            label="Contrasena nueva"
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

          {!!notice && <Text style={styles.notice}>{notice}</Text>}

          {!!serverError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{serverError}</Text>
            </View>
          )}

          <Button label="Cambiar contrasena" onPress={handleSubmit} loading={loading} />

          <Pressable onPress={handleResend} disabled={resending || cooldown > 0} hitSlop={8} style={styles.resend}>
            <Text style={[styles.resendText, (resending || cooldown > 0) && styles.resendDisabled]}>
              {cooldown > 0 ? `Reenviar codigo (${cooldown}s)` : resending ? 'Enviando...' : 'Reenviar codigo'}
            </Text>
          </Pressable>
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
    paddingTop: 32,
    paddingBottom: 48,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 14,
  },
  text: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 26,
  },
  email: {
    fontWeight: '700',
    color: COLORS.text,
  },
  notice: {
    fontSize: 12.5,
    color: COLORS.success,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: COLORS.errorBg,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    lineHeight: 19,
  },
  resend: {
    alignSelf: 'center',
    marginTop: 18,
  },
  resendText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  resendDisabled: {
    color: COLORS.placeholder,
  },
});

export default ResetPasswordScreen;
