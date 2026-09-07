import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';

const LoadingIndicator = ({ label = 'Cargando...' }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={COLORS.text} />
    {label ? <Text style={styles.label}>{label}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});

export default LoadingIndicator;
