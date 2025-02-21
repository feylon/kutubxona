<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { booksApi, categoriesApi } from "../api/index.js";
import BookCard from "../components/BookCard.vue";
import Pagination from "../components/Pagination.vue";
import EmptyState from "../components/EmptyState.vue";
import Spinner from "../components/Spinner.vue";

const route = useRoute();
const router = useRouter();

const filters = reactive({
  search: route.query.search ?? "",
  categoryId: route.query.categoryId ?? "",
  sort: route.query.sort ?? "newest",
  available: route.query.available === "true",
  page: Number(route.query.page ?? 1),
});

const categories = ref([]);
const result = ref({ items: [], total: 0, page: 1, pages: 1 });
const loading = ref(true);

const sorts = [
  { value: "newest", label: "Yangi" },
  { value: "popular", label: "Mashhur" },
  { value: "title", label: "Nomi (A–Z)" },
  { value: "price_asc", label: "Arzon" },
  { value: "price_desc", label: "Qimmat" },
];

const load = async () => {
  loading.value = true;
  try {
    result.value = await booksApi.list({ ...filters, available: filters.available || undefined, limit: 18 });
  } finally {
    loading.value = false;
  }
};

const syncQuery = () => {
  const q = {};
  for (const [k, v] of Object.entries(filters)) if (v && !(k === "page" && v === 1) && !(k === "sort" && v === "newest")) q[k] = v;
  router.replace({ query: q });
};

let timer;
watch(() => filters.search, () => {
  clearTimeout(timer);
  timer = setTimeout(() => { filters.page = 1; }, 350);
});
watch(() => [filters.categoryId, filters.sort, filters.available], () => (filters.page = 1));
watch(filters, () => { syncQuery(); load(); });

onMounted(async () => {
  categories.value = (await categoriesApi.list()).items;
  await load();
});

const setPage = (p) => {
  filters.page = p;
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <div class="container-x py-10">
    <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="eyebrow">Katalog</p>
        <h1 class="mt-1 font-display text-4xl font-semibold">Barcha kitoblar</h1>
        <p class="mt-1 text-sm text-muted">{{ result.total }} ta kitob topildi</p>
      </div>
      <div class="relative w-full lg:max-w-md">
        <svg class="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input v-model="filters.search" class="input pl-11" placeholder="Nomi yoki muallifi bo'yicha qidiring…" type="search" />
      </div>
    </div>

    <div class="mt-6 flex flex-wrap items-center gap-2">
      <button class="chip" :class="!filters.categoryId && 'chip-active'" @click="filters.categoryId = ''">Barchasi</button>
      <button v-for="c in categories" :key="c.id" class="chip" :class="filters.categoryId === c.id && 'chip-active'" @click="filters.categoryId = c.id">
        {{ c.name }} <span class="opacity-60">{{ c.bookCount }}</span>
      </button>
      <span class="mx-1 hidden h-5 w-px bg-line sm:block" />
      <label class="chip cursor-pointer" :class="filters.available && 'chip-active'">
        <input v-model="filters.available" type="checkbox" class="sr-only" /> Faqat mavjudlar
      </label>
      <select v-model="filters.sort" class="input ml-auto w-auto rounded-full py-1.5 text-xs font-semibold">
        <option v-for="s in sorts" :key="s.value" :value="s.value">{{ s.label }}</option>
      </select>
    </div>

    <Spinner v-if="loading && !result.items.length" />
    <template v-else>
      <div v-if="result.items.length" class="mt-8 grid grid-cols-2 gap-4 transition-opacity sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" :class="loading && 'opacity-50'">
        <BookCard v-for="b in result.items" :key="b.id" :book="b" />
      </div>
      <EmptyState v-else class="mt-8" title="Kitob topilmadi" text="Qidiruv so'zini o'zgartirib yoki filtrlarni tozalab ko'ring.">
        <button class="btn-outline btn-sm" @click="Object.assign(filters, { search: '', categoryId: '', available: false })">Filtrlarni tozalash</button>
      </EmptyState>
      <div class="mt-10"><Pagination :page="result.page" :pages="result.pages" @change="setPage" /></div>
    </template>
  </div>
</template>
