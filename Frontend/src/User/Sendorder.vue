<template>
    <div class="mt-5">
        <b>Yuborilgan buyurtmalar</b>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg overflow-x-auto mt-3">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3">Rasm</th>
                        <th scope="col" class="px-6 py-3">Nomi</th>
                        <th scope="col" class="px-6 py-3">Narxi</th>
                        <th scope="col" class="px-6 py-3">Buyurtma soni</th>
                        <th scope="col" class="px-6 py-3">Status</th>
                        <th scope="col" class="px-6 py-3">Yuborilgan vaqt</th>
                        <th scope="col" class="px-6 py-3">#</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in data" :key="item.id" class="bg-white border-b hover:bg-gray-50">
                        <td class="px-6 py-4">
                            <img :src="web_url + item.picture" alt="Book Image"
                                class="w-12 h-12 object-cover rounded" />
                        </td>
                        <td class="px-6 py-4 font-medium text-gray-900">{{ item.name }}</td>
                        <td class="px-6 py-4">${{ item.price }}</td>
                        <td class="px-6 py-4">{{ item.amount }}</td>
                        <td class="px-6 py-4">
                            <span class="bg-yellow-500 text-white gap-3 rounded-md p-2" v-if="item.status == 'pending'"> <i class="fa-solid fa-clock me-3"></i>Kutilmoqda</span>
                            <span class="bg-green-500 text-white gap-3 rounded-md p-2" v-if="item.status == 'accepted'"> <i class="fas fa-check me-3"></i>Yetgazib berildi</span>
                            <span class="bg-red-500 text-white gap-3 rounded-md p-2" v-if="item.status == 'rejected'"> <i class="fas fa-check me-3"></i>Bekor qilindi</span>

                        </td>
                        <td class="px-6 py-4">{{ formatDate(item.created_at) }}</td>

                        <td class="px-6 py-4 flex gap-4">
                            <button
              :disabled="item.status != 'pending'"
              @click="removeItem(item.id)"
              class="flex items-center justify-center h-[40px] w-[40px] text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50"
            >
              <i class="fas fa-trash"></i>
            </button>

                            <button v-if="false"
                                class="p-3 text-sm  text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
                                :disabled="item.accept" @click="acceptItem(item.id)">
                                <i class="fas fa-pen"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { User } from '../../Pinia';
defineProps({
  orderData: Object
});
const user = User();
const router = useRouter();
const message = useMessage();
const data = ref([]);
const web_url = window.web_url
const callBackend = async () => {
    try {
        let res = await fetchUser('/book/getorder', 'GET', null, router);
        console.log(res.status);
        if (res.status == 200) {
            res = await res.json();
            data.value = res.reverse();
            console.log(data.value)
        }
    } catch (error) {
        console.log(error)
    }
};
const removeItem = async (id)=>{
    console.log(id);
    try {
        let res = await fetchUser(`/book/deleteOrder/${id}`, "DELETE", {}, router);
        console.log(res.status);
        if(res.status == 400){
            res = await res.json();
            message.error(res.error);   
        }
        callBackend();
    } catch (error) {
        console.log(error)
    }
}
onMounted(async () => callBackend());
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};
setInterval(() => {
    user.UpdateOrder = !user.UpdateOrder;
}, 3000);
watch(user.UpdateOrder, ()=>{
    console.log(1)
})
</script>

<style lang="scss" scoped></style>