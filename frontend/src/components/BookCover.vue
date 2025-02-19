<script setup>
/** Kitob muqovasi: rasm bo'lmasa sarlavhadan gradientli muqova yasaydi */
import { computed } from "vue";
const props = defineProps({ book: { type: Object, required: true }, size: { type: String, default: "md" } });
const hue = computed(() => {
  let h = 0;
  for (const ch of props.book.title ?? "") h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
});
</script>

<template>
  <div class="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-paper-2 shadow-card ring-1 ring-ink/10">
    <img
      v-if="book.coverUrl"
      :src="book.coverUrl"
      :alt="book.title"
      class="size-full object-cover"
      loading="lazy"
    />
    <div v-else class="flex size-full flex-col justify-end p-4" :style="{ background: `linear-gradient(145deg, hsl(${hue} 60% 40%), hsl(${(hue + 40) % 360} 55% 18%))` }">
      <span class="mb-2 block h-1 w-8 bg-white/80" />
      <span class="font-display text-lg font-bold leading-tight text-white" :class="size === 'sm' && 'text-sm'">{{ book.title }}</span>
      <span class="mt-1 text-xs text-white/70">{{ book.author }}</span>
    </div>
    <span class="pointer-events-none absolute inset-y-0 left-0 w-[6%] bg-gradient-to-r from-black/25 to-transparent" />
    <span class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20" />
  </div>
</template>
