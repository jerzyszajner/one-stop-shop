// Countries configuration
export const COUNTRIES = {
  norway: {
    name: "Norway",
  },
  sweden: {
    name: "Sweden",
  },
  denmark: {
    name: "Denmark",
  },
};

export const getCountryOptions = () => {
  return Object.values(COUNTRIES).map((country) => ({
    value: country.name,
    label: country.name,
  }));
};
