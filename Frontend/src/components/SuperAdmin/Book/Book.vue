<template>
    <n-card title="Kitob kategoriyalari" bordered class="font-bold w-[90%] mx-auto bg-white text-[20px]">

        <div class="w-full flex flex-col">
            <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>№</th>
        <th>Name</th>
        
        <th>Tahrirlash</th>
      </tr>
    </thead>
    <tbody>
      <tr  v-if="data.length > 0" v-for="(i, j) in data" :key = "i.id">
          <td>{{++ j}}</td>
          <td class="font-bold">{{i.name}}</td>
       
        <td> <n-button @click="router.push(`/superadmin/addbookCategory/${i.id}/${i.name}`)"><fonta :icon="['fas', 'pen']"/></n-button></td>
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
    <n-button @click="router.push('/superadmin/addadmin')" type="success">Kategoriya qo'shish</n-button>

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
    const data1 = await fetchSuperAdmin('/superadmin/BookCategory/GetAllBookCategories', "GET", null, router);
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