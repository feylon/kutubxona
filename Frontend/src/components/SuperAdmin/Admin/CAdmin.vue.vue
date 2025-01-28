<template>
  <n-card title="  Admin qo'shish" bordered class="font-bold w-[90%] mx-auto bg-white text-[20px]">

    <div class="w-full flex flex-col">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 " :bordered="false" :single-line="false">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50  ">
          <tr>
            <th class="px-6 py-3">№</th>
            <th class="px-6 py-3">FISH</th>
            <th class="px-6 py-3">Username</th>
            <th class="px-6 py-3">Status</th>
            <th class="px-6 py-3">Yaratilgan vaqt</th>
            <th class="px-6 py-3">Tahrirlash</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white border-b   border-gray-200 hover:bg-gray-50 " v-if="data.length > 0"
            v-for="(i, j) in data" :key="i.id">
            <th class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap ">{{ j + 1 }}</th>
            <th scope="row" class="px-6 py-4 text-gray-900 whitespace-nowrap ">
             <div class="flex  justify-start items-center  w-full"> <img class="w-10 h-10 rounded-full" src="../../../assets/user.png" alt="Jese image">
              <div class="ps-3">
                <div class="text-base font-semibold">{{ i.fullname }}</div>
              </div></div>
            </th>
            <td class="px-6 py-4 font-extralight">{{ i.username }}</td>
            <td class="px-6 py-4 font-extralight"><n-switch v-model:value="i.status" @change="change(i.id, j)"
                :checked-value="true" :unchecked-value="false" /></td>
            <td class="px-6 py-4 font-extralight">{{ new Date(i.created_at).toLocaleString() }}</td>
            <td> <n-button @click="router.push(`/superadmin/edit/${i.id}/${i.fullname}/${i.username}`)">
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
      </table>
      <div class="flex justify-end mt-4">
        <n-button @click="router.push('/superadmin/addadmin')" type="success">Admin qo'shish</n-button>

      </div>
    </div>
  </n-card>


</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from "vue";
let router = useRouter();
const data = ref([]);
let backend = async () => {
  try {
    const data1 = await fetchSuperAdmin('/superadmin/admin/getadmin', "GET", null, router);
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
const change = (id, index) => {
  let status = data.value[index].status;
  let data1 = {
    status: status
  }
  fetchSuperAdmin(`/superadmin/admin/changestatus/${id}`, "POST", data1, router);

}

</script>

<style lang="scss" scoped></style>