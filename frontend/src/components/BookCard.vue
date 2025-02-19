<script setup>
import BookCover from "./BookCover.vue";
import { formatMoney } from "../utils/format.js";
defineProps({ book: { type: Object, required: true } });
</script>

<template>
  <router-link
    :to="{ name: 'book', params: { id: book.id } }"
    class="group block rounded-2xl p-2 transition duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-card"
  >
    <div class="relative transition duration-300 group-hover:[transform:perspective(900px)_rotateY(-6deg)]">
      <BookCover :book="book" />
      <span v-if="book.amount === 0" class="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-paper backdrop-blur">Tugagan</span>
      <span v-else-if="book.views > 150" class="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Mashhur</span>
    </div>
    <div class="mt-3 px-1">
      <p class="text-[11px] font-semibold uppercase tracking-wider text-muted">{{ book.category?.name }}</p>
      <h3 class="mt-0.5 line-clamp-2 font-display text-[15px] font-semibold leading-snug text-ink group-hover:text-accent">{{ book.title }}</h3>
      <p class="mt-0.5 text-xs text-ink-3">{{ book.author }}</p>
      <div class="mt-2 flex items-center justify-between">
        <span class="text-sm font-bold">{{ formatMoney(book.price) }}</span>
        <span class="text-[11px] text-muted">{{ book.views }} ko'rildi</span>
      </div>
    </div>
  </router-link>
</template>
