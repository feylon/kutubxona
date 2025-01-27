<template>
    <n-button @click="router.go(-1)" type="success">
        <fonta :icon="['fas', 'arrow-left']" />
    </n-button>

    <div class="font-bold text-[20px]">

    </div>
    <div>
        <n-card title="  Admin qo'shish" bordered>
            <n-form ref="form" :model="formData" :rules="rules" label-placement="left" label-width="120px">
                <n-form-item label="To'liq ismi" path="fullname">
                    <n-input v-model:value="formData.fullname" placeholder="Ergashev Jamshid" />
                </n-form-item>
                <n-form-item label="Username" path="username">
                    <n-input v-model:value="formData.username" placeholder="jamshid14092002" />
                </n-form-item>
                <n-form-item label="Parol" path="password">
                    <n-input v-model:value="formData.password" type="password" placeholder="pass1301" />
                </n-form-item>
                <n-form-item label="Status" path="status">
                    <n-switch v-model:value="formData.status" :checked-value="true" :unchecked-value="false" />
                </n-form-item>
                <n-form-item class="w-full flex justify-end">
                    <n-button type="primary" @click="submitForm">Qo'shish</n-button>
                </n-form-item>
            </n-form>
            <n-alert class="mt-3" v-if="responseMessage" :type="responseType" closable>
                {{ responseMessage }}
            </n-alert>
        </n-card>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
let router = useRouter();
import { ref } from 'vue';
import { useMessage } from 'naive-ui';

const formData = ref({
    fullname: '',
    username: '',
    password: '',
    status: false,
});

const rules = {
    fullname: { required: true, message: "To'liq ismini kiriting", trigger: 'blur' },
    username: { required: true, message: 'Usernameni kiriting', trigger: 'blur' },
    password: { required: true, message: 'Parolni kiriting', trigger: 'blur' },
};

const responseMessage = ref('');
const responseType = ref('success');
const message = useMessage();

const submitForm = async () => {
    try {
        let res = await fetchSuperAdmin('/superadmin/addadmin', 'POST', formData.value, router);
        if (res.status == 400) {
            res = await res.json();
            message.warning(res.error);
            return;

        }


        if (!res.ok) {
            throw new Error("Admin qo'shilmadi");
        }

        await res.json();
        responseMessage.value = "Admin qo'shildi";
        responseType.value = 'success';
        message.success("Admin qo'shildi");
        formData.value = { fullname: '', username: '', password: '', status: true }; 
    } catch (error) {
        responseMessage.value = error.message;
        responseType.value = 'error';
    }
};
</script>


<style lang="scss" scoped>
.n-card {
    max-width: 600px;
    margin: 50px auto;
}
</style>