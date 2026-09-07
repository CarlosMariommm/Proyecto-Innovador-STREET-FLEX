import { StyleSheet, Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { COLORS } from '../../theme/colors';

const RatingStars = ({ rating = 0, size = 14, showValue = true }) => {
  const rounded = Math.round(Number(rating) || 0);

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          color={COLORS.text}
          fill={n <= rounded ? COLORS.text : 'none'}
        />
      ))}
      {showValue && <Text style={styles.value}>{Number(rating || 0).toFixed(1)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  value: {
    marginLeft: 6,
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});

export default RatingStars;
