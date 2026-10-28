export const formatPrice = (amount) =>
  "₹" + Number(amount).toLocaleString("en-IN");

export const formatKm = (km) => Number(km).toLocaleString("en-IN") + " km";