<script setup>
/** Kitob yaratish/tahrirlash modali: ma'lumotlar + muqova + PDF */
import { reactive, ref, watch, computed } from "vue";
import { booksApi } from "../../api/index.js";
import { useToastStore } from "../../stores/toast.js";
import BaseModal from "../../components/BaseModal.vue";

const props = defineProps({ open: Boolean, book: Object, categories: { type: Array, default: () => [] } });
const emit = defineEmits(["close", "saved"]);
const toast = useToastStore();

const blank = () => ({ title: "", author: "", description: "", year: null, pages: null, price: 0, amount: 0, status: true, categoryId: "" });
const form = reactive(blank());
const errors = ref({});
const saving = ref(false);
const coverFile = ref(null);
const pdfFile = ref(null);
const coverPreview = ref(null);
const isEdit = computed(() => Boolean(props.book));

watch(
  () => props.open,
  (open) => {
    if (!open) return;
    Object.assign(form, blank(), props.book ? {
      title: props.book.title, author: props.book.author, description: props.book.description, year: props.book.year,
      pages: props.book.pages, price: Number(props.book.price), amount: props.book.amount, status: props.book.status, categoryId: props.book.categoryId,
    } : {});
    errors.value = {};
    coverFile.value = pdfFile.value = null;
    coverPreview.value = props.book?.coverUrl ?? null;
  },
);

const pickCover = (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  coverFile.value = f;
  coverPreview.value = URL.createObjectURL(f);
};
const pickPdf = (e) => (pdfFile.value = e.target.files?.[0] ?? null);

const submit = async () => {
  saving.value = true;
  errors.value = {};
  try {
    const payload = { ...form, year: form.year || null, pages: form.pages || null };
    let book = isEdit.value ? await booksApi.update(props.book.id, payload) : await booksApi.create(payload);
    if (coverFile.value) book = await booksApi.uploadCover(book.id, coverFile.value);
    if (pdfFile.value) book = await booksApi.uploadFile(book.id, pdfFile.value);
    toast.success(isEdit.value ? "Kitob yangilandi" : "Kitob qo'shildi");
    emit("saved", book);
    emit("close");
  } catch (e) {
    errors.value = e.fieldErrors ?? {};
    toast.error(e.message);
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <BaseModal :open="open" :title="isEdit ? 'Kitobni tahrirlash' : 'Yangi kitob'" size="lg" @close="emit('close')">
    <form class="grid gap-4 sm:grid-cols-[160px_1fr]" @submit.prevent="submit">
      <div class="space-y-3">
        <label class="block cursor-pointer">
          <span class="label">Muqova</span>
          <div class="relative aspect-[2/3] overflow-hidden rounded-xl border-2 border-dashed border-line bg-white/60 transition hover:border-ink">
            <img v-if="coverPreview" :src="coverPreview" class="size-full object-cover" alt="" />
            <span v-else class="grid size-full place-items-center text-center text-xs text-muted">Rasm tanlang<br />(jpg, png, webp)</span>
          </div>
          <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" @change="pickCover" />
        </label>
        <label class="block cursor-pointer">
          <span class="label">PDF fayl</span>
          <div class="rounded-xl border-2 border-dashed border-line bg-white/60 px-3 py-3 text-center text-xs transition hover:border-ink">
            <span v-if="pdfFile" class="font-semibold text-ink">{{ pdfFile.name }}</span>
            <span v-else-if="book?.fileUrl" class="text-emerald-700">✓ PDF yuklangan<br /><span class="text-muted">almashtirish uchun bosing</span></span>
            <span v-else class="text-muted">PDF tanlang (50 MB gacha)</span>
          </div>
          <input type="file" accept="application/pdf" class="sr-only" @change="pickPdf" />
        </label>
      </div>

      <div class="space-y-3">
        <div>
          <label class="label">Nomi</label>
          <input v-model.trim="form.title" class="input" required minlength="2" />
          <p v-if="errors.title" class="mt-1 text-xs text-red-600">{{ errors.title }}</p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div><label class="label">Muallif</label><input v-model.trim="form.author" class="input" required minlength="2" /></div>
          <div>
            <label class="label">Kategoriya</label>
            <select v-model="form.categoryId" class="input" required>
              <option value="" disabled>Tanlang…</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
            <p v-if="errors.categoryId" class="mt-1 text-xs text-red-600">{{ errors.categoryId }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div><label class="label">Yil</label><input v-model.number="form.year" type="number" min="800" max="2100" class="input" /></div>
          <div><label class="label">Sahifa</label><input v-model.number="form.pages" type="number" min="1" class="input" /></div>
          <div><label class="label">Narx (so'm)</label><input v-model.number="form.price" type="number" min="0" step="100" class="input" required /></div>
          <div><label class="label">Omborda</label><input v-model.number="form.amount" type="number" min="0" class="input" required /></div>
        </div>
        <div><label class="label">Tavsif</label><textarea v-model.trim="form.description" rows="4" class="input" maxlength="5000" /></div>
        <label class="flex cursor-pointer items-center gap-2 text-sm">
          <input v-model="form.status" type="checkbox" class="size-4 accent-accent" /> Saytda ko'rsatilsin (faol)
        </label>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="btn-ghost" @click="emit('close')">Bekor</button>
          <button class="btn-primary" :disabled="saving">{{ saving ? "Saqlanmoqda…" : "Saqlash" }}</button>
        </div>
      </div>
    </form>
  </BaseModal>
</template>
