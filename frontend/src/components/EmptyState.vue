<script setup>
defineProps({ title: { type: String, default: "Hech narsa topilmadi" }, text: String, icon: { type: String, default: "📚" } });
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-16 text-center">
    <span class="text-4xl">{{ icon }}</span>
    <h3 class="mt-4 font-display text-lg font-semibold">{{ title }}</h3>
    <p v-if="text" class="mt-1 max-w-sm text-sm text-muted">{{ text }}</p>
    <div class="mt-5"><slot /></div>
  </div>
</template>
