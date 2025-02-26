<script setup>
import { ref, onMounted, nextTick } from "vue";
import { statsApi } from "../../api/index.js";
import { formatDateTime } from "../../utils/format.js";
import { gsap, countUp } from "../../composables/useGsap.js";
import StatusBadge from "../../components/StatusBadge.vue";
import BookCover from "../../components/BookCover.vue";
import Spinner from "../../components/Spinner.vue";

const stats = ref(null);
const root = ref(null);

onMounted(async () => {
  stats.value = await statsApi.admin();
  await nextTick();
  gsap.from(root.value.querySelectorAll(".stat"), { y: 20, opacity: 0, stagger: 0.07, duration: 0.6, ease: "power3.out" });
  root.value.querySelectorAll("[data-count]").forEach((el, i) => countUp(el, Number(el.dataset.count), { duration: 1.2, delay: i * 0.1 }));
});
</script>

<template>
  <Spinner v-if="!stats" />
  <div v-else ref="root" class="space-y-8">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="s in [
        { label: 'Kitoblar', value: stats.books, sub: `${stats.inactiveBooks} nofaol`, to: { name: 'admin-books' }, color: 'bg-ink text-paper' },
        { label: 'Kutilayotgan buyurtmalar', value: stats.orders.pending, sub: `${stats.orders.total} jami`, to: { name: 'admin-orders' }, color: 'bg-accent text-white' },
        { label: 'Foydalanuvchilar', value: stats.users, sub: 'ro\'yxatdan o\'tgan', to: { name: 'admin-users' }, color: 'bg-cream' },
        { label: 'Kategoriyalar', value: stats.categories, sub: 'bo\'lim', to: { name: 'admin-categories' }, color: 'bg-cream' },
      ]" :key="s.label" class="stat">
        <router-link :to="s.to" class="card block p-5 transition hover:-translate-y-0.5 hover:shadow-lift" :class="s.color">
          <p class="text-xs font-bold uppercase tracking-wider opacity-60">{{ s.label }}</p>
          <p class="mt-2 font-display text-4xl font-semibold" :data-count="s.value">0</p>
          <p class="mt-1 text-xs opacity-60">{{ s.sub }}</p>
        </router-link>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <section class="card stat p-5">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="font-display text-lg font-semibold">So'nggi buyurtmalar</h2>
          <router-link :to="{ name: 'admin-orders' }" class="text-xs font-semibold text-accent hover:underline">Barchasi →</router-link>
        </div>
        <div v-if="!stats.recentOrders.length" class="py-8 text-center text-sm text-muted">Hali buyurtmalar yo'q</div>
        <ul v-else class="divide-y divide-line">
          <li v-for="o in stats.recentOrders" :key="o.id" class="flex items-center gap-3 py-3">
            <div class="w-9 shrink-0"><BookCover :book="o.book" size="sm" /></div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold">{{ o.book.title }}</p>
              <p class="text-xs text-muted">{{ o.user.fullname }} · {{ o.amount }} dona · {{ formatDateTime(o.createdAt) }}</p>
            </div>
            <StatusBadge :status="o.status" />
          </li>
        </ul>
      </section>

      <section class="card stat p-5">
        <h2 class="mb-4 font-display text-lg font-semibold">Eng ko'p ko'rilgan</h2>
        <ol class="space-y-3">
          <li v-for="(b, i) in stats.topBooks" :key="b.id" class="flex items-center gap-3">
            <span class="w-5 font-display text-lg font-bold text-muted">{{ i + 1 }}</span>
            <div class="w-8 shrink-0"><BookCover :book="b" size="sm" /></div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold">{{ b.title }}</p>
              <p class="truncate text-xs text-muted">{{ b.author }}</p>
            </div>
            <span class="text-xs font-semibold">{{ b.views }}</span>
          </li>
        </ol>
      </section>
    </div>

    <section class="card stat p-5">
      <h2 class="mb-3 font-display text-lg font-semibold">Buyurtmalar holati</h2>
      <div class="flex h-3 overflow-hidden rounded-full bg-line">
        <div class="bg-amber-400 transition-all" :style="{ width: `${(stats.orders.pending / (stats.orders.total || 1)) * 100}%` }" />
        <div class="bg-emerald-500 transition-all" :style="{ width: `${(stats.orders.accepted / (stats.orders.total || 1)) * 100}%` }" />
        <div class="bg-red-400 transition-all" :style="{ width: `${(stats.orders.rejected / (stats.orders.total || 1)) * 100}%` }" />
      </div>
      <div class="mt-3 flex flex-wrap gap-5 text-xs">
        <span><i class="mr-1.5 inline-block size-2.5 rounded-full bg-amber-400" />Kutilmoqda: <b>{{ stats.orders.pending }}</b></span>
        <span><i class="mr-1.5 inline-block size-2.5 rounded-full bg-emerald-500" />Qabul qilingan: <b>{{ stats.orders.accepted }}</b></span>
        <span><i class="mr-1.5 inline-block size-2.5 rounded-full bg-red-400" />Rad etilgan: <b>{{ stats.orders.rejected }}</b></span>
      </div>
    </section>
  </div>
</template>
