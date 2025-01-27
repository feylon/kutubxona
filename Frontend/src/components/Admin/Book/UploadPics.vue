<template>
    <input @change="uploadfile" type="file" id="category_pic"
        class="w-[300px] h-[50px] border-2 border-gray-300 rounded-lg hidden" />
    <div v-if="!uploaded" class="flex w-full justify-center items-center">
        <label @click="file = null; uploadpicbase = ''" for="category_pic" class=" inline-block cursor-pointer">
            <div
                class="flex flex-col items-center text-green-700 select-none justify-center w-[300px] h-[300px] border-2 border-dashed border-gray-300 rounded-lg">
                <fonta class="text-[70px]  animate-bounce" :icon="['fas', 'cloud-arrow-up']" />
                Yuklash uchun bosing
            </div>
        </label>
    </div>
    <div v-else class="flex w-full justify-center items-center">
        <img :src="uploadpicbase" class="w-[300px] h-[300px] rounded-lg shadow-lg shadow-[#696767]" alt="">
    </div>
    <div class="flex mt-3 justify-between w-full">
        <div class="w-full justify-end flex gap-3">
            <n-button @click="superadmin.UploadPicsBook = false" type="error">Bekor qilish</n-button>
            <n-button @click="uploadfileSend(file, id)" type="success">Yuklash</n-button>

        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useMessage } from "naive-ui"
import { Superadmin } from '../../../../Pinia';
const uploaded = ref(false);
const superadmin = Superadmin();
const uploadpicbase = ref("")
const uploadpic = ref(false);
const message = useMessage();
let file = ref(null);

const props = defineProps({
    data: {
        type: Object,
        required: true,
    }
});
const { key } = props.data;
const id = ref(key)

const uploadfile = (e) => {
    if (e.target.files[0]) {
        if (e.target.files[0].size > 4000000) {
            message.error("Rasm hajmi 4mb dan oshmasligi kerak");
            return;
        }
        if (e.target.files[0].type !== "image/jpeg" && e.target.files[0].type !== "image/png") {
            message.error("Rasm formati faqatgina jpg yoki png bo'lishi kerak");
            return;
        }
        uploaded.value = true;
        file.value = e.target.files[0];
        if (file.value) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadpicbase.value = e.target.result;

            };
            reader.readAsDataURL(file.value);

        }
    }
}

const uploadfileSend = async function (file, id) {
    const formData = new FormData();
    formData.append("file", file);
    // return;
    let res = await fetch('http://localhost:4100/api/superadmin/book/UploadPics/' + id, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,

        },
        body: formData
    });
    console.log(res.status)
    if (res.status === 200) {
        message.success("Rasm muvaffaqiyatli yuklandi");
        uploadpic.value = false;
        uploaded.value = false;
        superadmin.UploadPicsBook = false

        return;
    }
    if (res.status === 400) {
        res = await res.json();
    }
    else {
        uploadpic.value = false;
        message.error("Rasm yuklanmadi");
    }

}
watch(uploadpic, () => {
    if (!uploadpic) {
        uploaded.value = false;
        uploadpicbase.value = "";
        file.value = null;
        category_id.value = "";
    }
});
</script>

<style lang="scss" scoped></style>