<template>
   <n-card>
    <div class="container mx-auto p-6">
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
                <th scope="col" class="px-6 py-3">
                    To'liq ismi
                </th>
                <th scope="col" class="px-6 py-3">
                    Username
                </th>
                <th scope="col" class="px-6 py-3">
                   Status
                </th>
                <th scope="col" class="px-6 py-3">
                    Ro'yxatdan o'tgan kun
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="i in users" class="bg-white border-b   border-gray-200 hover:bg-gray-50 ">
                
                <th  scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap ">
                    <img class="w-10 h-10 rounded-full" src="../../assets/user.png" alt="Jese image">
                    <div class="ps-3">
                        <div class="text-base font-semibold">{{i.fullname}}</div>
                    </div>  
                </th>
                <td class="px-6 py-4">
                   {{i.username}}
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <div class="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div> Active
                    </div>
                </td>
                <td class="px-6 py-4">
                    {{ new Date(i.created_at).toLocaleDateString() }}                </td>
            </tr>
            
        </tbody>
    </table>
      </div>
  
      <!-- Pagination -->
      <div class="mt-4 flex justify-center">
        <n-pagination
          v-model:page="page"
          :page-count="totalPages"
          :page-size="limit"
          @update:page="callBackend"
        />
      </div>
    </div>
   </n-card>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import {useRouter} from "vue-router";
  const router = useRouter();
  const users = ref([]);
  const page = ref(1); 
  const totalPages = ref(0); 
  const limit = 10; 
  
  const callBackend = async () => {
    const URL = `http://localhost:4100/api/admin`;
    try {
      const response = await fetchAdmin(`/getusers?page=${page.value}&limit=${limit}`, "GET", null, router);
      const data = await response.json();
      users.value = data.data;
      totalPages.value = data.pagination.totalPages;
      console.log(users.value);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  onMounted(() => {
    callBackend();
  });
  </script>
  
 
  