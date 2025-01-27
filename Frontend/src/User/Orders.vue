<template>
    <n-card>
        <b>Buyurtmalar</b>
        <div>


            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">



                <div class="relative overflow-x-auto mt-3 shadow-md sm:rounded-lg">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                        <thead class="text-xs text-gray-700 uppercase ">
                            <tr>
                                <th scope="col" class="px-6 text-center py-3 w-[40px]">
                                    №
                                </th>
                                <th scope="col" class="px-6 text-center py-3 bg-gray-50 ">
                                    Kitob
                                </th>
                                <th scope="col" class="text-center px-6 py-3">
                                    Soni
                                </th>
                                <th scope="col" class="px-6 py-3 text-center bg-gray-50 ">
                                    Narxi
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    Umumiy narx
                                </th>
                                <th scope="col" class="px-6 py-3 bg-gray-50 text-center">
                                    Tasdiqlash
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="user.orders.length > 0">
                            <tr v-for="(i, index) in user.orders" class="border-b border-gray-200 ">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                    {{ ++index }}
                                </th>
                                <th scope="row"
                                    class="px-6 text-center py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50  ">
                                    {{ i.name }}
                                </th>
                                <td class="px-6 py-4 text-center">
                                    <div class="flex items-center justify-center space-x-2">
                                        <button @click="decrement(index)"
                                            class="px-3 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300">
                                            -
                                        </button>
                                        <span class="px-4">{{ i.amount }}</span>
                                        <button @click="increment(index)"
                                            class="px-3 py-1 text-white bg-blue-500 rounded-lg hover:bg-blueblue-600 focus:outline-none focus:ring focus:ring-blueblue-300">
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td class="px-6 py-4 bg-gray-50 ">
                                    {{ i.price }}
                                </td>
                                <td class="w-[150px] text-center">
                                    {{ i.price * i.amount }}
                                </td>

                                <td class="px-6 py-4 w-[150px] bg-gray-50">
                                    <div class="flex mx-auto justify-center w-full space-x-4">
                                        <button @click="removeItem(index)"
                                            class="flex items-center text-center justify-center h-[40px] w-[40px] text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300">
                                            <i class="fas fa-trash text-center"></i>

                                        </button>

                                        <button @click='changeStatus({book_id : i.book_id, amount : i.amount}, index)' :disabled="i.amount <= 0" :class="[
                                            'flex items-center justify-center h-[40px] w-[40px] rounded-lg focus:outline-none focus:ring',
                                            i.amount > 0
                                                ? 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300'
                                                : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                                        ]">
                                            <i class="fas fa-check"></i>
                                        </button>

                                    </div>
                                </td>
                            </tr>

                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="6" class="text-center font-bold italic opacity-40 h-[40px] items-center">
                                    <span>Ma'lumotlar mavjud emas</span>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </div>


            </div>

        </div>
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
              @click="removeOrder(item.id)"
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
    </div></n-card>
</template>

<script setup>
import { User } from '../../Pinia';
import {useMessage} from "naive-ui"
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const orderData = ref({ item: 'Pizza', quantity: 2 })

let user = User();
const data = ref([]);
const message = useMessage();
const router = useRouter();
const web_url = window.web_url
const decrement = async (index) => {
    if (user.orders[index - 1].amount > 0) { user.orders[index - 1].amount--; }
}
const increment = async (index) => {
    user.orders[index - 1].amount++;

};
const removeItem = (index) => {
    user.orders.splice(index - 1, 1);
}
const callBackend = async () => {
    try {
        let res = await fetchUser('/book/getorder', 'GET', null, router);
        if (res.status == 200) {
            res = await res.json();
            data.value = res.reverse();
        }
    } catch (error) {
        console.log(error)
    }
};
const removeOrder = async (id)=>{
    try {
        let res = await fetchUser(`/book/deleteOrder/${id}`, "DELETE", {}, router);
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
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
};
const handleRefresh = () => {
    orderData.value = { item: 'Pasta', quantity: 3 }
};
const changeStatus = async (obj, index)=>{
    try {
       let res = await fetchUser('/book/addorder','POST',obj,router);
       if(res.status == 201){
        user.orders.splice(index - 1, 1);
        await callBackend();

        return message.info("Yuborildi, admin tomonidan ko'rib chiqiladi");
       } 
    } catch (error) {
        console.log(error)
    }
    
}

</script>

<style lang="scss" scoped></style>