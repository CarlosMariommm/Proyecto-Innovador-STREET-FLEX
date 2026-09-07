import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mail, Phone, User } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

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
  const { user, logout } = useAuth();

  return (
    <View style={[styles.screen, { paddingTop: top }]}>
      <Text style={styles.title}>Mi cuenta</Text>

      <View style={styles.card}>
        <InfoRow icon={User} label="Nombre completo" value={user?.full_name} />
        <InfoRow icon={User} label="Usuario" value={user?.username} />
        <InfoRow icon={Mail} label="Correo" value={user?.email} />
        <InfoRow icon={Phone} label="Telefono" value={user?.phone_number} />
      </View>

      <Button label="Cerrar sesion" onPress={logout} variant="outline" style={styles.logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 20,
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
  logout: {
    marginTop: 24,
  },
});

export default AccountInformationScreen;
