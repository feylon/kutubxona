<template>
    <n-card title="Kitoblar">
        <n-data-table :columns="columns" :data="data" :pagination="pagination" :bordered="true" />
        <div class="mt-3 w-full flex justify-center items-center">
            <n-pagination v-model:page="currentPage" :page-count="totalPages" />
        </div>
    </n-card>
</template>

<script setup>
import { ref, h, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { NButton, NTag, NCheckbox, useMessage } from 'naive-ui';
const message = useMessage();
let data = ref([]);
const router = useRouter();
const currentPage = ref(1);
const limit = ref(1);
const totalBooks = ref(0);
const pagination = ref(false);
const totalPages = ref(2);
let callBackend = async function () {
    try {
        let backend = await fetchSuperAdmin(`/superadmin/book/get?page=${currentPage.value}&limit=10`, 'GET', null, router);
        console.log(backend.status);
        if (backend.status == 200) {
            backend = await backend.json();
            console.log(backend.pagination);
            currentPage.value = backend.pagination.currentPage;
            limit.value = backend.pagination.limit;
            totalBooks.value = backend.pagination.totalBooks;
            totalPages.value = backend.pagination.totalPages;
            data.value = [... backend.data];
            data.value.forEach((item, index) => {
                data.value[index].number = (index + 10 * (currentPage.value - 1)) + 1;
            });
             console.log(data.value);
            return null;
        }
    } catch (error) {
        
    }
}
onMounted(async () => {
    await callBackend();
});
watch(currentPage, async () => { await callBackend() });
const columns = createColumns({
    play(row) {
        message.info(`Play ${row.book_name}`);
    }
});

function createColumns({ play }) {
    return [
    {
            title: "№",
            key: "number"
        },
        {
            title: "Nomi",
            key: "book_name"
        },
        {
            title: "Narxi",
            key: "book_price"
        },
        {
            title: "Hajmi",
            key: "book_amount"
        },
        {
            title: "Kategoriya nomi",
            key: "category_name"
        },
        {
            title: "Status",
            key: "book_status",
            render(row) {
            let status = row.book_status;
            return h(
                NTag,
                {
                    type: status ? "success" : "error",
                    innerHTML: status ? "Aktiv" : "Aktiv emas"
                },
            );
        }
        },
        {
            title: "Action",
            key: "actions",
            render(row) {
                const price = JSON.stringify(row, null, 2);
                console.log(row);
                return h(
                    NButton,
                    {
                        strong: true,
                        tertiary: true,
                        size: "small",
                        onClick: () => console.log(price)
                    },
                    { default:  "Tahrirlash" }
                );
            }
        }
    ];
};
</script>
