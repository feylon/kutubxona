<script setup>
/** Login va ro'yxatdan o'tish sahifalari uchun ikki ustunli qobiq */
import { onMounted, ref } from "vue";
import { gsap } from "../composables/useGsap.js";
import AppLogo from "./AppLogo.vue";
defineProps({ title: String, subtitle: String });

const art = ref(null);
const panel = ref(null);
onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(panel.value, { x: -24, opacity: 0, duration: 0.7 });
  tl.from(art.value?.querySelectorAll(".book"), { y: 60, opacity: 0, rotate: 6, stagger: 0.12, duration: 0.9 }, "-=0.4");
  gsap.to(art.value?.querySelectorAll(".book"), { y: "-=10", duration: 2.4, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.3 });
});
</script>

<template>
  <div class="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
    <div ref="panel" class="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
      <AppLogo />
      <div class="mt-12 max-w-md">
        <p class="eyebrow">Kutubxona</p>
        <h1 class="mt-2 font-display text-4xl font-semibold tracking-tight">{{ title }}</h1>
        <p class="mt-2 text-sm text-muted">{{ subtitle }}</p>
        <div class="mt-8"><slot /></div>
      </div>
    </div>

    <div ref="art" class="relative hidden overflow-hidden bg-ink lg:block">
      <div class="absolute inset-0 opacity-30" style="background: radial-gradient(60% 50% at 70% 30%, #c2410c 0%, transparent 70%)" />
      <div class="absolute inset-0 flex items-center justify-center gap-6">
        <div class="book h-72 w-48 rounded-lg bg-gradient-to-br from-amber-500 to-orange-800 shadow-lift" style="transform: rotate(-8deg)" />
        <div class="book h-80 w-52 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-900 shadow-lift" />
        <div class="book h-72 w-48 rounded-lg bg-gradient-to-br from-rose-500 to-fuchsia-900 shadow-lift" style="transform: rotate(8deg)" />
      </div>
      <blockquote class="absolute inset-x-12 bottom-12 text-paper/80">
        <p class="font-display text-2xl italic leading-snug">"Kitob — bu sening qo'lingdagi dunyo."</p>
        <footer class="mt-3 text-xs uppercase tracking-[0.2em] text-paper/50">Kutubxona jamoasi</footer>
      </blockquote>
    </div>
  </div>
</template>
