<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { usersApi } from "../../api/index.js";
import { useAuthStore } from "../../stores/auth.js";
import { useToastStore } from "../../stores/toast.js";
import { ROLE_LABELS, formatDate } from "../../utils/format.js";
import Pagination from "../../components/Pagination.vue";
import BaseModal from "../../components/BaseModal.vue";
import EmptyState from "../../components/EmptyState.vue";

const auth = useAuthStore();
const toast = useToastStore();
const filters = reactive({ role: "", search: "", page: 1 });
const result = ref({ items: [], total: 0, page: 1, pages: 1 });
const loading = ref(false);
const createOpen = ref(false);
const staff = reactive({ fullname: "", username: "", password: "", role: "admin" });
const creating = ref(false);

const load = async () => {
  loading.value = true;
  try {
    result.value = await usersApi.list({ ...filters, limit: 15 });
  } finally {
    loading.value = false;
  }
};
let timer;
watch(() => filters.search, () => { clearTimeout(timer); timer = setTimeout(() => { filters.page = 1; load(); }, 300); });
watch(() => filters.role, () => { filters.page = 1; load(); });
onMounted(load);

const canManage = (u) => u.id !== auth.user.id && (auth.isSuperAdmin || u.role === "user");

const toggleStatus = async (u) => {
  try {
    Object.assign(u, await usersApi.setStatus(u.id, !u.status));
    toast.success(u.status ? "Foydalanuvchi faollashtirildi" : "Foydalanuvchi bloklandi");
  } catch (e) {
    toast.error(e.message);
  }
};
const changeRole = async (u, role) => {
  try {
    Object.assign(u, await usersApi.setRole(u.id, role));
    toast.success(`Rol: ${ROLE_LABELS[role]}`);
  } catch (e) {
    toast.error(e.message);
    load();
  }
};
const createStaff = async () => {
  creating.value = true;
  try {
    await usersApi.createStaff(staff);
    toast.success("Xodim yaratildi");
    Object.assign(staff, { fullname: "", username: "", password: "", role: "admin" });
    createOpen.value = false;
    load();
  } catch (e) {
    toast.error(e.message);
  } finally {
    creating.value = false;
  }
};
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="flex gap-1 rounded-full bg-paper-2 p-1">
        <button v-for="(l, k) in { '': 'Barchasi', user: 'O\'quvchilar', admin: 'Adminlar', superadmin: 'Superadmin' }" :key="k" class="rounded-full px-3.5 py-1.5 text-xs font-semibold transition" :class="filters.role === k ? 'bg-ink text-paper shadow' : 'text-ink-3 hover:text-ink'" @click="filters.role = k">{{ l }}</button>
      </div>
      <input v-model="filters.search" type="search" class="input sm:max-w-xs" placeholder="Ism yoki username…" />
      <span class="text-sm text-muted">{{ result.total }} ta</span>
      <button v-if="auth.isSuperAdmin" class="btn-accent sm:ml-auto" @click="createOpen = true">+ Xodim qo'shish</button>
    </div>

    <div class="card overflow-hidden">
      <table class="w-full text-sm">
        <thead class="border-b border-line bg-paper-2/50">
          <tr>
            <th class="table-head px-4 py-3">Foydalanuvchi</th>
            <th class="table-head px-4 py-3">Rol</th>
            <th class="table-head hidden px-4 py-3 md:table-cell">Ro'yxatdan o'tgan</th>
            <th class="table-head px-4 py-3">Holat</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody class="divide-y divide-line" :class="loading && 'opacity-50'">
          <tr v-for="u in result.items" :key="u.id" class="transition hover:bg-white/60">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <span class="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white" :class="u.role === 'user' ? 'bg-sage' : 'bg-accent'">{{ u.fullname.slice(0, 1).toUpperCase() }}</span>
                <div class="min-w-0">
                  <p class="truncate font-semibold">{{ u.fullname }} <span v-if="u.id === auth.user.id" class="text-xs text-muted">(siz)</span></p>
                  <p class="text-xs text-muted">@{{ u.username }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <select v-if="auth.isSuperAdmin && u.id !== auth.user.id" :value="u.role" class="input w-auto py-1 text-xs" @change="changeRole(u, $event.target.value)">
                <option v-for="(l, r) in ROLE_LABELS" :key="r" :value="r">{{ l }}</option>
              </select>
              <span v-else class="rounded-full bg-paper-2 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">{{ ROLE_LABELS[u.role] }}</span>
            </td>
            <td class="hidden px-4 py-3 text-xs text-muted md:table-cell">{{ formatDate(u.createdAt) }}</td>
            <td class="px-4 py-3">
              <span class="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ring-1" :class="u.status ? 'bg-emerald-100 text-emerald-800 ring-emerald-200' : 'bg-red-100 text-red-800 ring-red-200'">{{ u.status ? "Faol" : "Bloklangan" }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <button v-if="canManage(u)" class="btn-ghost btn-sm" :class="u.status ? 'text-red-700 hover:bg-red-50' : 'text-emerald-700 hover:bg-emerald-50'" @click="toggleStatus(u)">{{ u.status ? "Bloklash" : "Faollashtirish" }}</button>
            </td>
          </tr>
        </tbody>
      </table>
      <EmptyState v-if="!loading && !result.items.length" class="m-4" icon="👤" title="Foydalanuvchilar topilmadi" />
    </div>
    <Pagination :page="result.page" :pages="result.pages" @change="(p) => { filters.page = p; load(); }" />

    <BaseModal :open="createOpen" title="Yangi xodim" size="sm" @close="createOpen = false">
      <form class="space-y-3" @submit.prevent="createStaff">
        <div><label class="label">To'liq ism</label><input v-model.trim="staff.fullname" class="input" required minlength="3" /></div>
        <div><label class="label">Username</label><input v-model.trim="staff.username" class="input" required minlength="3" pattern="[a-zA-Z0-9_.]+" /></div>
        <div><label class="label">Parol</label><input v-model="staff.password" type="password" class="input" required minlength="6" /></div>
        <div>
          <label class="label">Rol</label>
          <select v-model="staff.role" class="input"><option value="admin">Admin</option><option value="superadmin">Superadmin</option><option value="user">O'quvchi</option></select>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="btn-ghost" @click="createOpen = false">Bekor</button>
          <button class="btn-primary" :disabled="creating">Yaratish</button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>
