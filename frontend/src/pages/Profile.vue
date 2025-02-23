<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "../stores/auth.js";
import { useToastStore } from "../stores/toast.js";
import { authApi } from "../api/index.js";
import { ROLE_LABELS, formatDate } from "../utils/format.js";

const auth = useAuthStore();
const toast = useToastStore();

const profile = reactive({ fullname: auth.user?.fullname ?? "" });
const pwd = reactive({ currentPassword: "", newPassword: "", confirm: "" });
const saving = ref(false);
const changing = ref(false);

const saveProfile = async () => {
  saving.value = true;
  try {
    await auth.updateProfile({ fullname: profile.fullname });
    toast.success("Profil yangilandi");
  } catch (e) {
    toast.error(e.message);
  } finally {
    saving.value = false;
  }
};

const changePassword = async () => {
  if (pwd.newPassword !== pwd.confirm) return toast.error("Yangi parollar mos kelmadi");
  changing.value = true;
  try {
    await authApi.changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
    Object.assign(pwd, { currentPassword: "", newPassword: "", confirm: "" });
    toast.success("Parol o'zgartirildi");
  } catch (e) {
    toast.error(e.message);
  } finally {
    changing.value = false;
  }
};
</script>

<template>
  <div class="container-x max-w-3xl py-10">
    <div class="flex items-center gap-5">
      <span class="grid size-20 place-items-center rounded-3xl bg-accent font-display text-3xl font-bold text-white shadow-card">{{ auth.user.fullname.slice(0, 1).toUpperCase() }}</span>
      <div>
        <h1 class="font-display text-3xl font-semibold">{{ auth.user.fullname }}</h1>
        <p class="text-sm text-muted">@{{ auth.user.username }} · {{ ROLE_LABELS[auth.user.role] }} · {{ formatDate(auth.user.createdAt) }} dan beri</p>
      </div>
    </div>

    <div class="mt-10 grid gap-6 md:grid-cols-2">
      <form class="card p-6" @submit.prevent="saveProfile">
        <h2 class="font-display text-xl font-semibold">Profil</h2>
        <div class="mt-4">
          <label class="label">To'liq ism</label>
          <input v-model.trim="profile.fullname" class="input" minlength="3" required />
        </div>
        <div class="mt-3">
          <label class="label">Foydalanuvchi nomi</label>
          <input :value="auth.user.username" class="input opacity-60" disabled />
        </div>
        <button class="btn-primary mt-5" :disabled="saving">Saqlash</button>
      </form>

      <form class="card p-6" @submit.prevent="changePassword">
        <h2 class="font-display text-xl font-semibold">Parolni o'zgartirish</h2>
        <div class="mt-4 space-y-3">
          <div><label class="label">Joriy parol</label><input v-model="pwd.currentPassword" type="password" class="input" required autocomplete="current-password" /></div>
          <div><label class="label">Yangi parol</label><input v-model="pwd.newPassword" type="password" class="input" required minlength="6" autocomplete="new-password" /></div>
          <div><label class="label">Tasdiqlang</label><input v-model="pwd.confirm" type="password" class="input" required autocomplete="new-password" /></div>
        </div>
        <button class="btn-outline mt-5" :disabled="changing">Yangilash</button>
      </form>
    </div>
  </div>
</template>
