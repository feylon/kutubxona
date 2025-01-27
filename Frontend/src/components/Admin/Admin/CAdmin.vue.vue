<template>
    <n-card title="  Admin qo'shish" bordered class="font-bold w-[90%] mx-auto bg-white text-[20px]">

        <div class="w-full flex flex-col">
            <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>№</th>
        <th>FISH</th>
        <th>Username</th>
        <th>Status</th>
        <th>Yaratilgan vaqt</th>
        <th>Tahrirlash</th>
      </tr>
    </thead>
    <tbody>
      <tr  v-if="data.length > 0" v-for="(i, j) in data" :key = "i.id">
          <td>{{++ j}}</td>
        <td>{{i.fullname}}</td>
        <td class="font-extralight">{{i.username}}</td>
        <td class="font-extralight"><n-switch v-model:value="i.status"  :checked-value="true" :unchecked-value="false" /></td>
        <td class="font-extralight">{{new Date(i.created_at).toLocaleString()}}</td>
        <td> <n-button @click="router.push(`/superadmin/edit/${i.id}/${i.fullname}/${i.username}`)"><fonta :icon="['fas', 'pen']"/></n-button></td>
      </tr>
      <tr v-else>
        <td colspan="6">
            <div class="w-full flex justify-center items-center opacity-25">
                <i>
                    <fonta :icon="['fas', 'triangle-exclamation']" />         Ma'lumot mavjud emas

                </i>
            </div>
        </td>
      </tr>
    </tbody>
  </n-table>
<div class="flex justify-end mt-4">
    <n-button @click="router.push('/superadmin/addadmin')" type="success">Admin qo'shish</n-button>

</div>
</div>
    </n-card>


</template>

<script setup>
import { useRouter } from 'vue-router';
import {ref, onMounted} from "vue";
let router = useRouter();
const data = ref([]);
let backend = async()=>{
try {
    const data1 = await fetchSuperAdmin('/superadmin/admin/getadmin', "GET", null, router);
    console.log(data1.status)
    if(data1.status == 200){
        let datas = await data1.json();
        data.value = datas;
        console.log(data.value)
    }
} catch (error) {
    
}
};
onMounted(async ()=>{
await backend();
})
</script>

<style lang="scss" scoped></style>