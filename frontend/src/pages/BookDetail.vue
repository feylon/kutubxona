<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { booksApi, ordersApi } from "../api/index.js";
import { useAuthStore } from "../stores/auth.js";
import { useToastStore } from "../stores/toast.js";
import { formatMoney } from "../utils/format.js";
import { gsap } from "../composables/useGsap.js";
import BookCover from "../components/BookCover.vue";
import BookCard from "../components/BookCard.vue";
import BaseModal from "../components/BaseModal.vue";
import Spinner from "../components/Spinner.vue";

const props = defineProps({ id: { type: String, required: true } });
const auth = useAuthStore();
const toast = useToastStore();
const router = useRouter();

const book = ref(null);
const related = ref([]);
const loading = ref(true);
const notFound = ref(false);
const orderOpen = ref(false);
const order = ref({ amount: 1, note: "" });
const ordering = ref(false);
const coverEl = ref(null);

const canRead = computed(() => Boolean(book.value?.fileUrl));
const inStock = computed(() => (book.value?.amount ?? 0) > 0);

const load = async () => {
  loading.value = true;
  notFound.value = false;
  try {
    book.value = await booksApi.get(props.id);
    const r = await booksApi.list({ categoryId: book.value.categoryId, limit: 7 });
    related.value = r.items.filter((b) => b.id !== book.value.id).slice(0, 6);
    requestAnimationFrame(() => {
      gsap.from(coverEl.value, { x: -30, opacity: 0, rotateY: -20, duration: 0.9, ease: "power3.out" });
      gsap.from(".detail-fade", { y: 16, opacity: 0, stagger: 0.07, duration: 0.6, ease: "power2.out" });
    });
  } catch {
    book.value = null;
    notFound.value = true;
  } finally {
    loading.value = false;
  }
};
onMounted(load);
watch(() => props.id, load);

const startOrder = () => {
  if (!auth.isAuthenticated) return router.push({ name: "login", query: { redirect: `/books/${props.id}` } });
  order.value = { amount: 1, note: "" };
  orderOpen.value = true;
};

const submitOrder = async () => {
  ordering.value = true;
  try {
    await ordersApi.create({ bookId: book.value.id, amount: Number(order.value.amount), note: order.value.note || undefined });
    orderOpen.value = false;
    toast.success("Buyurtma qabul qilindi. Admin tasdiqlashini kuting.");
  } catch (e) {
    toast.error(e.message);
  } finally {
    ordering.value = false;
  }
};

const read = () => {
  if (!auth.isAuthenticated) return router.push({ name: "login", query: { redirect: `/books/${props.id}/read` } });
  router.push({ name: "reader", params: { id: props.id } });
};
</script>

<template>
  <div class="container-x py-10">
    <Spinner v-if="loading" />
    <div v-else-if="notFound" class="py-20 text-center">
      <p class="text-6xl">📕</p>
      <h1 class="mt-4 font-display text-3xl font-semibold">Kitob topilmadi</h1>
      <router-link :to="{ name: 'books' }" class="btn-primary mt-6">Katalogga qaytish</router-link>
    </div>

    <template v-else>
      <nav class="detail-fade mb-6 flex items-center gap-2 text-xs text-muted">
        <router-link :to="{ name: 'home' }" class="hover:text-ink">Bosh sahifa</router-link> ›
        <router-link :to="{ name: 'books' }" class="hover:text-ink">Kitoblar</router-link> ›
        <router-link :to="{ name: 'books', query: { categoryId: book.categoryId } }" class="hover:text-ink">{{ book.category?.name }}</router-link>
      </nav>

      <div class="grid gap-10 lg:grid-cols-[320px_1fr]">
        <div ref="coverEl" class="mx-auto w-full max-w-[300px] lg:sticky lg:top-24 lg:self-start" style="perspective: 1000px">
          <BookCover :book="book" />
          <div class="mt-5 flex flex-col gap-2">
            <button class="btn-accent w-full" :disabled="!canRead" @click="read">
              <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/></svg>
              {{ canRead ? "Onlayn o'qish" : "PDF mavjud emas" }}
            </button>
            <button class="btn-primary w-full" :disabled="!inStock" @click="startOrder">
              {{ inStock ? "Buyurtma berish" : "Omborda yo'q" }}
            </button>
          </div>
        </div>

        <div>
          <p class="detail-fade eyebrow">{{ book.category?.name }}</p>
          <h1 class="detail-fade mt-2 font-display text-4xl font-semibold leading-tight text-balance sm:text-5xl">{{ book.title }}</h1>
          <p class="detail-fade mt-3 text-lg text-ink-3">{{ book.author }}<span v-if="book.year" class="text-muted"> · {{ book.year }}</span></p>

          <div class="detail-fade mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div v-for="s in [
              { l: 'Narxi', v: formatMoney(book.price) },
              { l: 'Omborda', v: inStock ? `${book.amount} dona` : 'Yo\'q' },
              { l: 'Sahifalar', v: book.pages ?? '—' },
              { l: 'Ko\'rildi', v: book.views },
            ]" :key="s.l" class="card p-4">
              <p class="text-[11px] font-bold uppercase tracking-wider text-muted">{{ s.l }}</p>
              <p class="mt-1 font-display text-lg font-semibold">{{ s.v }}</p>
            </div>
          </div>

          <div class="detail-fade mt-8">
            <h2 class="font-display text-xl font-semibold">Kitob haqida</h2>
            <p class="mt-3 whitespace-pre-line leading-relaxed text-ink-3">{{ book.description || "Tavsif kiritilmagan." }}</p>
          </div>

          <div v-if="related.length" class="detail-fade mt-14">
            <h2 class="font-display text-xl font-semibold">Shu kategoriyadagi kitoblar</h2>
            <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
              <BookCard v-for="b in related" :key="b.id" :book="b" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <BaseModal :open="orderOpen" title="Buyurtma berish" size="sm" @close="orderOpen = false">
      <div class="mb-4 flex gap-3 rounded-xl bg-white/70 p-3">
        <div class="w-12 shrink-0"><BookCover :book="book" size="sm" /></div>
        <div class="text-sm">
          <p class="font-semibold">{{ book?.title }}</p>
          <p class="text-muted">{{ formatMoney(book?.price) }} · {{ book?.amount }} dona mavjud</p>
        </div>
      </div>
      <form class="space-y-4" @submit.prevent="submitOrder">
        <div>
          <label class="label">Soni</label>
          <div class="flex items-center gap-2">
            <button type="button" class="btn-outline size-10 !p-0" @click="order.amount = Math.max(1, order.amount - 1)">−</button>
            <input v-model.number="order.amount" type="number" min="1" :max="book?.amount" class="input w-20 text-center" required />
            <button type="button" class="btn-outline size-10 !p-0" @click="order.amount = Math.min(book.amount, order.amount + 1)">+</button>
            <span class="ml-auto font-semibold">{{ formatMoney(order.amount * (book?.price ?? 0)) }}</span>
          </div>
        </div>
        <div>
          <label class="label">Izoh (ixtiyoriy)</label>
          <textarea v-model.trim="order.note" class="input" rows="2" maxlength="300" placeholder="Masalan: yangi nashri bo'lsa" />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" class="btn-ghost" @click="orderOpen = false">Bekor</button>
          <button class="btn-accent" :disabled="ordering">{{ ordering ? "Yuborilmoqda…" : "Tasdiqlash" }}</button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>
