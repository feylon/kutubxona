<template>
    <div class=" min-w-full bg-slate-100 min-h-screen select-none">
        <div
            class="relative min-w-full text-white bg-blue-400 h-[70px] sticky top-0 justify-between pe-4 flex items-center shadow-blue-400 shadow-sm drop-shadow-sm shadow-lg ">
            <RouterLink to="/" class="h-full flex items-center gap-4">
                <fonta class="text-3xl   ms-5" :icon="['fas', 'book-open-reader']" />
                <span class="font-bold me-5 uppercase font-sans">Kutubxona</span>
            </RouterLink>

            <div>
                <div ref="registr" class="flex  flex-col text-[17px] font-bold">

                    <RouterLink to='/'><font-awesome-icon :icon="['fas', 'right-to-bracket']" /> Kirish</RouterLink>
                    <RouterLink to='/'><font-awesome-icon :icon="['fas', 'key']" /> Ro'yxatdan o'tish</RouterLink>
                </div>
            </div>
        </div>
        <div class="container mt-4 max-width-[1300px] mx-auto">
            <!-- Start BODY -->
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




            <div
                class="w-full rounded-md  flex justify-start flex-col  items-start mt-5 p-[1px] pt-4  bg-blue-500   ">
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
                    class="min-w-full flex items-end gap-[130px] justify-start mt-[10px] flex-col h-full bg-white">
                    <div class="mt-[50px]">
                        <span class="text-blue-600 font-bold text-[30px]">
                            Bizning saytdan foydalanish bo'yicha video qo'llanma

                        </span>

                    </div>
                    <div class="mt-[40px] me-[50px] flex gap-5 justify-around">
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



<div class="w-full h-[400px] bg-white">
<div class="flex px-3 py-3">
    <div class="max-w-sm rounded overflow-hidden shadow-lg">
        <img class="w-full" src="https://tailwindcss.com/img/card-top.jpg" alt="Sunset in the mountains">
        <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
            <p class="text-gray-700 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et
                perferendis eaque, exercitationem praesentium nihil.
            </p>
        </div>
        <div class="px-6 py-4">
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#photography</span>
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#travel</span>
            <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">#winter</span>
        </div>
    </div>
</div>
</div>
            <!-- End BODY -->

        </div>
    </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { ref, onMounted } from "vue";
import NumberAnimation from "vue-number-animation";

import gsap from "gsap"
const registr = ref(null)
onMounted(() => {
    gsap.to(registr.value, { x: -0, duration: 2 });
});
</script>

<style scoped>
.borderff {
    background-image: url('../assets/85b60de3-fe65-5769-8e0b-450dc95e956e.jfif');
}
</style>