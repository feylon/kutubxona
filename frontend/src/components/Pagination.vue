<script setup>
import { computed } from "vue";
const props = defineProps({ page: { type: Number, required: true }, pages: { type: Number, required: true } });
const emit = defineEmits(["change"]);

const items = computed(() => {
  const { page, pages } = props;
  const set = new Set([1, pages, page, page - 1, page + 1]);
  const list = [...set].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < list.length; i++) {
    if (i && list[i] - list[i - 1] > 1) out.push("…");
    out.push(list[i]);
  }
  return out;
});
</script>

<template>
  <nav v-if="pages > 1" class="flex items-center justify-center gap-1" aria-label="Sahifalar">
    <button class="btn-outline btn-sm" :disabled="page <= 1" @click="emit('change', page - 1)">←</button>
    <template v-for="(p, i) in items" :key="i">
      <span v-if="p === '…'" class="px-2 text-muted">…</span>
      <button
        v-else
        class="size-8 rounded-full text-sm font-semibold transition"
        :class="p === page ? 'bg-ink text-paper' : 'hover:bg-ink/5'"
        @click="emit('change', p)"
      >
        {{ p }}
      </button>
    </template>
    <button class="btn-outline btn-sm" :disabled="page >= pages" @click="emit('change', page + 1)">→</button>
  </nav>
</template>
