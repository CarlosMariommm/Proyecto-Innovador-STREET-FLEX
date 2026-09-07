/*
 * VERIFY CODE — el backend manda un codigo de 6 digitos por correo
 * (POST /clients/resend-code lo reenvia si hace falta) ademas del link que
 * usa la web; esta pantalla es la que lo pide para activar la cuenta. Al
 * verificar, el backend ya deja la sesion iniciada (devuelve token), asi que
 * no hay que volver a pedir correo/contrasena.
 */

import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MailCheck } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { verifyRegistrationCode, resendVerificationCode } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';

const RESEND_COOLDOWN = 30;

const VerifyCodeScreen = ({ email, sendOnMount = false, onGoToLogin }) => {
  const { login } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  // Quien llega aca desde Login (cuenta sin verificar) no tiene un codigo
  // vigente a mano, asi que se le manda uno nuevo apenas entra. Quien llega
  // recien registrado ya tiene el que mando createClient — no hace falta
  // gastar otro de una vez.
  useEffect(() => {
    if (sendOnMount) handleResend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeCode = (text) => {
    setCode(text.replace(/[^0-9]/g, '').slice(0, 6));
    if (error) setError('');
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('El codigo tiene 6 digitos');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await verifyRegistrationCode({ email, code });
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
      setError(err.message || 'No se pudo verificar el codigo');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError('');
      setNotice('');
      await resendVerificationCode(email);
      setNotice('Te enviamos un nuevo codigo.');
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err.message || 'No se pudo reenviar el codigo');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <MailCheck size={48} color={COLORS.text} style={styles.icon} />
          <Text style={styles.title}>Verifica tu correo</Text>
          <Text style={styles.text}>
            Enviamos un codigo de 6 digitos a{'\n'}
            <Text style={styles.email}>{email}</Text>
          </Text>

          <TextField
            label="Codigo de verificacion"
            placeholder="000000"
            value={code}
            onChangeText={handleChangeCode}
            error={error}
            keyboardType="number-pad"
            maxLength={6}
          />

          {!!notice && <Text style={styles.notice}>{notice}</Text>}

          <Button label="Verificar" onPress={handleVerify} loading={loading} />

          <Pressable onPress={handleResend} disabled={resending || cooldown > 0} hitSlop={8} style={styles.resend}>
            <Text style={[styles.resendText, (resending || cooldown > 0) && styles.resendDisabled]}>
              {cooldown > 0 ? `Reenviar codigo (${cooldown}s)` : resending ? 'Enviando...' : 'Reenviar codigo'}
            </Text>
          </Pressable>

          <Text style={styles.footer}>
            Ya verificaste?{' '}
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
    paddingTop: 64,
    paddingBottom: 48,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
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
  resend: {
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
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 32,
  },
  footerLink: {
    color: COLORS.text,
    fontWeight: '700',
  },
});

export default VerifyCodeScreen;
