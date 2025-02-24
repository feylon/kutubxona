<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { booksApi, categoriesApi } from "../../api/index.js";
import { useToastStore } from "../../stores/toast.js";
import { formatMoney } from "../../utils/format.js";
import BookCover from "../../components/BookCover.vue";
import Pagination from "../../components/Pagination.vue";
import EmptyState from "../../components/EmptyState.vue";
import BookForm from "./BookForm.vue";

const toast = useToastStore();
const filters = reactive({ search: "", categoryId: "", page: 1 });
const result = ref({ items: [], total: 0, page: 1, pages: 1 });
const categories = ref([]);
const loading = ref(false);
const formOpen = ref(false);
const editing = ref(null);

const load = async () => {
  loading.value = true;
  try {
    result.value = await booksApi.list({ ...filters, all: true, limit: 15 });
  } finally {
    loading.value = false;
  }
};

let timer;
watch(() => filters.search, () => { clearTimeout(timer); timer = setTimeout(() => { filters.page = 1; load(); }, 300); });
watch(() => filters.categoryId, () => { filters.page = 1; load(); });
onMounted(async () => {
  categories.value = (await categoriesApi.list()).items;
  load();
});

const openCreate = () => { editing.value = null; formOpen.value = true; };
const openEdit = (b) => { editing.value = b; formOpen.value = true; };

const toggleStatus = async (b) => {
  try {
    const updated = await booksApi.update(b.id, { status: !b.status });
    Object.assign(b, updated);
    toast.success(updated.status ? "Kitob faollashtirildi" : "Kitob yashirildi");
  } catch (e) {
    toast.error(e.message);
  }
};

const remove = async (b) => {
  if (!confirm(`"${b.title}" kitobini o'chirasizmi? Bu amalni qaytarib bo'lmaydi.`)) return;
  try {
    await booksApi.remove(b.id);
    toast.success("Kitob o'chirildi");
    load();
  } catch (e) {
    toast.error(e.message);
  }
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input v-model="filters.search" type="search" class="input sm:max-w-xs" placeholder="Qidirish…" />
      <select v-model="filters.categoryId" class="input sm:w-56">
        <option value="">Barcha kategoriyalar</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <span class="text-sm text-muted">{{ result.total }} ta</span>
      <button class="btn-accent sm:ml-auto" @click="openCreate">+ Yangi kitob</button>
    </div>

    <div class="card overflow-hidden">
      <table class="w-full text-sm">
        <thead class="border-b border-line bg-paper-2/50">
          <tr>
            <th class="table-head px-4 py-3">Kitob</th>
            <th class="table-head hidden px-4 py-3 md:table-cell">Kategoriya</th>
            <th class="table-head hidden px-4 py-3 lg:table-cell">Narx</th>
            <th class="table-head px-4 py-3">Ombor</th>
            <th class="table-head hidden px-4 py-3 lg:table-cell">Fayllar</th>
            <th class="table-head px-4 py-3">Holat</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody class="divide-y divide-line" :class="loading && 'opacity-50'">
          <tr v-for="b in result.items" :key="b.id" class="transition hover:bg-white/60">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-9 shrink-0"><BookCover :book="b" size="sm" /></div>
                <div class="min-w-0">
                  <p class="truncate font-semibold">{{ b.title }}</p>
                  <p class="truncate text-xs text-muted">{{ b.author }}<span v-if="b.year"> · {{ b.year }}</span></p>
                </div>
              </div>
            </td>
            <td class="hidden px-4 py-3 text-ink-3 md:table-cell">{{ b.category?.name }}</td>
            <td class="hidden px-4 py-3 font-semibold lg:table-cell">{{ formatMoney(b.price) }}</td>
            <td class="px-4 py-3"><span :class="b.amount === 0 ? 'font-bold text-red-600' : 'font-semibold'">{{ b.amount }}</span></td>
            <td class="hidden px-4 py-3 lg:table-cell">
              <span class="mr-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold" :class="b.coverUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-line text-muted'">IMG</span>
              <span class="rounded-md px-1.5 py-0.5 text-[10px] font-bold" :class="b.fileUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-line text-muted'">PDF</span>
            </td>
            <td class="px-4 py-3">
              <button class="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ring-1" :class="b.status ? 'bg-emerald-100 text-emerald-800 ring-emerald-200' : 'bg-line text-muted ring-line'" @click="toggleStatus(b)">
                {{ b.status ? "Faol" : "Yashirin" }}
              </button>
            </td>
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <button class="btn-ghost btn-sm" @click="openEdit(b)">Tahrirlash</button>
              <button class="btn-ghost btn-sm text-red-700 hover:bg-red-50" @click="remove(b)">O'chirish</button>
            </td>
          </tr>
        </tbody>
      </table>
      <EmptyState v-if="!loading && !result.items.length" class="m-4" title="Kitoblar yo'q" />
    </div>

    <Pagination :page="result.page" :pages="result.pages" @change="(p) => { filters.page = p; load(); }" />
    <BookForm :open="formOpen" :book="editing" :categories="categories" @close="formOpen = false" @saved="load" />
  </div>
</template>
