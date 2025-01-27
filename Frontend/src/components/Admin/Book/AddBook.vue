<template>
    <div>
        <div class="flex w-full mb-3 justify-between items-center">
            <n-button type="success" @click="showModal = true">Kitob qo'shish</n-button>

        </div>
    </div>


    <n-modal v-model:show="showModal" class="custom-card" preset="card" :style="bodyStyle" title="Kitob qo'shish"
        :bordered="false" size="huge" :segmented="segmented">

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



    </n-modal>
</template>

<script setup>
import { useMessage } from "naive-ui";
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
const value = ref();
const formData = ref({
    name: (""),
    status: (false),
    price: (""),
    amount: (""),
    category: null
});
const message = useMessage()
function isNumericString(str) {
    return str.length > 0 && !isNaN(str) && !str.includes(" ");
}
const router = useRouter();
let bodyStyle = {
    width: "600px"
},
    segmented = {
        content: "soft",
        footer: "soft"
    },
    showModal = ref(false);
const options = ref([]);
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
            formData.value.category = options.value[0].id;
        }
    } catch (error) {
        console.log(error)
    }
};
onMounted(async () => await backend())

const submit = async () => {
    console.log(formData.category)
    console.log(formData.value);
    const { name, status, price, amount, category } = formData.value;
    if (name.length == 0 && !category) {
        return message.warning("Maydonlarni to'ldiring")
    }
    if (isNumericString(price) && isNumericString(amount)) {
        try {
            let res = await fetchSuperAdmin("/superadmin/book/Addbook", "POST", formData.value, router);
            if (res.status == 201) {
                formData.value = {
                    name: (""),
                    status: (false),
                    price: (""),
                    amount: (""),
                };
                showModal.value = false;
                message.success("Kitob qo'shildi")
            }

            if (res.status == 400) {
                res = await res.json();
                console.log(res)
                if(res.error == '"category" is required')
                    return message.warning("Kategoriyani kiriting")
                message.error(res.error)
            }
        } catch (error) {
            console.log(error)
        }
    }
    else {
        if (!isNumericString(price)) return message.error("Narxini raqamlarda kiriting");
        if (!isNumericString(amount)) return messageDark.name("Hajmini raqamlarda kiriting");

    }
}
let validateInput = (value) => {
    const validValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
    formData.value.price = validValue;
}

let validateInput1 = (value) => {
    const validValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
    formData.value.amount = validValue;
}
</script>
<style lang="scss" scoped></style>

 