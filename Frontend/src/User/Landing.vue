<template>
     <div class="p-3 items-center flex gap-5 bg-white w-full mx-auto ps-4 pe-4 rounded-md">
                <div style="border-radius: 25% 16% 25% 12% / 44% 25% 35% 25%;"
                    class="min-w-[300px] borderff bg-cover min-h-[300px] max-h-[300px]"></div>
                <div>
                    <div class="font-bold text-[35px] text-blue-500">Lorem ipsum dolor, architecto iste, qui, beatae
                        natus .</div>
                    <div class="text-justify mt-5">
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quia earum tempore iste est! Tempora
                        odit ratione, cupiditate ipsa, consequuntur illum voluptatibus accusantium aliquid placeat nisi,
                        laudantium harum. Hic, quasi perspiciatis sapiente dolore commodi consequuntur dolor. Unde
                        minima ex assumenda maiores quos, iste atque, perspiciatis animi fugit reprehenderit cupiditate
                        soluta eveniet distinctio laboriosam reiciendis aperiam fuga suscipit aut nemo. Nostrum, facilis
                        esse harum alias quas rerum iure, accusamus exercitationem, suscipit repellat distinctio
                        corrupti voluptatibus vitae voluptate!
                    </div>
                </div>
            </div>




            <div class="w-full rounded-md  flex justify-start flex-col  items-start mt-5 p-[1px] pt-4  bg-blue-500   ">
                <div class="w-[75%] flex mx-auto justify-between">
                    <div class="max-w-[250px] flex justify-center flex-col">
                        <span class="font-bold text-white text-center text-[40px]">
                            <NumberAnimation :ref="Math.trunc((Math.random() * 10000))" :from="1"
                                :to="Math.trunc((Math.random() * 10000))" :format="(value) => value.toLocaleString()"
                                :duration="2" autoplay easing="linear" />
                        </span>
                        <span class="text-white text-[20px] border-t-[1px]  text-center">Yuklangan kitoblar soni</span>
                    </div>


                    <div class="max-w-[250px] flex justify-center flex-col">
                        <span class="font-bold text-white text-center text-[40px]">
                            <NumberAnimation :ref="Math.trunc((Math.random() * 10000))" :from="1"
                                :to="Math.trunc((Math.random() * 10000))" :format="(value) => value.toLocaleString()"
                                :duration="2" autoplay easing="linear" />
                        </span>
                        <span class="text-white text-[20px] border-t-[1px]  text-center">Ro'yxatdan o'tganlar
                            soni</span>
                    </div>



                    <div class="max-w-[250px] flex justify-center flex-col">
                        <span class="font-bold text-white text-center text-[40px]">
                            <NumberAnimation :ref="Math.trunc((Math.random() * 10000))" :from="1"
                                :to="Math.trunc((Math.random() * 10000))" :format="(value) => value.toLocaleString()"
                                :duration="2" autoplay easing="linear" />
                        </span>
                        <span class="text-white text-[20px] border-t-[1px]  text-center">Yetgazilgan kitoblar
                            soni</span>
                    </div>
                </div>
                <div style="border-radius: 67% 25% 25% 25% / 77% 0% 0% 0%;"
                    class="min-w-full flex  items-end gap-[130px] justify-start mt-[10px] flex-col h-full bg-white">
                    <div class="mt-[50px]">
                        <span class="text-blue-600 font-bold text-[30px]">
                            Bizning saytdan foydalanish bo'yicha video qo'llanma

                        </span>

                    </div>
                    <div class="mt-[40px] me-[50px] flex sm:flex-wrap lg:flex-nowrap gap-5 justify-around">
                        <div class="">
                            <div class="h3 text-blue-600 font-bold text-[30px] text-right">Lorem, ipsum dolor sit amet
                                consectetur adipisicing </div>
                            <div class="ps-[30px] mt-[55px]">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem temporibus accusantium
                                consectetur recusandae. Commodi cum fugit vero quas nemo, in architecto magni
                                perferendis labore aperiam, sunt aliquid similique exercitationem excepturi officia,
                                tempora eaque! Soluta sapiente eaque modi eos non mollitia repudiandae molestias, quidem
                                quo molestiae hic nulla, veniam vero praesentium iusto! Fuga sit eum, eos consequuntur
                                exercitationem ad dignissimos dolorem! </div>
                        </div>
                        <iframe width="650" height="300"
                            src="https://www.youtube.com/embed/YxxkSjV-sDI?si=s0T-ce1VmUQWwsJM"
                            title="YouTube video player" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

                    </div>
                </div>
            </div>



            <div v-if="false" class="w-full mt-5  bg-white">
                <div class="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">

                    <div  class="border-b mb-5 flex justify-between text-sm">
                        <div class="text-blue-600 flex items-center pb-2 pr-2 border-b-2 border-blue-600 uppercase">
                            <svg class="h-6 mr-3" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 455.005 455.005"
                                style="enable-background:new 0 0 455.005 455.005;" xml:space="preserve">
                                <g>
                                    <path
                                        d="M446.158,267.615c-5.622-3.103-12.756-2.421-19.574,1.871l-125.947,79.309c-3.505,2.208-4.557,6.838-2.35,10.343 c2.208,3.505,6.838,4.557,10.343,2.35l125.947-79.309c2.66-1.675,4.116-1.552,4.331-1.432c0.218,0.12,1.096,1.285,1.096,4.428 c0,8.449-6.271,19.809-13.42,24.311l-122.099,76.885c-6.492,4.088-12.427,5.212-16.284,3.084c-3.856-2.129-6.067-7.75-6.067-15.423 c0-19.438,13.896-44.61,30.345-54.967l139.023-87.542c2.181-1.373,3.503-3.77,3.503-6.347s-1.323-4.974-3.503-6.347L184.368,50.615 c-2.442-1.538-5.551-1.538-7.993,0L35.66,139.223C15.664,151.815,0,180.188,0,203.818v4c0,23.63,15.664,52.004,35.66,64.595 l209.292,131.791c3.505,2.207,8.136,1.154,10.343-2.35c2.207-3.505,1.155-8.136-2.35-10.343L43.653,259.72 C28.121,249.941,15,226.172,15,207.818v-4c0-18.354,13.121-42.122,28.653-51.902l136.718-86.091l253.059,159.35l-128.944,81.196 c-20.945,13.189-37.352,42.909-37.352,67.661c0,13.495,4.907,23.636,13.818,28.555c3.579,1.976,7.526,2.956,11.709,2.956 c6.231,0,12.985-2.176,19.817-6.479l122.099-76.885c11.455-7.213,20.427-23.467,20.427-37.004 C455.004,277.119,451.78,270.719,446.158,267.615z">
                                    </path>
                                    <path
                                        d="M353.664,232.676c2.492,0,4.928-1.241,6.354-3.504c2.207-3.505,1.155-8.136-2.35-10.343l-173.3-109.126 c-3.506-2.207-8.136-1.154-10.343,2.35c-2.207,3.505-1.155,8.136,2.35,10.343l173.3,109.126 C350.916,232.303,352.298,232.676,353.664,232.676z">
                                    </path>
                                    <path
                                        d="M323.68,252.58c2.497,0,4.938-1.246,6.361-3.517c2.201-3.509,1.14-8.138-2.37-10.338L254.46,192.82 c-3.511-2.202-8.139-1.139-10.338,2.37c-2.201,3.51-1.14,8.138,2.37,10.338l73.211,45.905 C320.941,252.21,322.318,252.58,323.68,252.58z">
                                    </path>
                                    <path
                                        d="M223.903,212.559c-3.513-2.194-8.14-1.124-10.334,2.39c-2.194,3.514-1.124,8.14,2.39,10.334l73.773,46.062 c1.236,0.771,2.608,1.139,3.965,1.139c2.501,0,4.947-1.251,6.369-3.529c2.194-3.514,1.124-8.14-2.39-10.334L223.903,212.559z">
                                    </path>
                                    <path
                                        d="M145.209,129.33l-62.33,39.254c-2.187,1.377-3.511,3.783-3.503,6.368s1.345,4.983,3.54,6.348l74.335,46.219 c1.213,0.754,2.586,1.131,3.96,1.131c1.417,0,2.833-0.401,4.071-1.201l16.556-10.7c3.479-2.249,4.476-6.891,2.228-10.37 c-2.248-3.479-6.891-4.475-10.37-2.228l-12.562,8.119l-60.119-37.38l48.2-30.355l59.244,37.147l-6.907,4.464 c-3.479,2.249-4.476,6.891-2.228,10.37c2.249,3.479,6.894,4.476,10.37,2.228l16.8-10.859c2.153-1.392,3.446-3.787,3.429-6.351 c-0.018-2.563-1.344-4.94-3.516-6.302l-73.218-45.909C150.749,127.792,147.647,127.795,145.209,129.33z">
                                    </path>
                                    <path
                                        d="M270.089,288.846c2.187-3.518,1.109-8.142-2.409-10.329l-74.337-46.221c-3.518-2.188-8.143-1.109-10.329,2.409 c-2.187,3.518-1.109,8.142,2.409,10.329l74.337,46.221c1.232,0.767,2.601,1.132,3.953,1.132 C266.219,292.387,268.669,291.131,270.089,288.846z">
                                    </path>
                                    <path
                                        d="M53.527,192.864c-2.187,3.518-1.109,8.142,2.409,10.329l183.478,114.081c1.232,0.767,2.601,1.132,3.953,1.132 c2.506,0,4.956-1.256,6.376-3.541c2.187-3.518,1.109-8.142-2.409-10.329L63.856,190.455 C60.338,188.266,55.714,189.346,53.527,192.864z">
                                    </path>
                                </g>
                            </svg>
                            <div  class="font-bold text-[24px] inline-block"> Top kitoblar</div>
                        </div>

                    </div>


                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">


                        <div v-for="(i, j) in topBooks" :key="i.id"
                            class="rounded overflow-hidden shadow-lg flex flex-col">

                            <div class="relative">
                                <div href="#">
                                    <img class="w-full" :src="web_url1 + i.picture" alt="Sunset in the mountains">
                                    <div
                                        class="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
                                    </div>
                                </div>
                                <a href="#!">
                                    <div
                                        class="text-xs absolute top-0 right-0 bg-blue-600 px-4 py-2 text-white mt-3 mr-3 hover:bg-white hover:text-blue-600 transition duration-200 ease-in-out">
                                        <font-awesome-icon :icon="['fas', 'bag-shopping']" /> Buyurtma qilish
                                    </div>
                                </a>
                            </div>
                            <div class="px-6 py-4 mb-auto">
                                <div href="#"
                                    class="font-medium text-lg inline-block hover:text-blue-600 transition duration-200 ease-in-out inline-block mb-2">
                                    {{ i.name }}</div>
                                <p class="text-gray-500 text-sm">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                </p>
                            </div>
                            <div class="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                                <span href="#"
                                    class="py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center">
                                    <span class="ml-1 font-bold text-[18px]">{{ i.price }} <span
                                            class="font-normal text-[16px]">so'm</span></span>
                                </span>

                                <button @click="console.log(i.id)"
                                    class="px-6 py-2 min-w-[120px] text-center text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white active:bg-indigo-500 focus:outline-none focus:ring">
                                    <font-awesome-icon :icon="['fas', 'bag-shopping']" />
                                </button>
                            </div>
                        </div>





                    </div>
                    <div class="flex mt-3 justify-center w-full">
                        <button
                            class="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg">
                            Ko'proq ko'rish
                        </button>
                    </div>

                </div>
            </div>
            <Segment v-for="(i, j) in HasCategory" :obj="i" :key="j" />

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

<style lang="scss" scoped>
.borderff {
    background-image: url('../assets/85b60de3-fe65-5769-8e0b-450dc95e956e.jfif');
}
</style>