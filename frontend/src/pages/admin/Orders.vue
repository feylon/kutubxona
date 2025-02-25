<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { ordersApi } from "../../api/index.js";
import { useToastStore } from "../../stores/toast.js";
import { formatMoney, formatDateTime } from "../../utils/format.js";
import BookCover from "../../components/BookCover.vue";
import StatusBadge from "../../components/StatusBadge.vue";
import Pagination from "../../components/Pagination.vue";
import EmptyState from "../../components/EmptyState.vue";

const toast = useToastStore();
const filters = reactive({ status: "pending", search: "", page: 1 });
const result = ref({ items: [], total: 0, page: 1, pages: 1 });
const loading = ref(false);
const busyId = ref(null);

const load = async () => {
  loading.value = true;
  try {
    result.value = await ordersApi.list({ ...filters, limit: 15 });
  } finally {
    loading.value = false;
  }
};
let timer;
watch(() => filters.search, () => { clearTimeout(timer); timer = setTimeout(() => { filters.page = 1; load(); }, 300); });
watch(() => filters.status, () => { filters.page = 1; load(); });
onMounted(load);

const setStatus = async (o, status) => {
  busyId.value = o.id;
  try {
    const updated = await ordersApi.setStatus(o.id, status);
    Object.assign(o, updated);
    toast.success(status === "accepted" ? "Buyurtma qabul qilindi" : status === "rejected" ? "Buyurtma rad etildi" : "Holat yangilandi");
    if (filters.status && filters.status !== status) load();
  } catch (e) {
    toast.error(e.message);
  } finally {
    busyId.value = null;
  }
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="flex gap-1 rounded-full bg-paper-2 p-1">
        <button v-for="(l, k) in { pending: 'Kutilmoqda', accepted: 'Qabul qilingan', rejected: 'Rad etilgan', '': 'Barchasi' }" :key="k" class="rounded-full px-3.5 py-1.5 text-xs font-semibold transition" :class="filters.status === k ? 'bg-ink text-paper shadow' : 'text-ink-3 hover:text-ink'" @click="filters.status = k">{{ l }}</button>
      </div>
      <input v-model="filters.search" type="search" class="input sm:max-w-xs" placeholder="Kitob yoki foydalanuvchi…" />
      <span class="text-sm text-muted">{{ result.total }} ta</span>
    </div>

    <div class="card overflow-hidden">
      <table class="w-full text-sm">
        <thead class="border-b border-line bg-paper-2/50">
          <tr>
            <th class="table-head px-4 py-3">Kitob</th>
            <th class="table-head hidden px-4 py-3 md:table-cell">Buyurtmachi</th>
            <th class="table-head px-4 py-3">Soni</th>
            <th class="table-head hidden px-4 py-3 lg:table-cell">Summa</th>
            <th class="table-head hidden px-4 py-3 lg:table-cell">Sana</th>
            <th class="table-head px-4 py-3">Holat</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody class="divide-y divide-line" :class="loading && 'opacity-50'">
          <tr v-for="o in result.items" :key="o.id" class="transition hover:bg-white/60">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-9 shrink-0"><BookCover :book="o.book" size="sm" /></div>
                <div class="min-w-0">
                  <p class="truncate font-semibold">{{ o.book.title }}</p>
                  <p class="truncate text-xs text-muted">Omborda: {{ o.book.amount }}<span v-if="o.note"> · 💬 {{ o.note }}</span></p>
                </div>
              </div>
            </td>
            <td class="hidden px-4 py-3 md:table-cell">
              <p class="font-semibold">{{ o.user.fullname }}</p>
              <p class="text-xs text-muted">@{{ o.user.username }}</p>
            </td>
            <td class="px-4 py-3 font-semibold">{{ o.amount }}</td>
            <td class="hidden px-4 py-3 lg:table-cell">{{ formatMoney(o.amount * o.book.price) }}</td>
            <td class="hidden px-4 py-3 text-xs text-muted lg:table-cell">{{ formatDateTime(o.createdAt) }}</td>
            <td class="px-4 py-3"><StatusBadge :status="o.status" /></td>
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <template v-if="o.status === 'pending'">
                <button class="btn-sm btn bg-emerald-600 text-white hover:bg-emerald-700" :disabled="busyId === o.id || o.book.amount < o.amount" :title="o.book.amount < o.amount ? 'Omborda yetarli emas' : ''" @click="setStatus(o, 'accepted')">Qabul</button>
                <button class="btn-ghost btn-sm text-red-700 hover:bg-red-50" :disabled="busyId === o.id" @click="setStatus(o, 'rejected')">Rad</button>
              </template>
              <button v-else class="btn-ghost btn-sm" :disabled="busyId === o.id" @click="setStatus(o, 'pending')">Qaytarish</button>
            </td>
          </tr>
        </tbody>
      </table>
      <EmptyState v-if="!loading && !result.items.length" class="m-4" icon="🧾" title="Buyurtmalar yo'q" />
    </div>
    <Pagination :page="result.page" :pages="result.pages" @change="(p) => { filters.page = p; load(); }" />
  </div>
</template>
