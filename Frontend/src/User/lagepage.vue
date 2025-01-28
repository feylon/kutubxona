<template>
    <div class=" min-w-full bg-slate-100 min-h-screen pb-0 select-none">
        <div
            class="relative min-w-full z-50 text-white bg-blue-500 h-[70px] sticky top-0 justify-between pe-4 flex items-center shadow-blue-400 shadow-sm drop-shadow-sm shadow-lg ">
            <RouterLink to="/" class="h-full flex items-center gap-4">
                <fonta class="text-3xl   ms-5" :icon="['fas', 'book-open-reader']" />
                <span class="font-bold me-5 uppercase font-sans">Kutubxona</span>
            </RouterLink>
            <nav class="flex justify-center flex-wrap gap-6 text-white font-medium">
                <a href=# class="hover:text-gray-200 cursor-pointer">Home</a>
                <a href=# class="hover:gray-200 cursor-pointer">About</a>
                <a href=# class="hover:text-gray-200 cursor-pointer">Services</a>
                <a href=# class="hover:text-gray-200 cursor-pointer">Media</a>
                <a href=# class="hover:text-gray-200 cursor-pointer">Gallery</a>
                <a href=# class="hover:text-gray-200 cursor-pointer">Contact</a>
            </nav>
            <div>
                <div v-if="!user.isAuth" ref="registr" class="flex  flex-col text-[17px] font-bold">

                    <RouterLink to='/login'><font-awesome-icon :icon="['fas', 'right-to-bracket']" />
                        Kirish</RouterLink>
                    <RouterLink v-if="false" to='/registr'><font-awesome-icon :icon="['fas', 'key']" /> Ro'yxatdan o'tish
                    </RouterLink>
                </div>

                <n-dropdown v-else  :options="options" @select="handleSelect">
                    <div  ref="registr" class="flex items-center cursor-pointer flex-col text-[17px] font-bold">

<img src="../assets/ffa09aec412db3f54deadf1b3781de2a.png" class="w-[30px] rounded-[50%]" alt="">
<span class="text-white text-[13px]">{{ fullname }}</span>

</div>
                </n-dropdown>
            </div>
        </div>
        <div class="container mt-4 max-width-[1300px] mx-auto">
            <!-- Start BODY -->
             <RouterView>
           

            
        </RouterView>
            <!-- End BODY -->


        </div>
    </div>
    <footer class="flex h-full min-w-[100wh] mx-auto flex-col bg-blue-500 space-y-10 justify-center m-10">

        <nav class="flex justify-center flex-wrap gap-6 text-white font-medium">
            <div class="hover:text-gray-200 cursor-pointer">Home</div>
            <div class="hover:gray-200 cursor-pointer">About</div>
            <div class="hover:text-gray-200 cursor-pointer">Services</div>
            <div class="hover:text-gray-200 cursor-pointer">Media</div>
            <div class="hover:text-gray-200 cursor-pointer">Gallery</div>
            <div class="hover:text-gray-200 cursor-pointer">Contact</div>
        </nav>

        <div class="flex justify-center space-x-5">
            <div>
                <img src="https://img.icons8.com/fluent/30/000000/facebook-new.png" />
            </div>
            <div>
                <img src="https://img.icons8.com/fluent/30/000000/linkedin-2.png" />
            </div>
            <div>
                <img src="https://img.icons8.com/fluent/30/000000/instagram-new.png" />
            </div>
            <div>
                <img src="https://img.icons8.com/fluent/30/000000/facebook-messenger--v2.png" />
            </div>
            <div>
                <img src="https://img.icons8.com/fluent/30/000000/twitter.png" />
            </div>
        </div>
        <p class="text-center text-white font-medium">&copy; 2025 Company Ltd. All rights reservered.</p>
    </footer>

    <div>
        <button @click="router.push('/orders')"
        class="fixed bottom-6 right-6  bg-blue-500 text-white rounded-[50%] w-[60px] h-[60px] shadow-lg hover:bg-blue-600 transition duration-300">
        <div class="relative flex flex-col">
            <n-badge :value="user.orders.length" type="warning" class="top-1 right-1 absolute right-1 top-[-8px] z-100">

</n-badge>
<font-awesome-icon class="text-[20px]" :icon="['fas', 'bag-shopping']" />
        </div>
            
        </button>
    </div>
</template>

<script setup>
import { RouterLink, useRouter, RouterView } from 'vue-router';
import { ref, h, onMounted } from "vue";
import { User } from '../../Pinia';
import NumberAnimation from "vue-number-animation";
import Segment from './Segment.vue';
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useMessage } from 'naive-ui';

const router = useRouter();
const web_url1 = window.web_url;
const message = useMessage();
const isVisible = ref(false);
const topBooks = ref([]);
const user = User();
const HasCategory = ref([]);
const profile = ref({ data: { fullname: "Salom" } });
const fullname = ref("");
const options = [
    {
        label: "Tizimdan chiqish",
        key: "exit",
        icon: ()=>h(FontAwesomeIcon, { icon: ['fas', 'arrow-right-to-bracket'], class: "text-red-800  rotate-180" }),
        
    },

]
const getHasBookCategory = async () => {
    try {
        let res = await fetchUser('/book/getHasBookCategory')
        if (res.status == 200) {
            res = await res.json();
            HasCategory.value = res;
        }
    } catch (error) {
        console.log(error)

    }
}

const callTopBooks = async () => {
    try {
        let res = await fetchUser('/book/getTopBook')
        if (res.status == 200) {
            res = await res.json();
            topBooks.value = res;
        }
    } catch (error) {
        console.log(error)

    }
}
const handleScroll = () => {
    isVisible.value = window.scrollY > 300;
};
const getProfile = async () => {
    try {
        let res = await fetchUser('/profile', "GET");
        if (res.status == 200) {
            res = await res.json();
            profile.value = res;
            user.isAuth = true;
            fullname.value = res.data.fullname;
            console.log("fullname ", fullname.value)
            return;
        }
        user.isAuth = false;

    } catch (error) {
        console.log(error)
    }
}

const registr = ref(null)
onMounted(async () => {
    await callTopBooks();
    await getHasBookCategory();
    gsap.to(registr.value, { x: -0, duration: 2 });
    window.addEventListener("scroll", handleScroll);
    await getProfile();
});
const  handleSelect = async (key) => {
        if(String(key) == "exit"){
            try {
                let res = await fetchUser("/signout", "GET", null, router);
                if (res.status == 200) {
                    localStorage.removeItem("token");
                    message.success ("Siz tizimdan chiqdingiz");
                    return user.isAuth = false;
                }
            } catch (error) {
                console.log(error)
            }
        }
      }
</script>

<style scoped>


button {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
