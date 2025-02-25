<script setup>
import { ref, onMounted } from "vue";
import { categoriesApi } from "../../api/index.js";
import { useToastStore } from "../../stores/toast.js";

const toast = useToastStore();
const items = ref([]);
const name = ref("");
const editingId = ref(null);
const editName = ref("");
const busy = ref(false);

const load = async () => (items.value = (await categoriesApi.list()).items);
onMounted(load);

const add = async () => {
  if (!name.value.trim()) return;
  busy.value = true;
  try {
    await categoriesApi.create({ name: name.value });
    name.value = "";
    toast.success("Kategoriya qo'shildi");
    await load();
  } catch (e) {
    toast.error(e.message);
  } finally {
    busy.value = false;
  }
};

const startEdit = (c) => { editingId.value = c.id; editName.value = c.name; };
const saveEdit = async (c) => {
  try {
    await categoriesApi.update(c.id, { name: editName.value });
    editingId.value = null;
    toast.success("Saqlandi");
    await load();
  } catch (e) {
    toast.error(e.message);
  }
};
const remove = async (c) => {
  if (!confirm(`"${c.name}" kategoriyasini o'chirasizmi?`)) return;
  try {
    await categoriesApi.remove(c.id);
    toast.success("O'chirildi");
    await load();
  } catch (e) {
    toast.error(e.message);
  }
};
</script>

<template>
  <div class="max-w-3xl space-y-5">
    <form class="card flex gap-2 p-4" @submit.prevent="add">
      <input v-model="name" class="input" placeholder="Yangi kategoriya nomi…" minlength="2" required />
      <button class="btn-accent shrink-0" :disabled="busy">Qo'shish</button>
    </form>

    <div class="card divide-y divide-line">
      <div v-for="c in items" :key="c.id" class="flex items-center gap-3 px-4 py-3">
        <template v-if="editingId === c.id">
          <input v-model="editName" class="input" @keydown.enter.prevent="saveEdit(c)" @keydown.esc="editingId = null" />
          <button class="btn-primary btn-sm" @click="saveEdit(c)">Saqlash</button>
          <button class="btn-ghost btn-sm" @click="editingId = null">Bekor</button>
        </template>
        <template v-else>
          <div class="min-w-0 flex-1">
            <p class="font-semibold">{{ c.name }}</p>
            <p class="text-xs text-muted">/{{ c.slug }} · {{ c.bookCount }} ta kitob</p>
          </div>
          <button class="btn-ghost btn-sm" @click="startEdit(c)">Tahrirlash</button>
          <button class="btn-ghost btn-sm text-red-700 hover:bg-red-50" :disabled="Number(c.bookCount) > 0" :title="Number(c.bookCount) > 0 ? 'Kitoblari bor' : ''" @click="remove(c)">O'chirish</button>
        </template>
      </div>
      <p v-if="!items.length" class="px-4 py-10 text-center text-sm text-muted">Hali kategoriyalar yo'q</p>
    </div>
  </div>
</template>
