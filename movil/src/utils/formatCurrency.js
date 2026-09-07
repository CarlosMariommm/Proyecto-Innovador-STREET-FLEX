export const formatCurrency = (amount) => {
  const value = Number(amount) || 0;
  return `$${value.toFixed(2)}`;
};

export default formatCurrency;
