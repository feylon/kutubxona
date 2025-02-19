import { defineStore } from "pinia";
import { ref } from "vue";

let seq = 0;

export const useToastStore = defineStore("toast", () => {
  const items = ref([]);

  const push = (message, type = "info", timeout = 3500) => {
    const id = ++seq;
    items.value.push({ id, message, type });
    setTimeout(() => dismiss(id), timeout);
    return id;
  };
  const dismiss = (id) => {
    items.value = items.value.filter((t) => t.id !== id);
  };

  return {
    items,
    dismiss,
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error", 5000),
    info: (m) => push(m, "info"),
  };
});
