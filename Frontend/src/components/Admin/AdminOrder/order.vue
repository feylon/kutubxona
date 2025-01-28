<template>
    <n-card>
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-semibold mb-4">Buyurtmalar</h1>

            <div v-if="loading" class="flex justify-center items-center h-20">
                <span class="text-lg">Yuklanmoqda...</span>
            </div>

            <div v-else class="overflow-x-auto">
                <table class="table-auto w-full w-min-[1300px] border-collapse border border-gray-200 rounded-lg">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="border border-gray-300 px-4 py-2">Kitob nomi</th>
                            <th class="border border-gray-300 px-4 py-2">Buyurtmachi</th>
                            <th class="border border-gray-300 px-4 py-2">Kitoblar soni</th>
                            <th class="border border-gray-300 w-[200px] py-2">Status</th>
                            <th class="border border-gray-300 px-4 py-2">Miqdori</th>

                            <th class="border border-gray-300 px-4 py-2">Narxi</th>
                            <th class="border border-gray-300 px-4 py-2">Umumiy narx</th>
                            <th class="border border-gray-300 px-4 py-2">Murojaat qilingan vaqt</th>
                            <!-- <th class="border border-gray-300 px-4 py-2">Qabul qilish</th> -->
                            <th class="border border-gray-300 px-4 py-2 w-[100px]">O'zgartirish</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in orders" :key="order.order_id" class="hover:bg-gray-50">
                            <td class="border border-gray-300 text-bold px-4 py-2">{{ order.name }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ order.fullname }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ order.asbook_count }} ta</td>
                            <td class="px-6 border py-4">
                                <span class="bg-yellow-500 text-white gap-3 rounded-md p-2"
                                    v-if="order.status == 'pending'"> <i
                                        class="fa-solid fa-clock me-3"></i>Kutilmoqda</span>
                                <span class="bg-green-500 text-white gap-3 rounded-md p-2"
                                    v-if="order.status == 'accepted'"> <i class="fas fa-check me-3"></i>Yetgazib
                                    berildi</span>
                                <span class="bg-red-500 text-white gap-3 rounded-md p-2"
                                    v-if="order.status == 'rejected'">
                                    <i class="fas fa-check me-3"></i>Bekor qilindi</span>

                            </td>
                            <td class="border border-gray-300 px-4 py-2">{{ order.amount }}</td>
                            <td class="border border-gray-300 px-4 py-2">{{ order.price }} so'm</td>
                            <td class="border border-gray-300 px-4 py-2">{{ order.summ }} so'm</td>
                            <td class="border border-gray-300 px-4 py-2">
                                {{ new Date(order.created_at).toLocaleString() }}
                            </td>
                            <!-- <td class="border border-gray-300 px-4 py-2 flex items-center justify-center">
                            <button  @click="changeStatus(order.order_id, order.status)"
                                :disabled="order.status != 'pending'"
                                class="text-white p-3 rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                <i class="fas fa-check"></i>
                            </button>
                        </td> -->
                            <td class="border border-gray-300 px-4 py-2 w-[130px]">
                                <n-select v-model="order.status" :options="statusOptions"
                                    @update:value="changeStatus(order.order_id, $event)" class="w-full">
                                </n-select>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="mt-4 flex justify-center">
                <n-pagination v-model:page="pagination.page" :page-count="pagination.totalPages"
                    @update:page="fetchOrders" class="text-gray-600" />
            </div>
        </div>
    </n-card>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
const message = useMessage();
const orders = ref([]);
const pagination = ref({ page: 1, limit: 10, totalPages: 1 });
const loading = ref(false);
const router = useRouter();

const fetchOrders = async () => {
    loading.value = true;
    try {
        let response = await fetchAdmin(`/getorder?page=${pagination.value.page}&limit=${pagination.value.limit}`, "GET", null, router);

        if (response.status == 200) {
            response = await response.json();
            orders.value = response.data;
            pagination.value = response.pagination;
        } else {
            console.error("Error fetching orders:", response);
        };
    } catch (error) {
        console.error("Error fetching orders:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => await fetchOrders());


const statusOptions = [
    { label: 'Kutilmoqda', value: 'pending' },
    { label: 'Yetkazib berildi', value: 'accepted' },
    { label: 'Bekor qilindi', value: 'rejected' }
];
const changeStatus = async (order_id, status) => {
    console.log(status);
    if (status == 'accepted') {
        try {
            let response = await fetchAdmin(`/editOrder/${order_id}`, "PUT", { status }, router);
            if (response.status == 200) {
                message.success("Status o'zgartirildi");
                await fetchOrders();
            } else {
                console.error("Error changing status:", response);
            }
        } catch (error) {
            console.error("Error changing status:", error);
        }
    }
    if (status == 'rejected') {
        try {
            let response = await fetchAdmin(`/editOrder/${order_id}`, "PUT", { status }, router);
            if (response.status == 200) {
                message.success("Status o'zgartirildi");
                await fetchOrders();
            } else {
                console.error("Error changing status:", response);
            }
        } catch (error) {
            console.error("Error changing status:", error);
        }
    }
};
</script>

<style></style>
