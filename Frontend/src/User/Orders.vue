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
    <Sendorder :orderData="orderData"/>
    </n-card>
</template>

<script setup>
import { User } from '../../Pinia';
import {useMessage} from "naive-ui"
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Sendorder from './Sendorder.vue';
const orderData = ref({ item: 'Pizza', quantity: 2 })

let user = User();
const message = useMessage();
const router = useRouter();
const decrement = async (index) => {
    if (user.orders[index - 1].amount > 0) { user.orders[index - 1].amount--; }
}
const increment = async (index) => {
    user.orders[index - 1].amount++;

};
const removeItem = (index) => {
    user.orders.splice(index - 1, 1);
}
onMounted(() => {

});
const handleRefresh = () => {
    orderData.value = { item: 'Pasta', quantity: 3 }
};
const changeStatus = async (obj, index)=>{
    console.log(obj);
    try {
       let res = await fetchUser('/book/addorder','POST',obj,router);
       if(res.status == 201){
        user.orders.splice(index - 1, 1);
        handleRefresh();
        return message.info("Yuborildi, admin tomonidan ko'rib chiqiladi");
       } 
    } catch (error) {
        console.log(error)
    }
    
}

</script>

<style lang="scss" scoped></style>