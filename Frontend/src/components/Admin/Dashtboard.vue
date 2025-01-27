<template>
    <div class="min-h-screen overflow-y-hidden bg-gray-300">
        <div class="w-full h-[50px] text-white justify-between bg-[#001428] flex items-center">
            <div class="text-center w-[300px]">
                <fonta class="text-[34px]" :icon="['fas', 'book-open-reader']" />
            </div>
            <div class="flex bg-[#001428] pe-3 hover:bg-[#0e243a] ps-2 cursor-pointer h-full items-center  gap-3">
                <img src="../../assets/user.png" class="w-[40px]" alt="">
                <div class="flex text-white flex-col">
                    <span class="text-[13px]">{{ fullname }}</span>
                    <span class="text-[10px] text-center">Admin</span>
                </div>
            </div>
        </div>

        <n-space vertical>

            <n-layout has-sider class="h-full shadow-[#c0c3c9] text-white min-h-full">
                <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="300" :collapsed="collapsed"
                    show-trigger @collapse="collapsed = true" @expand="collapsed = false"
                    class="h-full bg-slate-900 shadow-[#c0c3c9] text-white min-h-full">

                    <n-menu :inverted="true" class="h-[calc(100vh-50px)] text-red-500 min-h-full" :options="menuOptions"
                        @update:value="handleUpdateValue" />

                </n-layout-sider>
                <n-layout class="overflow-auto scrollable-container bg-gray-300 p-3 h-[calc(100vh-50px)]">
                    <span>
                        <router-view>

                        </router-view>
                    </span>

                </n-layout></n-layout>
        </n-space>
    </div>

</template>

<script setup>
import { ref, onMounted, watch, h } from "vue";
import { RouterLink, useRouter } from "vue-router"
import { useMessage } from "naive-ui"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const message = useMessage();
const fullname = ref("");
const collapsed = ref(eval(localStorage.collapsedAdmin == null ? true : localStorage.getItem("collapsedAdmin")));
let bool = Boolean(localStorage.collapsedAdmin == null ? true : localStorage.getItem("collapsedAdmin"));
const router = useRouter();
watch(collapsed, (newval, oldval) => {
    localStorage.setItem("collapsedAdmin", newval)
});
const menuOptions = [
    {
        label: () => h(
            RouterLink,
            {
                to: "/superadmin/admin"
            },
            { default: () => "Adminlar" }
        ),
        key: "go-back-home",
        icon: () => h(FontAwesomeIcon, { icon: ['fas', 'user-secret'] })
    },
    {
        label: () => h(
            RouterLink,
            {
                to: "/superadmin/bookCategory"
            },
            { default: () => "Kitob kategoriyalari" }
        ),
        key: "bookCategory",
        icon: () => h(FontAwesomeIcon, { icon: ['f-solid', 'fa-book-atlas'] })
    },

    {
        label: () => h(
            RouterLink,
            {
                to: "/superadmin/books"
            },
            { default: () => "Kitoblar" }
        ),
        key: "books",
        icon: () => h(FontAwesomeIcon, { icon: ['fas', 'book'] })
    },
    {
        label: () => h(
            RouterLink,
            {
                to: "/admin/login",
            },
            { default: () => "Tizimdan chiqish", }
        ),
        key: "EXIT_system",
        icon: () => h(FontAwesomeIcon, { icon: ['fas', 'arrow-right-to-bracket'], class: "text-red-800  rotate-180" }),
        onclick: () => {
           
        },
        props: {

            onClick: async () => {
               

            },
            class: "hover:text-red-800"

        }

    },

];
let handleUpdateValue = async function (key, item) {
    if (key == "EXIT_system") {
        let data = await fetchAdmin("/signOut", "GET", null, router);
        localStorage.removeItem('token');
        return message.success("Siz tizimdan chiqdingiz");
    }
   
};
const callBackend = async () => {
    try {
        let data = await fetchAdmin("/profile", "GET", null, router);
        console.log(data.status)
        if (data.status == 200) {
            data = await data.json();
            fullname.value = data.data.fullname;
        }
    } catch (error) {
        console.log(error)
    }
}
onMounted(async () => {
    await callBackend();
})
</script>

<style scoped>
</style>