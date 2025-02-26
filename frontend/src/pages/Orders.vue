<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import { ordersApi } from "../api/index.js";
import { useToastStore } from "../stores/toast.js";
import { formatMoney, formatDateTime } from "../utils/format.js";
import { useReveal } from "../composables/useGsap.js";
import BookCover from "../components/BookCover.vue";
import StatusBadge from "../components/StatusBadge.vue";
import EmptyState from "../components/EmptyState.vue";
import Spinner from "../components/Spinner.vue";

const toast = useToastStore();
const root = ref(null);
const orders = ref([]);
const loading = ref(true);
const filter = ref("all");
const reveal = useReveal(root);

const load = async () => {
  loading.value = true;
  try {
    orders.value = (await ordersApi.my()).items;
    await nextTick();
    reveal.refresh();
  } finally {
    loading.value = false;
  }
};
onMounted(load);

const filtered = computed(() => (filter.value === "all" ? orders.value : orders.value.filter((o) => o.status === filter.value)));
const counts = computed(() => ({
  all: orders.value.length,
  pending: orders.value.filter((o) => o.status === "pending").length,
  accepted: orders.value.filter((o) => o.status === "accepted").length,
  rejected: orders.value.filter((o) => o.status === "rejected").length,
}));

const cancel = async (o) => {
  if (!confirm(`"${o.book.title}" buyurtmasini bekor qilasizmi?`)) return;
  try {
    await ordersApi.cancel(o.id);
    orders.value = orders.value.filter((x) => x.id !== o.id);
    toast.success("Buyurtma bekor qilindi");
  } catch (e) {
    toast.error(e.message);
  }
};
</script>

<template>
  <div ref="root" class="container-x py-10">
    <p class="eyebrow">Shaxsiy kabinet</p>
    <h1 class="mt-1 font-display text-4xl font-semibold">Buyurtmalarim</h1>

    <div class="mt-6 flex flex-wrap gap-2">
      <button v-for="(label, key) in { all: 'Barchasi', pending: 'Kutilmoqda', accepted: 'Qabul qilingan', rejected: 'Rad etilgan' }" :key="key" class="chip" :class="filter === key && 'chip-active'" @click="filter = key">
        {{ label }} <span class="opacity-60">{{ counts[key] }}</span>
      </button>
    </div>

    <Spinner v-if="loading" />
    <EmptyState v-else-if="!filtered.length" class="mt-8" icon="🧾" title="Buyurtmalar yo'q" text="Katalogdan kitob tanlab, buyurtma bering.">
      <router-link :to="{ name: 'books' }" class="btn-primary btn-sm">Katalogga o'tish</router-link>
    </EmptyState>
    <div v-else data-reveal="stagger" class="mt-8 grid gap-4 md:grid-cols-2">
      <article v-for="o in filtered" :key="o.id" class="card flex gap-4 p-4">
        <router-link :to="{ name: 'book', params: { id: o.book.id } }" class="w-20 shrink-0"><BookCover :book="o.book" size="sm" /></router-link>
        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="text-[11px] font-semibold uppercase tracking-wider text-muted">{{ o.book.category?.name }}</p>
              <h3 class="truncate font-display text-lg font-semibold">{{ o.book.title }}</h3>
              <p class="text-xs text-ink-3">{{ o.book.author }}</p>
            </div>
            <StatusBadge :status="o.status" />
          </div>
          <dl class="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div><dt class="text-muted">Soni</dt><dd class="font-semibold">{{ o.amount }} dona</dd></div>
            <div><dt class="text-muted">Summa</dt><dd class="font-semibold">{{ formatMoney(o.amount * o.book.price) }}</dd></div>
            <div><dt class="text-muted">Sana</dt><dd class="font-semibold">{{ formatDateTime(o.createdAt) }}</dd></div>
          </dl>
          <p v-if="o.note" class="mt-2 rounded-lg bg-white/70 px-3 py-1.5 text-xs text-ink-3">💬 {{ o.note }}</p>
          <div class="mt-3 flex gap-2">
            <router-link v-if="o.book.fileUrl !== null" :to="{ name: 'reader', params: { id: o.book.id } }" class="btn-outline btn-sm">O'qish</router-link>
            <button v-if="o.status === 'pending'" class="btn-ghost btn-sm text-red-700 hover:bg-red-50" @click="cancel(o)">Bekor qilish</button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
