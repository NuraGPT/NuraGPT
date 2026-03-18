export const NURA_PLUS = {
  price_id: import.meta.env.VITE_STRIPE_PRICE_ID_PLUS || "price_REPLACE_WITH_YOUR_PRICE_ID",
  name: "Nura Plus",
  price: 15,
  currency: "eur",
  interval: "month" as const,
  benefits: [
    "Supervisión profesional semanal",
    "Mayor cobertura y prioridad",
    "Historial y reportes avanzados",
  ],
};

