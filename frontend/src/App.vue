<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth.js";
import ToastHost from "./components/ToastHost.vue";

const auth = useAuthStore();
onMounted(() => auth.bootstrap());
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <ToastHost />
</template>

<style>
.page-enter-active, .page-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.page-enter-from { opacity: 0; transform: translateY(6px); }
.page-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
