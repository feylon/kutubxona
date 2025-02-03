<template>
    <n-card>
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-semibold mb-4">Buyurtmalar</h1>
            <div class="max-w-[230px] p-4 bg-white flex flex-col gap-3 shadow-lg rounded-lg">
                <b>Statusni belgilang</b>
                <n-select
      v-model:value="filter"
      :options="statusFetchOptions"
      @update:value="fetchOrders"
      class="w-full p-2   rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    ></n-select>
  </div>
            <div class="flex justify-end mb-4 w-[300px]">
            </div>
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
                            <th class="border border-gray-300 w-[200px] py-2"> <n-select v-model:value="filter"
                                    :options="statusFetchOptions" @update:value="fetchOrders()"></n-select></th>
                            <th class="border border-gray-300 px-4 py-2">Miqdori</th>

                            <th class="border border-gray-300 px-4 py-2">Narxi</th>
                            <th class="border border-gray-300 px-4 py-2">Umumiy narx</th>
                            <th class="border border-gray-300 px-4 py-2">Murojaat qilingan vaqt</th>
                            <!-- <th class="border border-gray-300 px-4 py-2 w-[100px]">O'zgartirish</th> -->

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

                            <!-- <td class="border border-gray-300 px-4 py-2 w-[130px]">
                                <n-select :value="order.status" :options="statusOptions"
                                    @update:value="changeStatus(order.order_id, $event)" class="w-full">
                                </n-select>
                            </td> -->

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
const filter = ref("*");
const router = useRouter();

const fetchOrders = async () => {
    loading.value = true;
    if (filter.value == "*") {
        try {
            let response = await fetchSuperAdmin(`/superadmin/getorder?page=${pagination.value.page}&limit=${pagination.value.limit}`, "GET", null, router);

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
        return null;
    }
    {
        try {
            let response = await fetchSuperAdmin(`/superadmin/getOrdersByCondition?page=${pagination.value.page}&limit=${pagination.value.limit}&status=${filter.value}`, "GET", null, router);

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
        return null;
    }
};

onMounted(async () => await fetchOrders());


const statusOptions = [
    { label: 'Kutilmoqda', value: 'pending' },
    { label: 'Yetkazib berildi', value: 'accepted' },
    { label: 'Bekor qilindi', value: 'rejected' }
];
const statusFetchOptions = [
    { label: 'Hammasi', value: '*' },

    { label: 'Kutilmoqda', value: 'pending' },
    { label: 'Yetkazib berildi', value: 'accepted' },
    { label: 'Bekor qilindi', value: 'rejected' }
];
const changeStatus = async (order_id, status) => {
    if (status == 'accepted') {
        try {
            let response = await fetchSuperAdmin(`/superadmin/editOrder/${order_id}`, "PUT", { status }, router);
            if (response.status == 200) {
                message.success("Status o'zgartirildi");
                await fetchOrders();
            }
            if (response.status == 400) {
                response = await response.json();
                await fetchOrders();

                message.error(response.error);
            }
            else {
                console.error("Error changing status:", response);
            }
        } catch (error) {
            console.error("Error changing status:", error);
        }
        return null;
    }
    if (status == 'rejected') {
        try {
            let response = await fetchAdmin(`/changeorder/${order_id}/rejected`, "PUT", { status }, router);
            if (response.status == 200) {
                message.success("Status o'zgartirildi");
                await fetchOrders();
            } if (response.status == 400) {
                response = await response.json();
                await fetchOrders();

                message.error(response.error);
            }

            else {
                console.error("Error changing status:", response);
            }
        } catch (error) {
            console.error("Error changing status:", error);
        }
        return null;
    }
    if (status == 'pending') {
        try {
            let response = await fetchAdmin(`/changeorder/${order_id}/pending`, "PUT", { status }, router);
            if (response.status == 200) {
                message.success("Status o'zgartirildi");
                await fetchOrders();
            } if (response.status == 400) {
                response = await response.json();
                await fetchOrders();

                message.error(response.error);
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
