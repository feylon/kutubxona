<script setup>
import { useToastStore } from "../stores/toast.js";
const toast = useToastStore();
const styles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-line bg-cream text-ink",
};
const icons = { success: "✓", error: "!", info: "i" };
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
    <transition-group name="toast">
      <div
        v-for="t in toast.items"
        :key="t.id"
        class="pointer-events-auto flex max-w-md items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lift"
        :class="styles[t.type]"
        role="status"
        @click="toast.dismiss(t.id)"
      >
        <span class="grid size-6 shrink-0 place-items-center rounded-full bg-current/15 text-xs font-bold">{{ icons[t.type] }}</span>
        <span>{{ t.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1); }
.toast-enter-from { opacity: 0; transform: translateY(-12px) scale(0.96); }
.toast-leave-to { opacity: 0; transform: translateY(-6px) scale(0.98); }
</style>
