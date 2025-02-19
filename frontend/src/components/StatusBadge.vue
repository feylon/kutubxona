<script setup>
import { ORDER_LABELS } from "../utils/format.js";
defineProps({ status: { type: String, required: true } });
</script>

<template>
  <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ring-1" :class="ORDER_LABELS[status]?.cls">
    {{ ORDER_LABELS[status]?.text ?? status }}
  </span>
</template>
