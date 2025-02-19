<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import { useToastStore } from "../stores/toast.js";
import AppLogo from "./AppLogo.vue";

const auth = useAuthStore();
const toast = useToastStore();
const router = useRouter();
const menuOpen = ref(false);
const scrolled = ref(false);

const onScroll = () => (scrolled.value = window.scrollY > 12);
onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener("scroll", onScroll));

const logout = () => {
  auth.logout();
  menuOpen.value = false;
  toast.info("Tizimdan chiqdingiz");
  router.push({ name: "home" });
};

const links = [
  { to: { name: "home" }, label: "Bosh sahifa" },
  { to: { name: "books" }, label: "Kitoblar" },
];
</script>

<template>
  <header
    class="sticky top-0 z-50 transition-all duration-300"
    :class="scrolled ? 'bg-paper/85 shadow-[0_1px_0_0_var(--color-line)] backdrop-blur-md' : 'bg-transparent'"
  >
    <div class="container-x flex h-16 items-center justify-between gap-4">
      <AppLogo />

      <nav class="hidden items-center gap-1 md:flex">
        <router-link
          v-for="l in links"
          :key="l.label"
          :to="l.to"
          class="rounded-full px-4 py-2 text-sm font-semibold text-ink-3 transition hover:bg-ink/5 hover:text-ink"
          active-class="!text-ink bg-ink/5"
        >
          {{ l.label }}
        </router-link>
        <router-link v-if="auth.isAuthenticated" :to="{ name: 'orders' }" class="rounded-full px-4 py-2 text-sm font-semibold text-ink-3 transition hover:bg-ink/5 hover:text-ink" active-class="!text-ink bg-ink/5">
          Buyurtmalarim
        </router-link>
      </nav>

      <div class="hidden items-center gap-2 md:flex">
        <template v-if="auth.isAuthenticated">
          <router-link v-if="auth.isAdmin" :to="{ name: 'admin-dashboard' }" class="btn-outline btn-sm">Boshqaruv</router-link>
          <router-link :to="{ name: 'profile' }" class="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition hover:bg-ink/5">
            <span class="grid size-8 place-items-center rounded-full bg-accent text-xs font-bold text-white">
              {{ auth.user.fullname.slice(0, 1).toUpperCase() }}
            </span>
            <span class="text-sm font-semibold">{{ auth.user.fullname.split(" ")[0] }}</span>
          </router-link>
          <button class="btn-ghost btn-sm" @click="logout">Chiqish</button>
        </template>
        <template v-else>
          <router-link :to="{ name: 'login' }" class="btn-ghost btn-sm">Kirish</router-link>
          <router-link :to="{ name: 'register' }" class="btn-primary btn-sm">Ro'yxatdan o'tish</router-link>
        </template>
      </div>

      <button class="grid size-10 place-items-center rounded-xl hover:bg-ink/5 md:hidden" aria-label="Menyu" @click="menuOpen = !menuOpen">
        <span class="relative block h-4 w-5">
          <span class="absolute left-0 top-0 h-0.5 w-5 bg-ink transition" :class="menuOpen && 'translate-y-[7px] rotate-45'" />
          <span class="absolute left-0 top-[7px] h-0.5 w-5 bg-ink transition" :class="menuOpen && 'opacity-0'" />
          <span class="absolute left-0 top-[14px] h-0.5 w-5 bg-ink transition" :class="menuOpen && '-translate-y-[7px] -rotate-45'" />
        </span>
      </button>
    </div>

    <transition name="drop">
      <div v-if="menuOpen" class="border-t border-line bg-paper md:hidden" @click="menuOpen = false">
        <div class="container-x flex flex-col gap-1 py-3">
          <router-link v-for="l in links" :key="l.label" :to="l.to" class="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-ink/5">{{ l.label }}</router-link>
          <template v-if="auth.isAuthenticated">
            <router-link :to="{ name: 'orders' }" class="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-ink/5">Buyurtmalarim</router-link>
            <router-link :to="{ name: 'profile' }" class="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-ink/5">Profil</router-link>
            <router-link v-if="auth.isAdmin" :to="{ name: 'admin-dashboard' }" class="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-ink/5">Boshqaruv paneli</router-link>
            <button class="rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50" @click="logout">Chiqish</button>
          </template>
          <template v-else>
            <router-link :to="{ name: 'login' }" class="rounded-xl px-4 py-3 text-sm font-semibold hover:bg-ink/5">Kirish</router-link>
            <router-link :to="{ name: 'register' }" class="btn-primary mt-1">Ro'yxatdan o'tish</router-link>
          </template>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.drop-enter-active, .drop-leave-active { transition: all 0.2s ease; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
