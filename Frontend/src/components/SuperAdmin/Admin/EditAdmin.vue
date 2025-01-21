<template>
    <n-button @click="router.go(-1)" type="success">
        <fonta :icon="['fas', 'arrow-left']" />
    </n-button>
    <n-card title="Tahrirlash" bordered>
      <n-form ref="form" :model="formData" :rules="rules" label-placement="left" label-width="120px">
        <n-form-item label="To'liq ismi" path="fullname">
          <n-input v-model:value="formData.fullname" placeholder="Enter full name" />
        </n-form-item>
        <n-form-item label="Username" path="username">
          <n-input v-model:value="formData.username" placeholder="Enter username" />
        </n-form-item>
        <n-form-item class="w-full flex justify-end mb-1">
          <n-button type="primary" @click="submitForm">Saqlash</n-button>
        </n-form-item>
      </n-form>
      <n-alert v-if="responseMessage" :type="responseType" closable>
        {{ responseMessage }}
      </n-alert>
    </n-card>
  </template>
  
  <script setup>
  import {useRoute, useRouter} from "vue-router"
  import { ref } from 'vue';
  import { useMessage } from 'naive-ui';
  const router = useRouter();
  const route = useRoute();
  console.log(route.params);
  const {id, fullname, username} = route.params;
  const formData = ref({
    fullname: fullname,
    username: username,
  });
  
  const rules = {
    fullname: { required: true, message: 'Full name is required', trigger: 'blur' },
    username: { required: true, message: 'Username is required', trigger: 'blur' },
  };
  
  const responseMessage = ref('');
  const responseType = ref('success');
  const message = useMessage();
  
  const adminId = username;
  
  const submitForm = async () => {
    try {
      let res = await fetchSuperAdmin('/superadmin/editadmin/'+ id, "PATCH", formData.value, router);
  
      if (!res.ok) {
        res = await res.json();
        console.log(res)
        throw new Error(res.error);
      }
  
      responseMessage.value = "Admin ma'lumotlari muvaffaqiyatli yangilandi";
      responseType.value = 'success';
      message.success("Admin ma'lumotlari muvaffaqiyatli yangilandi");
      router.go(-1)
    } catch (error) {
      responseMessage.value = error.message;
      responseType.value = 'error';
      message.error("Admin ma'lumotlarini yangilab bo'lmadi");
    }
  };
  </script>
  
  <style scoped>
  .n-card {
    max-width: 600px;
    margin: 50px auto;
  }
  </style>
  