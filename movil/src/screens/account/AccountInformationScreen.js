/*
 * ACCOUNT INFORMATION — datos del cliente con sesion iniciada, y su edicion.
 *
 * Se puede cambiar nombre, usuario, telefono y edad. El correo se muestra pero
 * no se edita aqui: es con lo que se inicia sesion y se verifica la cuenta.
 * Al guardar, la respuesta del servidor reemplaza la sesion guardada
 * (updateUser), asi el nombre nuevo se ve de inmediato en Home y en esta
 * pantalla, sin cerrar sesion.
 */

import { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, Mail, Phone, User } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { updateClientProfile } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import {
  hasNoErrors,
  validateAge,
  validateForm,
  validatePhone,
  validateRequired,
} from '../../utils/validations';
import { buildSessionUser } from '../../utils/sessionUser';
import Button from '../../components/ui/Button';
import TextField from '../../components/ui/TextField';

const toFormValues = (user) => ({
  full_name: user?.full_name || '',
  username: user?.username || '',
  phone_number: user?.phone_number || '',
  age: user?.age ? String(user.age) : '',
});

const InfoRow = ({ icon: Icon, label, value }) => (
  <View style={styles.row}>
    <Icon size={18} color={COLORS.textMuted} />
    <View style={styles.rowText}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || '-'}</Text>
    </View>
  </View>
);

const AccountInformationScreen = () => {
  const { top } = useSafeAreaInsets();
  const { user, logout, updateUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState(toFormValues(user));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  // Si la sesion cambia desde afuera (otra cuenta, o un guardado), el
  // formulario no se queda con valores de la persona anterior.
  useEffect(() => {
    if (!editing) setValues(toFormValues(user));
  }, [user, editing]);

  const handleChange = (field) => (text) => {
    setValues((v) => ({ ...v, [field]: text }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
    if (serverError) setServerError('');
  };

  const startEditing = useCallback(() => {
    setValues(toFormValues(user));
    setErrors({});
    setServerError('');
    setNotice('');
    setEditing(true);
  }, [user]);

  const cancelEditing = () => {
    setEditing(false);
    setErrors({});
    setServerError('');
  };

  const handleSave = async () => {
    const found = validateForm(values, {
      full_name: validateRequired('El nombre completo'),
      username: validateRequired('El usuario'),
      phone_number: validatePhone,
      age: validateAge,
    });
    setErrors(found);
    if (!hasNoErrors(found)) return;

    try {
      setSaving(true);
      setServerError('');
      const updated = await updateClientProfile({
        full_name: values.full_name.trim(),
        username: values.username.trim(),
        phone_number: values.phone_number.trim(),
        age: values.age.trim(),
      });
      updateUser(buildSessionUser(updated));
      setEditing(false);
      setNotice('Tus datos se guardaron.');
    } catch (err) {
      setServerError(err.message || 'No se pudieron guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: top }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.greeting}>Hola, {user?.full_name?.split(' ')[0] || 'bienvenido'}</Text>
          <Text style={styles.title}>Mi cuenta</Text>

          {!!notice && !editing && <Text style={styles.notice}>{notice}</Text>}

          {editing ? (
            <View>
              <TextField
                label="Nombre completo"
                icon={User}
                value={values.full_name}
                onChangeText={handleChange('full_name')}
                error={errors.full_name}
              />
              <TextField
                label="Usuario"
                icon={User}
                value={values.username}
                onChangeText={handleChange('username')}
                error={errors.username}
                autoCapitalize="none"
              />
              <TextField
                label="Telefono"
                icon={Phone}
                value={values.phone_number}
                onChangeText={handleChange('phone_number')}
                error={errors.phone_number}
                keyboardType="phone-pad"
              />
              <TextField
                label="Edad"
                icon={Calendar}
                value={values.age}
                onChangeText={handleChange('age')}
                error={errors.age}
                keyboardType="number-pad"
                maxLength={3}
              />

              <Text style={styles.hint}>El correo ({user?.email}) no se puede cambiar desde aqui.</Text>

              {!!serverError && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{serverError}</Text>
                </View>
              )}

              <Button label="Guardar cambios" onPress={handleSave} loading={saving} />
              <Button label="Cancelar" onPress={cancelEditing} variant="outline" disabled={saving} style={styles.secondary} />
            </View>
          ) : (
            <View>
              <View style={styles.card}>
                <InfoRow icon={User} label="Nombre completo" value={user?.full_name} />
                <InfoRow icon={User} label="Usuario" value={user?.username} />
                <InfoRow icon={Mail} label="Correo" value={user?.email} />
                <InfoRow icon={Phone} label="Telefono" value={user?.phone_number} />
                <InfoRow icon={Calendar} label="Edad" value={user?.age ? `${user.age} anos` : ''} />
              </View>

              <Button label="Editar perfil" onPress={startEditing} style={styles.secondary} />
              <Button label="Cerrar sesion" onPress={logout} variant="outline" style={styles.secondary} />
            </View>
          )}
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
    padding: 20,
    paddingBottom: 40,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 20,
  },
  notice: {
    fontSize: 13,
    color: COLORS.success,
    marginBottom: 14,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 18,
  },
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
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
  secondary: {
    marginTop: 12,
  },
});

export default AccountInformationScreen;
