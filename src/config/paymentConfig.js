// Payment methods configuration
export const PAYMENT_METHODS = {
  visa: {
    name: "Visa",
  },
  mastercard: {
    name: "Mastercard",
  },
};

export const getPaymentMethodOptions = () => {
  return Object.values(PAYMENT_METHODS).map((method) => ({
    value: method.name,
    label: method.name,
  }));
};
