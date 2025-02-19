<script setup>
import { watch, onUnmounted } from "vue";
const props = defineProps({ open: Boolean, title: String, size: { type: String, default: "md" } });
const emit = defineEmits(["close"]);
const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

const onKey = (e) => e.key === "Escape" && emit("close");
watch(
  () => props.open,
  (open) => {
    document.body.style.overflow = open ? "hidden" : "";
    open ? window.addEventListener("keydown", onKey) : window.removeEventListener("keydown", onKey);
  },
  { immediate: true },
);
onUnmounted(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", onKey);
});
</script>

<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="open" class="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-ink/50 p-4 backdrop-blur-sm" @click.self="emit('close')">
        <div class="modal-panel w-full rounded-2xl bg-cream p-6 shadow-lift" :class="sizes[size]" role="dialog" aria-modal="true">
          <div class="mb-5 flex items-start justify-between gap-4">
            <h3 class="font-display text-xl font-semibold">{{ title }}</h3>
            <button class="grid size-8 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink" aria-label="Yopish" @click="emit('close')">✕</button>
          </div>
          <slot />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-active .modal-panel, .modal-leave-active .modal-panel { transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-panel, .modal-leave-to .modal-panel { transform: translateY(16px) scale(0.98); opacity: 0; }
</style>
