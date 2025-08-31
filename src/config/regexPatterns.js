// Validation regex patterns for form validation

// Basic user information
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,}$/; // Min 8 chars: 1 digit, 1 lower, 1 upper, 1 special
export const phoneRegex = /^[0-9]{8}$/; // Norwegian format

// Address information (Norwegian)
export const cityRegex = /^[a-zA-ZæøåÆØÅ\s]+$/; // Norwegian characters allowed
export const streetRegex = /^[a-zA-ZæøåÆØÅ\s]+\s\d+[a-zA-ZæøåÆØÅ]*$/; // "Storgata 1A"
export const zipCodeRegex = /^\d{4}$/; // Norwegian postal code

// Payment information
export const cardRegex = /^[0-9]{16}$/;
export const cvvRegex = /^[0-9]{3}$/;

// Order management
export const orderNumberRegex = /^[A-Z0-9]{6,12}$/; // 6-12 alphanumeric
