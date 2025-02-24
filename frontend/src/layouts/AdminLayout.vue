<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import { useToastStore } from "../stores/toast.js";
import { ROLE_LABELS } from "../utils/format.js";
import AppLogo from "../components/AppLogo.vue";

const auth = useAuthStore();
const toast = useToastStore();
const route = useRoute();
const router = useRouter();
const open = ref(false);

const nav = [
  { to: { name: "admin-dashboard" }, label: "Boshqaruv paneli", icon: "M3 12 12 4l9 8M5 10v10h14V10" },
  { to: { name: "admin-books" }, label: "Kitoblar", icon: "M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM8 3v18" },
  { to: { name: "admin-categories" }, label: "Kategoriyalar", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" },
  { to: { name: "admin-orders" }, label: "Buyurtmalar", icon: "M6 3h12l2 4v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7zM4 7h16M9 11a3 3 0 0 0 6 0" },
  { to: { name: "admin-users" }, label: "Foydalanuvchilar", icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
];

const title = computed(() => route.meta.title ?? "Boshqaruv");
const logout = () => {
  auth.logout();
  toast.info("Tizimdan chiqdingiz");
  router.push({ name: "login" });
};
</script>

<template>
  <div class="flex min-h-screen bg-paper">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-40 flex w-64 -translate-x-full flex-col bg-ink text-paper transition-transform duration-300 lg:static lg:translate-x-0" :class="open && '!translate-x-0'">
      <div class="flex h-16 items-center justify-between px-5"><AppLogo light /><button class="lg:hidden" @click="open = false">✕</button></div>
      <nav class="mt-4 flex-1 space-y-1 px-3">
        <router-link
          v-for="n in nav"
          :key="n.label"
          :to="n.to"
          class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-paper/60 transition hover:bg-white/5 hover:text-paper"
          exact-active-class="!bg-accent !text-white"
          @click="open = false"
        >
          <svg class="size-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path :d="n.icon" /></svg>
          {{ n.label }}
        </router-link>
      </nav>
      <div class="border-t border-white/10 p-4">
        <router-link :to="{ name: 'home' }" class="block rounded-xl px-3 py-2 text-sm text-paper/60 hover:bg-white/5 hover:text-paper">← Saytga qaytish</router-link>
        <div class="mt-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <span class="grid size-9 place-items-center rounded-full bg-accent text-sm font-bold">{{ auth.user.fullname.slice(0, 1) }}</span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold">{{ auth.user.fullname }}</p>
            <p class="text-[11px] text-paper/50">{{ ROLE_LABELS[auth.user.role] }}</p>
          </div>
          <button class="text-paper/50 hover:text-paper" title="Chiqish" @click="logout">
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          </button>
        </div>
      </div>
    </aside>
    <div v-if="open" class="fixed inset-0 z-30 bg-ink/40 lg:hidden" @click="open = false" />

    <!-- Content -->
    <div class="flex min-w-0 flex-1 flex-col">
      <header class="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-paper/85 px-4 backdrop-blur sm:px-8">
        <button class="grid size-10 place-items-center rounded-xl hover:bg-ink/5 lg:hidden" @click="open = true">☰</button>
        <h1 class="font-display text-xl font-semibold">{{ title }}</h1>
      </header>
      <main class="flex-1 p-4 sm:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>
