<template>
    <n-card>
        <div class="flex justify-between">
            <span class="font-bold text-[20px]">Kitoblar</span>

            <div class="flex gap-3">
                <div class="w-[200px]">
                    <n-select v-model:value="myOption" :options="options" />

                </div>
                <AddBook />
            </div>

        </div>

        <n-data-table :columns="columns" :data="data" :pagination="pagination" :bordered="true" />
        <div class="mt-3 w-full flex justify-center items-center">
            <n-pagination v-model:page="currentPage" :page-count="totalPages" />
        </div>
    </n-card>
    <n-modal v-model:show="superadmin.bookEdit" class="custom-card" preset="card" :style="bodyStyle"
        title="Kitob yangilash" :bordered="false" size="huge" :segmented="segmented">
        <EditBook :data="senddata" :showModal="showModal" />
    </n-modal>
</template>

<script setup>
import EditBook from "./EditBook.vue"
import { ref, h, onMounted, watch } from 'vue';
import AddBook from './AddBook.vue';
import { useRouter } from 'vue-router';
import { Superadmin } from "../../../../Pinia";
import { NButton, NTag, useMessage } from 'naive-ui';
const showModal = ref(false);
const superadmin = Superadmin();
const options = ref([]);
const myOption = ref("Barchasi")
let backend = async () => {
    try {
        options.value = [];
        const data1 = await fetchSuperAdmin('/superadmin/BookCategory/GetAllBookCategories', "GET", null, router);
        
        if (data1.status == 200) {
            let datas = await data1.json();
            
            datas.forEach((i, j) => {
                options.value[0] = { label: "Barchasi", value: "Barchasi" }
                options.value.push({ label: i.name.charAt(0).toUpperCase() + i.name.slice(1).toLowerCase(), value: i.id })
            });

        }
    } catch (error) {
        console.log(error)
    }
};
const senddata = ref(null)
const message = useMessage();
let data = ref([]);
const router = useRouter();
const currentPage = ref(1);
const limit = ref(1);
const totalBooks = ref(0);
const pagination = ref(false);
const totalPages = ref(2);
let bodyStyle = {
    width: "600px"
},
    segmented = {
        content: "soft",
        footer: "soft"
    };
let callBackend = async function () {
    try {
        let url = ``;
        if (myOption.value == "Barchasi") {
            url = `/superadmin/book/get?page=${currentPage.value}&limit=10`;
        }
        else {
            url = `/superadmin/book/getByCategory?category=${myOption.value}&page=${currentPage.value}&limit=10`;

        }
        let backend = await fetchSuperAdmin(url, 'GET', null, router);
        
        if (backend.status == 200) {
            backend = await backend.json();
            currentPage.value = backend.pagination.currentPage;
            limit.value = backend.pagination.limit;
            totalBooks.value = backend.pagination.totalBooks;
            totalPages.value = backend.pagination.totalPages;
            data.value = [...backend.data];
            if(totalPages.value == 1) currentPage.value = 1;
            data.value.forEach((item, index) => {
                data.value[index].number = (index + 10 * (currentPage.value - 1)) + 1;
            });
            
            return null;
        }
    } catch (error) {

    }
}
onMounted(async () => {
    await callBackend();
    await backend();
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
            title: "Tahrirlash",
            key: "actions",
            render(row) {
                const price = JSON.stringify(row, null, 2);


                return h(
                    NButton,
                    {
                        strong: true,
                        tertiary: true,
                        size: "small",
                        onClick: () => {
                            senddata.value = (row);
                            
                            superadmin.bookEdit = true;
                            showModal.value = true;
                        }
                    },
                    { default: "Tahrirlash" }
                );
            }
        }
    ];
};
watch(myOption,async()=> await callBackend());
</script>
