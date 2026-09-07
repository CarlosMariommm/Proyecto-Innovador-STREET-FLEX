import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import RatingStars from './RatingStars';

const ReviewItem = ({ review }) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.author}>{review.id_client?.full_name || 'Cliente'}</Text>
      <RatingStars rating={review.rating} size={12} showValue={false} />
    </View>
    {!!review.comment && <Text style={styles.comment}>{review.comment}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  comment: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
});

export default ReviewItem;
