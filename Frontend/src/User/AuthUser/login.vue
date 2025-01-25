<template>
    <div class="flex select-none items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
            <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
            <form @submit.prevent="loginPack()">
                <div class="mb-4">
                    <label for="username" class="block text-gray-600 font-medium mb-2">Username</label>
                    <input v-model="login" type="text" id="username"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="Username" />
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-gray-600 font-medium mb-2">Parol</label>
                    <input v-model="password" type="password" id="password"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        placeholder="Parol" />
                </div>
                <div class="mb-4 text-right mt-3">
                </div>
                <button type="submit"
                    class="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition duration-300">Login</button>
            </form>
            <p class="text-center text-gray-600 text-sm mt-6">
                Ro'yxatdan o'tmadingizmi ? <router-link to="/registr" class="text-blue-500 hover:underline">Ro'yxatdan
                    o'tish</router-link>
            </p>
        </div>
    </div>

</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
const login = ref("");
const password = ref("");
const message = useMessage();
const router = useRouter();
const loginPack = async () => {
    console.log("Login ...");
    if (username.value.length < 3) return message.error("Foydalauvchi nomi 3 ta harfdan kam bo'lmasligi lozim");
    if (username.value.length > 15) return message.error("Foydalauvchi nomi 15 ta harfdan oshmasligi lozim");

    try {
        let res = await fetchUser("/login", "POST", { login: login.value, password: password.value }, router);
        if (res.status == 400) {

            message.error("Login yoki parol xato");
            login.value = "";
            password.value = "";
            return;
        }
        if (res.status == 201) {
            res = await res.json();
            localStorage.setItem("token", res.token);
            login.value = "";
            password.value = "";
            login.value = "";
            message.success("Siz tizimga kiridingiz");
            router.push("/");
        }
    } catch (error) {
        console.log(error)
    }
}
</script>

<style lang="scss" scoped></style>