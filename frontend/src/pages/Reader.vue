<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { booksApi } from "../api/index.js";
import { useToastStore } from "../stores/toast.js";
import { createPdfRenderer } from "../composables/usePdf.js";
import AppLogo from "../components/AppLogo.vue";

const props = defineProps({ id: { type: String, required: true } });
const router = useRouter();
const toast = useToastStore();

const book = ref(null);
const total = ref(0);
const page = ref(1);
const zoom = ref(1);
const fit = ref(true);
const theme = ref(localStorage.getItem("reader_theme") ?? "paper");
const loading = ref(true);
const rendering = ref(false);
const error = ref("");
const canvas = ref(null);
const stage = ref(null);
const pageInput = ref(1);
const toolbarVisible = ref(true);

const renderer = createPdfRenderer();
const storageKey = computed(() => `reader_progress:${props.id}`);
const progress = computed(() => (total.value ? Math.round((page.value / total.value) * 100) : 0));

const themes = {
  paper: { bg: "bg-[#e9e2d6]", canvas: "", label: "Qog'oz" },
  dark: { bg: "bg-[#161311]", canvas: "invert-[0.92] hue-rotate-180 brightness-95", label: "Tungi" },
  sepia: { bg: "bg-[#d8c7a8]", canvas: "sepia-[0.5] contrast-[0.95]", label: "Sepiya" },
};

let renderSeq = 0;
const draw = async () => {
  if (!canvas.value || !total.value) return;
  const seq = ++renderSeq;
  rendering.value = true;
  try {
    const width = fit.value ? Math.min(stage.value.clientWidth - 32, 900) : null;
    await renderer.render(canvas.value, page.value, { scale: zoom.value, fitWidth: width });
  } catch (e) {
    if (seq === renderSeq) error.value = "Sahifani chizishda xatolik";
  } finally {
    if (seq === renderSeq) rendering.value = false;
  }
};

const go = (n) => {
  const target = Math.min(Math.max(1, Number(n) || 1), total.value);
  page.value = target;
  pageInput.value = target;
  localStorage.setItem(storageKey.value, String(target));
  stage.value?.scrollTo({ top: 0, behavior: "smooth" });
};
const next = () => go(page.value + 1);
const prev = () => go(page.value - 1);
const zoomIn = () => { fit.value = false; zoom.value = Math.min(3, +(zoom.value + 0.2).toFixed(2)); };
const zoomOut = () => { fit.value = false; zoom.value = Math.max(0.4, +(zoom.value - 0.2).toFixed(2)); };
const fitWidth = () => { fit.value = true; zoom.value = 1; };
const setTheme = (t) => { theme.value = t; localStorage.setItem("reader_theme", t); };
const fullscreen = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.());

const onKey = (e) => {
  if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
  if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); next(); }
  else if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); prev(); }
  else if (e.key === "+" || e.key === "=") zoomIn();
  else if (e.key === "-") zoomOut();
  else if (e.key === "Escape") router.push({ name: "book", params: { id: props.id } });
};

let resizeTimer;
const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(draw, 150); };

watch([page, zoom, fit], draw);

onMounted(async () => {
  window.addEventListener("keydown", onKey);
  window.addEventListener("resize", onResize);
  try {
    book.value = await booksApi.get(props.id);
    if (!book.value.fileUrl) throw new Error("Bu kitobning PDF fayli yo'q");
    total.value = await renderer.open(book.value.fileUrl);
    const saved = Number(localStorage.getItem(storageKey.value));
    page.value = saved >= 1 && saved <= total.value ? saved : 1;
    pageInput.value = page.value;
    loading.value = false;
    await nextTick();
    await draw();
    if (saved > 1) toast.info(`${saved}-sahifadan davom etyapsiz`);
  } catch (e) {
    loading.value = false;
    error.value = e.message ?? "Kitobni ochib bo'lmadi";
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKey);
  window.removeEventListener("resize", onResize);
  renderer.destroy();
});
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden" :class="themes[theme].bg">
    <!-- Toolbar -->
    <header class="relative z-10 flex items-center gap-2 border-b border-black/10 bg-ink px-3 py-2 text-paper shadow-lg sm:px-4">
      <router-link :to="{ name: 'book', params: { id } }" class="btn-ghost btn-sm !text-paper hover:!bg-white/10" title="Orqaga (Esc)">← Orqaga</router-link>
      <div class="hidden min-w-0 sm:block">
        <p class="truncate text-sm font-semibold">{{ book?.title ?? "Yuklanmoqda…" }}</p>
        <p class="truncate text-[11px] text-paper/60">{{ book?.author }}</p>
      </div>

      <div class="mx-auto flex items-center gap-1">
        <button class="grid size-8 place-items-center rounded-lg hover:bg-white/10 disabled:opacity-30" :disabled="page <= 1" title="Oldingi (←)" @click="prev">‹</button>
        <form class="flex items-center gap-1 text-sm" @submit.prevent="go(pageInput)">
          <input v-model="pageInput" type="number" min="1" :max="total" class="w-14 rounded-lg bg-white/10 px-2 py-1 text-center text-sm outline-none focus:bg-white/20" />
          <span class="text-paper/60">/ {{ total }}</span>
        </form>
        <button class="grid size-8 place-items-center rounded-lg hover:bg-white/10 disabled:opacity-30" :disabled="page >= total" title="Keyingi (→)" @click="next">›</button>
      </div>

      <div class="flex items-center gap-1">
        <button class="grid size-8 place-items-center rounded-lg hover:bg-white/10" title="Kichraytirish (−)" @click="zoomOut">−</button>
        <button class="hidden rounded-lg px-2 py-1 text-xs font-semibold hover:bg-white/10 sm:block" title="Kenglikka moslash" @click="fitWidth">{{ fit ? "Moslashgan" : `${Math.round(zoom * 100)}%` }}</button>
        <button class="grid size-8 place-items-center rounded-lg hover:bg-white/10" title="Kattalashtirish (+)" @click="zoomIn">+</button>
        <span class="mx-1 h-5 w-px bg-white/15" />
        <div class="flex items-center gap-0.5 rounded-lg bg-white/10 p-0.5">
          <button v-for="(t, key) in themes" :key="key" class="size-6 rounded-md ring-offset-1 ring-offset-ink transition" :class="[key === 'paper' && 'bg-[#e9e2d6]', key === 'dark' && 'bg-[#161311] ring-1 ring-white/30', key === 'sepia' && 'bg-[#d8c7a8]', theme === key && 'ring-2 ring-accent']" :title="t.label" @click="setTheme(key)" />
        </div>
        <button class="ml-1 hidden size-8 place-items-center rounded-lg hover:bg-white/10 sm:grid" title="To'liq ekran" @click="fullscreen">⛶</button>
      </div>
    </header>

    <div class="h-0.5 w-full bg-black/10"><div class="h-full bg-accent transition-all duration-300" :style="{ width: `${progress}%` }" /></div>

    <!-- Stage -->
    <div ref="stage" class="relative flex-1 overflow-auto scrollbar-thin" @click.self="toolbarVisible = !toolbarVisible">
      <div v-if="loading" class="flex h-full flex-col items-center justify-center gap-3 text-ink-3">
        <span class="size-10 animate-spin rounded-full border-[3px] border-black/10 border-t-accent" />
        <p class="text-sm">Kitob yuklanmoqda…</p>
      </div>
      <div v-else-if="error" class="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-ink-3">
        <p class="text-5xl">📕</p>
        <p class="font-semibold">{{ error }}</p>
        <router-link :to="{ name: 'book', params: { id } }" class="btn-primary btn-sm">Kitob sahifasiga qaytish</router-link>
      </div>
      <div v-else class="flex min-h-full justify-center p-4 sm:p-6">
        <div class="relative">
          <canvas ref="canvas" class="rounded-sm shadow-[0_20px_60px_-20px_rgb(0_0_0/0.6)] transition-opacity" :class="[themes[theme].canvas, rendering && 'opacity-60']" />
        </div>
      </div>

      <!-- Floating page nav for touch -->
      <button v-if="!loading && !error" class="fixed left-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-ink/70 text-xl text-paper backdrop-blur hover:bg-ink md:grid disabled:opacity-0" :disabled="page <= 1" @click="prev">‹</button>
      <button v-if="!loading && !error" class="fixed right-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-ink/70 text-xl text-paper backdrop-blur hover:bg-ink md:grid disabled:opacity-0" :disabled="page >= total" @click="next">›</button>
    </div>

    <footer class="flex items-center justify-between border-t border-black/10 bg-ink/90 px-4 py-1.5 text-[11px] text-paper/60 backdrop-blur">
      <AppLogo light class="scale-75 origin-left" />
      <span class="hidden sm:block">← → sahifa · + − masshtab · Esc chiqish</span>
      <span>{{ progress }}% o'qildi</span>
    </footer>
  </div>
</template>
