<template>
    <n-card title="Edit Book Category" bordered>
      <n-form ref="form" :model="formData" :rules="rules" label-placement="left" label-width="120px">
        <n-form-item label="Category Name" path="name">
          <n-input v-model:value="formData.name" placeholder="Enter category name" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="submitForm">Update</n-button>
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
  import { useRoute } from 'vue-router';
  const route = useRoute();
  console.log(route.params)
  const {name, id} = route.params
  const formData = ref({
    id: id, // Replace with the dynamic ID if needed
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
      const response = await fetch('http://localhost:4100/api/superadmin/BookCategory/EditBookCategory', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ5YTI0ZGVjLThjZjgtNDZhNy1hN2VhLWMyOTI3ZDQ2ZmQ5ZCIsImlhdCI6MTczNzQ2MjAxOSwiZXhwIjoxNzM3NDc2NDE5fQ.WoYvsUbJX6LFNLcZIuPMJTSgVDv0bTRzxutP48Ik1A4`,
        },
        body: JSON.stringify(formData.value),
      });
  
      if (!response.ok) {
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
  