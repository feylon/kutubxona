<template>
 <div class="h-full">
  
  <n-card title="Kitob kategoriyalari" bordered class="font-bold w-[90%] mx-auto bg-white text-[20px]">
    <div class="flex justify-end mb-4">
  <n-button @click="showModal = true" type="success">Kategoriya qo'shish</n-button>

</div>
<div class="w-full overflow-x-auto flex flex-col">
  <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>№</th>
        <th>Nomi</th>

        <th>Tahrirlash</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="data.length > 0" v-for="(i, j) in data" :key="i.id">
        <td>{{++j }}</td>
        <td class="font-bold capitalize">{{ i.name }}</td>

        <td> <n-button @click="router.push(`/superadmin/addbookCategory/${i.id}/${i.name}`)">
            <fonta :icon="['fas', 'pen']" />
          </n-button></td>
      </tr>
      <tr v-else>
        <td colspan="6">
          <div class="w-full flex justify-center items-center opacity-25">
            <i>
              <fonta :icon="['fas', 'triangle-exclamation']" /> Ma'lumot mavjud emas

            </i>
          </div>
        </td>
      </tr>
    </tbody>
  </n-table>
</div>

</n-card>


 </div>

  <n-modal v-model:show="showModal" class="custom-card" preset="card" :style="{ width: '600px' }" title="Kategoriya"
    :bordered="false" size="large" :segmented="true">

    <n-form ref="form" :model="formData" :rules="rules" label-placement="left" label-width="120px">
      <n-form-item label="Kategoriya nomi" path="name">
        <n-input v-model:value="formData.name" placeholder="Kategoriyani kiriting" />
      </n-form-item>
      <n-space justify="end">
        <n-button @click="closeModal">Bekor qilish</n-button>
        <n-button type="primary" @click="submitForm">Kiritish</n-button>
      </n-space>
    </n-form>
    <template #footer>
      <n-button type="error" @click="closeModal">Yopish</n-button>
    </template>
  </n-modal>
  <n-alert v-if="responseMessage" :type="responseType" closable>
    {{ responseMessage }}
  </n-alert>

</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from "vue";
import { useMessage } from 'naive-ui';
let router = useRouter();
const data = ref([]);
let backend = async () => {
  try {
    const data1 = await fetchSuperAdmin('/superadmin/BookCategory/GetAllBookCategories', "GET", null, router);
    console.log(data1.status)
    if (data1.status == 200) {
      let datas = await data1.json();
      data.value = datas;
      console.log(data.value)
    }
  } catch (error) {

  }
};
onMounted(async () => {
  await backend();
});


const showModal = ref(false);
const formData = ref({ name: '' });
const rules = {
  name: { required: true, message: 'Maydonni kiriting', trigger: 'blur' },
};
const responseMessage = ref('');
const responseType = ref('success');
const message = useMessage();

const closeModal = () => {
  showModal.value = false;
  formData.value = { name: '' };
};

const submitForm = async () => {
  try {
    let res = await fetchSuperAdmin('/superadmin/BookCategory/AddBookCategory', "POST", formData.value, router)
    console.log(res.status)
    if (res.status === 400) {
      res = await res.json();
      console.log(res)
      return message.error(res.error)
    }

    message.success("Kategoriya muvaffaqiyatli qo'shildi");
    closeModal();
    await backend();
    return null;
  } catch (error) {
    responseMessage.value = error.message;
    responseType.value = 'error';
    message.error("Kategoriya qo'shib bo'lmadi");
  }
};
</script>

<style lang="scss" scoped>
.custom-card {
  max-width: 600px;
  margin: 20px auto;
}
</style>