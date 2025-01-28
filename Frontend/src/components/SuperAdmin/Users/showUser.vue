<template>
    <n-card>
        <div class="p-4 w-full gap-3 justify-center">
            <n-data-table :columns="columns" :data="users" :loading="loading"
                class="shadow-sm  rounded-lg overflow-hidden" />

            <n-pagination v-model:page="pagination.page" :page-count="pagination.totalPages"
                :page-size="pagination.limit" @update:page="handlePageChange" @update:page-size="handlePageSizeChange"
                class="mt-4 mx-auto" />
        </div>
    </n-card>
</template>

<script setup>
import { ref, h, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { NDataTable, NPagination } from 'naive-ui';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

const users = ref([]);
const router = useRouter();
const message = useMessage();
const loading = ref(false);

const pagination = ref({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 1,
});

const columns = [
    {
        title: '№',
        key: 'index',
    },
    {
        title: 'To`liq ismi',
        key: 'fullname',
    },
    {
        title: 'Username',
        key: 'username',
    },
    {
        title: 'Ro`yxatdan o`tgan sana',
        key: 'created_at',
        render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
        title: 'Qabul qilgan kitoblari soni',
        key: 'total_amount',
        render: (row) => h(
            'span',
            { class: 'flex items-center gap-2' },
            [
                row.total_amount,
                h(FontAwesomeIcon, { icon: faBook, class: 'text-green-500' }),
            ]
        ),
    },
];

const callBackend = async (page = 1, limit = 8) => {
    loading.value = true;
    try {
        let res = await fetchSuperAdmin(`/superadmin/users/getuseramount?page=${page}&limit=${limit}`, "GET", null, router);
        console.log(res.status)
        if (res.status === 200) {
            res = await res.json();

            users.value = res.data;
            pagination.value = {
                page: res.pagination.page,
                limit: res.pagination.limit,
                totalRecords: res.pagination.totalRecords,
                totalPages: res.pagination.totalPages,
            };
            users.value.forEach((i, j) => {
    users.value[j].index = (pagination.value.page - 1) * pagination.value.limit + (j + 1);
});
        }
    } catch (error) {
        message.error('Failed to fetch data');
    } finally {
        loading.value = false;
    }
};

const handlePageChange = (page) => {
    pagination.value.page = page;
    callBackend(page, pagination.value.limit);
};

const handlePageSizeChange = (pageSize) => {
    pagination.value.limit = pageSize;
    pagination.value.page = 1;
    callBackend(1, pageSize);
};

onMounted(() => {
    callBackend();
});
</script>

<style lang="scss" scoped>
/* Add custom styles if needed */
</style>