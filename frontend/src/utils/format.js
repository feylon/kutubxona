const MONTHS = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];
const pad = (n) => String(n).padStart(2, "0");
const money = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

export const formatMoney = (value) => `${money.format(Number(value) || 0).replace(/ /g, " ")} so'm`;

export const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return `${d.getDate()}-${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return `${d.getDate()}-${MONTHS[d.getMonth()]} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const ORDER_LABELS = {
  pending: { text: "Kutilmoqda", cls: "bg-amber-100 text-amber-800 ring-amber-200" },
  accepted: { text: "Qabul qilindi", cls: "bg-emerald-100 text-emerald-800 ring-emerald-200" },
  rejected: { text: "Rad etildi", cls: "bg-red-100 text-red-800 ring-red-200" },
};

export const ROLE_LABELS = { user: "O'quvchi", admin: "Admin", superadmin: "Superadmin" };
