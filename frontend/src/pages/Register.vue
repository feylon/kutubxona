<script setup>
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import { useToastStore } from "../stores/toast.js";
import AuthShell from "../components/AuthShell.vue";

const auth = useAuthStore();
const toast = useToastStore();
const router = useRouter();

const form = reactive({ fullname: "", username: "", password: "", confirm: "" });
const errors = ref({});
const loading = ref(false);

const strength = computed(() => {
  const p = form.password;
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
});
const strengthLabel = ["", "Zaif", "O'rtacha", "Yaxshi", "Kuchli"];

const submit = async () => {
  errors.value = {};
  if (form.password !== form.confirm) {
    errors.value.confirm = "Parollar mos kelmadi";
    return;
  }
  loading.value = true;
  try {
    await auth.register({ fullname: form.fullname, username: form.username, password: form.password });
    toast.success("Hisob yaratildi. Xush kelibsiz!");
    router.push({ name: "home" });
  } catch (e) {
    errors.value = e.fieldErrors ?? {};
    toast.error(e.message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <AuthShell title="Hisob yarating" subtitle="Bir daqiqada ro'yxatdan o'ting va kitoblarni onlayn o'qishni boshlang.">
    <form class="space-y-4" @submit.prevent="submit">
      <div>
        <label class="label" for="fullname">To'liq ism</label>
        <input id="fullname" v-model.trim="form.fullname" class="input" placeholder="Dilnoza Karimova" required minlength="3" />
        <p v-if="errors.fullname" class="mt-1 text-xs text-red-600">{{ errors.fullname }}</p>
      </div>
      <div>
        <label class="label" for="username">Foydalanuvchi nomi</label>
        <input id="username" v-model.trim="form.username" class="input" placeholder="dilnoza_k" required minlength="3" pattern="[a-zA-Z0-9_.]+" title="Faqat harf, raqam, _ va ." />
        <p v-if="errors.username" class="mt-1 text-xs text-red-600">{{ errors.username }}</p>
      </div>
      <div>
        <label class="label" for="password">Parol</label>
        <input id="password" v-model="form.password" type="password" class="input" autocomplete="new-password" required minlength="6" />
        <div class="mt-2 flex items-center gap-1.5">
          <span v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition" :class="i <= strength ? ['bg-red-500', 'bg-amber-500', 'bg-lime-500', 'bg-emerald-600'][strength - 1] : 'bg-line'" />
          <span class="w-14 text-right text-[11px] font-semibold text-muted">{{ strengthLabel[strength] }}</span>
        </div>
        <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
      </div>
      <div>
        <label class="label" for="confirm">Parolni tasdiqlang</label>
        <input id="confirm" v-model="form.confirm" type="password" class="input" autocomplete="new-password" required />
        <p v-if="errors.confirm" class="mt-1 text-xs text-red-600">{{ errors.confirm }}</p>
      </div>
      <button class="btn-accent w-full" :disabled="loading">{{ loading ? "Yaratilmoqda…" : "Ro'yxatdan o'tish" }}</button>
    </form>
    <p class="mt-6 text-sm text-muted">
      Hisobingiz bormi?
      <router-link :to="{ name: 'login' }" class="font-semibold text-accent hover:underline">Kirish</router-link>
    </p>
  </AuthShell>
</template>
