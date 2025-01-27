<template>
    <div>
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
                                <th scope="col" class="px-6 py-3 bg-gray-50 ">
                                    Narxi
                                </th>
                                    <th scope="col" class="px-6 py-3 bg-gray-50 ">
                                        Umumiy narx
                                    </th>
                                <th scope="col" class="px-6 py-3">
                                    Tasdiqlash
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(i, index) in user.orders" class="border-b border-gray-200 ">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                   {{ ++index}}
                                </th>
                                <th scope="row"
                                    class="px-6 text-center py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50  ">
                                    {{i.name}}
                                </th>
                                <td class="px-6 py-4 text-center">
                                    <div class="flex items-center justify-center space-x-2">
            <button
              @click="decrement(index)"
              class="px-3 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
            >
              -
            </button>
            <span class="px-4">{{ i.amount }}</span>
            <button
              @click="increment(index)"
              class="px-3 py-1 text-white bg-blue-500 rounded-lg hover:bg-blueblue-600 focus:outline-none focus:ring focus:ring-blueblue-300"
            >
              +
            </button>
          </div>
                                </td>
                                <td class="px-6 py-4 bg-gray-50 ">
                                    {{i.price}}
                                </td>
                                <td class="w-[150px] text-center">
                                    {{ i.price * i.amount }}
                                </td>

                                <td class="px-6 py-4 w-[150px]">
                                    <div class="flex mx-auto justify-center w-full space-x-4">
                                        <button
                                        @click="removeItem(index)"
                                            class="flex items-center text-center justify-center h-[40px] w-[40px] text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300">
                                            <i class="fas fa-trash text-center"></i>

                                        </button>

                                        <button
                                            class="flex items-center justify-center h-[40px] w-[40px] text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300">
                                            <i class="fas fa-check"></i>

                                        </button>
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>


            </div>

        </div>
    </div>
</template>

<script setup>
import { User } from '../../Pinia';
import {ref, onMounted} from "vue";
let user = User();
const decrement = async (index)=>{
    if(user.orders[index].amount > 0)
    {user.orders[index].amount--;}
}
const increment = async (index)=>{
    user.orders[index].amount++;

};
const removeItem = (index)=>{
    user.orders.splice(index - 1, 1);
}  
</script>

<style lang="scss" scoped></style>