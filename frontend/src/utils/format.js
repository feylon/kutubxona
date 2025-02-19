const money = new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat("uz-UZ", { day: "2-digit", month: "short", year: "numeric" });
const dateTime = new Intl.DateTimeFormat("uz-UZ", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export const formatMoney = (value) => `${money.format(Number(value) || 0)} so'm`;
export const formatDate = (value) => (value ? date.format(new Date(value)) : "—");
export const formatDateTime = (value) => (value ? dateTime.format(new Date(value)) : "—");
export const coverSrc = (book) => book?.coverUrl ?? null;

export const ORDER_LABELS = {
  pending: { text: "Kutilmoqda", cls: "bg-amber-100 text-amber-800 ring-amber-200" },
  accepted: { text: "Qabul qilindi", cls: "bg-emerald-100 text-emerald-800 ring-emerald-200" },
  rejected: { text: "Rad etildi", cls: "bg-red-100 text-red-800 ring-red-200" },
};

export const ROLE_LABELS = { user: "O'quvchi", admin: "Admin", superadmin: "Superadmin" };
