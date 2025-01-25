<template>
    <div class="flex select-none items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
            <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Ro'yxatdan o'tish</h2>
            <form @submit.prevent="login()">
                <div class="mb-4">
                    <label for="fullname" class="block text-gray-600 font-medium mb-2">To'liq ism</label>
                    <input v-model="fullname" name="login" type="text" id="fullname" placeholder="Ergashev Jamshid"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>

                <div class="mb-4">
                    <label for="username" class="block text-gray-600 font-medium mb-2">Username</label>
                    <input v-model="username" type="text" id="username" name="username" placeholder="jamshid14092002"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>

                <div class="mb-4">
                    <label for="password" class="block text-gray-600 font-medium mb-2">Parol</label>
                    <input v-model="password" name="'Password'" type="password" id="password" placeholder="********"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" />
                </div>

                <button type="submit"
                    class="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                    Register
                </button>
            </form>
            <p class="text-center text-gray-600 text-sm mt-6">
                Ro'yxatdan o'tganmisiz ? <router-link to="/login" class="text-blue-500 hover:underline">Tizimga
                    kirish</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
const fullname = ref("");
const username = ref("");
const password = ref("");
const message = useMessage();
const router = useRouter();
const login = async () => {
    if (username.value.length < 3) return message.error("Foydalauvchi nomi 3 ta harfdan kam bo'lmasligi lozim");
    if (fullname.value.length < 3) return message.error("Ism familiya nomi 3 ta harfdan kam bo'lmasligi lozim");
    if (password.value.length < 3) return message.error("Ism familiya nomi 8 ta harfdan kam bo'lmasligi lozim");

    try {
        let res = await fetchUser("/register", "POST", { fullname: fullname.value, username: username.value, password: password.value }, router);
        if (res.status == 409) {

            password.value = '';
            message.warning(`${username.value} foydalanuvchi allaqachon ro'yxatdan o'tgan`);
            return;
        }
        if (res.status == 400) {
            res = await res.json();
            message.error(res.error[0]);
            return;
        }
        if (res.status == 201) {
            res = await res.json();
            localStorage.setItem("token", res.token);
            login.value = "";
            password.value = "";
            fullname.value = "";
            message.success("Siz ro'yxatdan o'tdingiz");
            router.push("/");
        }

    } catch (error) {
        message.error("Serverda muommo mavjud");
        console.log(error);
    }
}
</script>
