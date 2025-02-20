<script setup>
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import { useToastStore } from "../stores/toast.js";
import AuthShell from "../components/AuthShell.vue";

const auth = useAuthStore();
const toast = useToastStore();
const router = useRouter();
const route = useRoute();

const form = reactive({ username: "", password: "" });
const errors = ref({});
const loading = ref(false);
const showPassword = ref(false);

const submit = async () => {
  loading.value = true;
  errors.value = {};
  try {
    await auth.login(form);
    toast.success(`Xush kelibsiz, ${auth.user.fullname.split(" ")[0]}!`);
    const redirect = route.query.redirect;
    if (redirect) router.push(redirect);
    else router.push(auth.isAdmin ? { name: "admin-dashboard" } : { name: "home" });
  } catch (e) {
    errors.value = e.fieldErrors ?? {};
    toast.error(e.message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <AuthShell title="Xush kelibsiz" subtitle="Hisobingizga kiring — o'quvchi, admin yoki superadmin uchun bitta eshik.">
    <form class="space-y-4" @submit.prevent="submit">
      <div>
        <label class="label" for="username">Foydalanuvchi nomi</label>
        <input id="username" v-model.trim="form.username" class="input" autocomplete="username" placeholder="kitobxon" required />
        <p v-if="errors.username" class="mt-1 text-xs text-red-600">{{ errors.username }}</p>
      </div>
      <div>
        <label class="label" for="password">Parol</label>
        <div class="relative">
          <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" class="input pr-16" autocomplete="current-password" placeholder="••••••••" required />
          <button type="button" class="absolute inset-y-0 right-3 text-xs font-semibold text-muted hover:text-ink" @click="showPassword = !showPassword">
            {{ showPassword ? "Yashirish" : "Ko'rsatish" }}
          </button>
        </div>
        <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
      </div>
      <button class="btn-primary w-full" :disabled="loading">
        <span v-if="loading" class="size-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
        {{ loading ? "Tekshirilmoqda…" : "Kirish" }}
      </button>
    </form>
    <p class="mt-6 text-sm text-muted">
      Hisobingiz yo'qmi?
      <router-link :to="{ name: 'register' }" class="font-semibold text-accent hover:underline">Ro'yxatdan o'ting</router-link>
    </p>
    <div class="mt-8 rounded-xl border border-line bg-white/60 p-4 text-xs text-muted">
      <p class="mb-1 font-bold uppercase tracking-wider">Demo hisoblar</p>
      <p><b>kitobxon</b> / User123! · <b>admin</b> / Admin123! · <b>superadmin</b> / Admin123!</p>
    </div>
  </AuthShell>
</template>
