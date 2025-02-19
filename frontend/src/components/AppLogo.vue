<script setup>
defineProps({ light: Boolean });
</script>

<template>
  <router-link to="/" class="group inline-flex items-center gap-2.5">
    <span class="grid size-9 place-items-center rounded-xl bg-ink transition group-hover:rotate-[-6deg]" :class="light && 'bg-paper'">
      <svg viewBox="0 0 64 64" class="size-5">
        <path d="M14 18h16a6 6 0 0 1 6 6v24a4 4 0 0 0-4-4H14z" :fill="light ? '#1b1611' : '#f7f2ea'" />
        <path d="M50 18H34a6 6 0 0 0-6 6v24a4 4 0 0 1 4-4h18z" fill="#c2410c" />
      </svg>
    </span>
    <span class="font-display text-xl font-semibold tracking-tight" :class="light ? 'text-paper' : 'text-ink'">Kutubxona</span>
  </router-link>
</template>
