<template>
    <div class=" min-w-full bg-slate-100 min-h-screen ">
        <div
            class="relative min-w-full text-white bg-blue-400 h-[70px] sticky top-0 justify-between pe-4 flex items-center shadow-blue-200 drop-shadow-sm shadow-lg ">
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




            <div class="w-full rounded-md  flex justify-start h-[400px] flex-col  items-start mt-5 pt-4 bg-blue-600   ">
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
                <div style="border-radius: 100px 0px 85px 0px;" class="min-w-full  h-full bg-white">
                    salom
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