// Formats input to contain only digits by removing all non-numeric characters
export const formatDigits = (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
};

// Formats date to be readable
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
