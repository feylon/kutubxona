<template><n-button @click="router.go(-1)" type="success">
  <fonta :icon="['fas', 'arrow-left']" />
</n-button>
  <n-card title="Tahrirlash" bordered>
    <n-form ref="form" :model="formData" :rules="rules" label-placement="left" label-width="120px">
      <n-form-item label="Kategoriya nomi" path="name">
        <n-input v-model:value="formData.name" placeholder="Kategoriya nomini kiriting" />
      </n-form-item>
      <n-form-item class="w-full justify-end mb-3 flex">
        <n-button type="primary" @click="submitForm">Yangilash</n-button>
      </n-form-item>
    </n-form>
    <n-alert v-if="responseMessage" :type="responseType" closable>
      {{ responseMessage }}
    </n-alert>
  </n-card>
</template>

<script setup>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
console.log(route.params)
const { name, id } = route.params
const formData = ref({
  id: id,
  name: name,
});

const rules = {
  name: { required: true, message: 'Category name is required', trigger: 'blur' },
};

const responseMessage = ref('');
const responseType = ref('success');
const message = useMessage();

const submitForm = async () => {
  try {
    let res = await fetchSuperAdmin('/superadmin/BookCategory/EditBookCategory', 'PATCH', formData.value, router);
    console.log(res.status)
    if(res.status == 400){
      res = await res.json();
      console.log(res);
      throw new Error(res.error);

    }
    if (!res.ok) {
      throw new Error("Kitob toifasini yangilashda xatolik yuz berdi");
    }

    responseMessage.value = "Kitob toifasi muvaffaqiyatli yangilandi";
    responseType.value = 'success';
    message.success("Kitob toifasi muvaffaqiyatli yangilandi");
  } catch (error) {
    responseMessage.value = error.message;
    responseType.value = 'error';
    message.error("Kitob toifasini yangilab bo'lmadi");
  }
};
</script>

<style scoped>
.n-card {
  max-width: 600px;
  margin: 50px auto;
}
</style>