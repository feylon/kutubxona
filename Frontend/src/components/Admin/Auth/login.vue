<template>
    <div
    @keyup.enter = 'loginfunc'
        class="select-none min-h-screen overflow-y-hidden flex justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-500 w-full">
        <div
            class="max-w-[700px] w-full rounded-[30px] h-[500px] flex flex-col md:flex-row bg-lime-50 ps-0 pb-0 p-4 pt-0">
            <div
                class="w-full md:w-1/2 h-[300px] md:h-[500px] rounded-[30px] hidden md:block md:rounded-r-[0px] bg-cover back bg-[url('../../../assets/lock.png')]">
            </div>
            <div class="w-full md:w-1/2 flex flex-col justify-center items-center py-6 px-4">
                <p class="text-center mb-10 text-xl font-bold uppercase">Login</p>
                <div class="w-full flex flex-col items-center gap-6">
                    <div class="w-full max-w-[300px] flex items-center gap-3">
                        <fonta class="text-xl text-[rgb(0,3,106)]" :icon="['fa-solid', 'fa-user']"></fonta>
                        <input v-model="login"
                        @keyup.enter = 'loginfunc'
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-[rgb(0,3,96)]"
                            id="login" type="text" placeholder="Login">
                    </div>
                    <div class="w-full max-w-[300px] flex items-center gap-3">
                        <fonta class="text-xl text-[rgb(0,3,106)]" :icon="['fa-solid', 'fa-lock']"></fonta>
                        <input v-model="password"
                        @keyup.enter = 'loginfunc'
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-[rgb(0,3,96)]"
                            id="password" type="password" placeholder="Password">
                    </div>

                    <div class="w-full mt-4 max-w-[300px]">
                        <n-button @keyup.enter = 'loginfunc' :disabled="disabled" @click="loginfunc" class="w-full" color="#00036A">
                            <fonta :icon="['fas', 'right-to-bracket']" />
                        </n-button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
const router = useRouter();
const message = useMessage();
const login = ref("");
const password = ref("");
const disabled = ref(false)
const loginfunc = async () => {
    try {

        if(password.value.length == 0  || login.value.length == 0){
            return message.info("Formani to'ldiring")
        }
        disabled.value = true;
        let data = await fetchAdmin('/login', 'POST', { login: login.value, password: password.value }, router);
        console.log(data.status)
        if (data.status == 400) {
            disabled.value = false;
            message.error("Parol yoki login xato");
            login.value = "";
            password.value = ""
            return null;
        }
        if (data.status == 400) {
            data = await data.json();
            console.log(data)
            disabled.value = false;
            message.error("Parol yoki login xato");
            login.value = "";
            password.value = ""
            return null;
        }
        if (data.status == 400) {
            data = await data.json();
            console.log(data)
            disabled.value = false;
            message.error("Parol yoki login xato");
            login.value = "";
            password.value = ""
            return null;
        }
        if (data.status == 406) {
            data = await data.json();
            console.log(data)
            disabled.value = false;
            message.error("Admin tomonidan bloklangan");
            login.value = "";
            password.value = ""
            return null;
        }
        if (data.status === 201) {
            data = await data.json();
            const { token } = data;
            localStorage.setItem("token", token);
            message.success("Siz tizimga kirdingiz");
            login.value = "";
            password.value = "";
            router.push("/admin/orders")
            return null;

        }
        if (data.status === 500) {
            login.value = "";
            password.value = "";

            throw new Error("Server Xato")
        }

    } catch (error) {
        message.error("Serverda muommo bor")
    }
}

</script>

<style scoped>
.back {
    background-image: url('../../../assets/back.jpg');
    object-fit: cover;
}
</style>