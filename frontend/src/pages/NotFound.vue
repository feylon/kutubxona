<script setup>
import { onMounted, ref } from "vue";
import { gsap } from "../composables/useGsap.js";
import AppLogo from "../components/AppLogo.vue";
const num = ref(null);
onMounted(() => gsap.from(num.value.children, { y: 60, opacity: 0, rotate: () => gsap.utils.random(-15, 15), stagger: 0.1, duration: 0.9, ease: "back.out(1.6)" }));
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
    <AppLogo />
    <div ref="num" class="mt-10 flex font-display text-[120px] font-black leading-none text-ink sm:text-[180px]">
      <span>4</span><span class="text-accent">0</span><span>4</span>
    </div>
    <h1 class="mt-4 font-display text-2xl font-semibold">Bu sahifa kutubxonada yo'q</h1>
    <p class="mt-2 max-w-sm text-sm text-muted">Siz izlagan sahifa o'chirilgan yoki manzil noto'g'ri kiritilgan bo'lishi mumkin.</p>
    <router-link :to="{ name: 'home' }" class="btn-primary mt-8">Bosh sahifaga</router-link>
  </div>
</template>
