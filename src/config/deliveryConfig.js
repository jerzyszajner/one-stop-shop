// Delivery methods configuration
export const DELIVERY_OPTIONS = {
  standard: {
    name: "Standard Delivery",
    time: "3-5 business days",
    price: 0,
    description: "Free shipping without tracking, only for orders over $50",
  },
  express: {
    name: "Express Delivery",
    time: "1-2 business days",
    price: 9,
    description: "Priority handling with tracking",
  },
  premium: {
    name: "Premium Delivery",
    time: "Same day delivery (order by 10:00 CET)",
    price: 19,
    description: "Guaranteed same-day delivery with tracking",
  },
};

// Initial delivery data for delivery context
export const initialDeliveryData = {
  selectedOption: null,
  deliveryPrice: 0,
  messageOptional: "",
  isAlternativeAddress: false,
  // Standard address (from user profile)
  standardAddress: {
    firstname: "",
    lastname: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    phone: "",
  },
  // Alternative address (from modal form)
  alternativeAddress: {
    firstname: "",
    lastname: "",
    street: "",
    zipCode: "",
    city: "",
    country: "",
    phone: "",
  },
};
