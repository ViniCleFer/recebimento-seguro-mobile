export const formatCurrency = (value: number) => {
  if (!value) {
    return 'R$ 0,00';
  }

  const currency = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return currency;
};
