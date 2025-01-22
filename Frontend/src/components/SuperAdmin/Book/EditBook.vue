<template>
    <div>
        <div class="flex flex-wrap gap-5 mx-auto justify-center">
            <div class="w-[200px] flex flex-col">
                <span class="text-[13px]">Kitob nomi</span>
                <n-input v-model:value="formData.name" placeholder="Adabiyot"></n-input>
            </div>

            <div class="w-[200px] flex flex-col">
                <span class="text-[13px]">Narxi</span>
                <n-input @input="validateInput" v-model:value="formData.price" placeholder="5000"></n-input>
            </div>

            <div class="w-[200px] flex flex-col">
                <span class="text-[13px]">Hajmi</span>
                <n-input @input="validateInput1" v-model:value="formData.amount" placeholder="5000"></n-input>
            </div>

            <div class="w-[200px] flex flex-col">
                <span class="text-[13px]">Kitob kategoriyasi</span>
                <n-select v-model:value="formData.category" :options="options" />
            </div>

            <div class="w-[200px] gap-3 flex">
                <span class="text-[13px]">Aktiv </span>
                <n-switch v-model:value="formData.status" />
            </div>



            <div class="w-[200px] flex flex-col">
                <n-button @click="submit()" type="success">Qo'shish</n-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { provide, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useMessage } from "naive-ui";
import { Superadmin } from "../../../../Pinia"
const superadmin = Superadmin();
console.log(superadmin.bookEdit)
const router = useRouter()
const message = useMessage();
const options = ref([]);

const props = defineProps({
    data: {
        type: Object,
        required: true,
    }
});

const { book_amount, book_name, book_price, book_status, category_id, category_name, key } = props.data;

let backend = async () => {
    try {
        options.value = [];
        const data1 = await fetchSuperAdmin('/superadmin/BookCategory/GetAllBookCategories', "GET", null, router);
        console.log(data1.status)
        if (data1.status == 200) {
            let datas = await data1.json();
            console.log(datas)
            datas.forEach((i, j) => {

                options.value.push({ label: i.name.charAt(0).toUpperCase() + i.name.slice(1).toLowerCase(), value: i.id })
            });
            formData.value.category = category_id;
        }
    } catch (error) {
        console.log(error)
    }
};
onMounted(async () => await backend())
const formData = ref({
    name: book_name,
    status: book_status,
    price: book_price.toString(),
    amount: book_amount.toString(),
    category: null,
    id: key
});
console.log(props.data);
let validateInput = (value) => {
    const validValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
    formData.value.price = validValue;
}

let validateInput1 = (value) => {
    const validValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
    formData.value.amount = validValue;
}
const submit = async () => {
    console.log(formData.value);
    try {
        let res = await fetchSuperAdmin("/superadmin/book/Editbook", "PATCH", formData.value, router);
        console.log(res.status)
        if (res.status == 200) {
            superadmin.bookEdit = false;
            message.success(`${formData.value.name} yangilandi`)
            return router.go(0);
        }
        if (res.status == 400) {
            res = await res.json();
            
            return message.error(res.error);
        }
    } catch (error) {
        console.log(error)
        message.error("Serverda muommo chiqdi")
    }
}
</script>