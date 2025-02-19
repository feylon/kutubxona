<script setup>
import AppLogo from "./AppLogo.vue";
const year = new Date().getFullYear();
</script>

<template>
  <footer class="mt-24 bg-ink text-paper">
    <div class="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
      <div>
        <AppLogo light />
        <p class="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
          Kitob o'qishni sevuvchilar uchun zamonaviy onlayn kutubxona. Minglab kitoblar — bir joyda, istalgan vaqtda.
        </p>
      </div>
      <div>
        <h4 class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-paper/50">Bo'limlar</h4>
        <ul class="space-y-2 text-sm">
          <li><router-link :to="{ name: 'home' }" class="text-paper/80 hover:text-white">Bosh sahifa</router-link></li>
          <li><router-link :to="{ name: 'books' }" class="text-paper/80 hover:text-white">Barcha kitoblar</router-link></li>
          <li><router-link :to="{ name: 'books', query: { sort: 'popular' } }" class="text-paper/80 hover:text-white">Mashhur kitoblar</router-link></li>
          <li><router-link :to="{ name: 'orders' }" class="text-paper/80 hover:text-white">Buyurtmalarim</router-link></li>
        </ul>
      </div>
      <div>
        <h4 class="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-paper/50">Aloqa</h4>
        <ul class="space-y-2 text-sm text-paper/80">
          <li>Toshkent sh., Navoiy ko'chasi, 1</li>
          <li>+998 71 200 00 00</li>
          <li>info@kutubxona.uz</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-paper/10">
      <div class="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-paper/50 sm:flex-row">
        <span>© {{ year }} Kutubxona. Barcha huquqlar himoyalangan.</span>
        <span>Vue 3 · Express 5 · PostgreSQL</span>
      </div>
    </div>
  </footer>
</template>
