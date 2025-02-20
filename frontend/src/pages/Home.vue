<script setup>
import { onMounted, ref, nextTick } from "vue";
import { booksApi, categoriesApi, statsApi } from "../api/index.js";
import { useAuthStore } from "../stores/auth.js";
import { gsap, useReveal, countUp } from "../composables/useGsap.js";
import BookCard from "../components/BookCard.vue";
import BookCover from "../components/BookCover.vue";

const auth = useAuthStore();
const root = ref(null);
const hero = ref(null);
const statEls = ref([]);

const top = ref([]);
const latest = ref([]);
const categories = ref([]);
const stats = ref({ books: 0, categories: 0, readers: 0, delivered: 0 });
const loaded = ref(false);

useReveal(root);

const categoryIcons = ["📖", "✒️", "🏛️", "🔬", "🧸", "💻", "🎨", "🌍"];

onMounted(async () => {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(hero.value.querySelectorAll(".hero-word"), { y: 40, opacity: 0, rotateX: -40, stagger: 0.06, duration: 0.9 })
    .from(hero.value.querySelectorAll(".hero-fade"), { y: 16, opacity: 0, stagger: 0.1, duration: 0.7 }, "-=0.5");

  const [t, l, c, s] = await Promise.all([booksApi.top(), booksApi.latest(), categoriesApi.list(), statsApi.public()]);
  top.value = t.items;
  latest.value = l.items;
  categories.value = c.items;
  stats.value = s;
  loaded.value = true;

  await nextTick();
  gsap.from(hero.value.querySelectorAll(".hero-book"), {
    y: 80, opacity: 0, rotate: () => gsap.utils.random(-10, 10), stagger: 0.1, duration: 1.1, ease: "power4.out",
  });
  hero.value.querySelectorAll(".hero-book").forEach((el, i) => {
    gsap.to(el, { y: "-=12", duration: 2.2 + i * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut", delay: i * 0.2 });
  });
  statEls.value.forEach((el) => countUp(el, Number(el.dataset.value)));
});

const heroWords = "Kitoblar olamiga xush kelibsiz".split(" ");
</script>

<template>
  <div ref="root">
    <!-- HERO -->
    <section ref="hero" class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 -z-10">
        <div class="absolute -left-32 -top-32 size-[480px] rounded-full bg-accent/15 blur-3xl" />
        <div class="absolute -right-24 top-24 size-[380px] rounded-full bg-gold/15 blur-3xl" />
        <svg class="absolute inset-0 size-full opacity-[0.35]" aria-hidden="true"><defs><pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#e2d8c9" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>
      </div>

      <div class="container-x grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <div>
          <p class="hero-fade eyebrow">Onlayn kutubxona · 2025</p>
          <h1 class="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl" style="perspective: 800px">
            <span v-for="(w, i) in heroWords" :key="i" class="hero-word inline-block" :class="i === 1 && 'italic text-accent'">{{ w }}&nbsp;</span>
          </h1>
          <p class="hero-fade mt-6 max-w-lg text-lg leading-relaxed text-ink-3">
            Mumtoz adabiyotdan zamonaviy dasturlashgacha — kitoblarni to'g'ridan-to'g'ri brauzerda o'qing yoki
            qog'oz nusxasiga buyurtma bering.
          </p>
          <div class="hero-fade mt-8 flex flex-wrap gap-3">
            <router-link :to="{ name: 'books' }" class="btn-accent">Kitoblarni ko'rish</router-link>
            <router-link v-if="!auth.isAuthenticated" :to="{ name: 'register' }" class="btn-outline">Bepul ro'yxatdan o'tish</router-link>
            <router-link v-else :to="{ name: 'orders' }" class="btn-outline">Buyurtmalarim</router-link>
          </div>
          <div class="hero-fade mt-10 flex flex-wrap gap-8">
            <div v-for="(s, key) in { books: 'Kitob', readers: 'O\'quvchi', delivered: 'Yetkazilgan' }" :key="key">
              <p class="font-display text-3xl font-semibold"><span :ref="(el) => el && statEls.push(el)" :data-value="stats[key]">0</span>+</p>
              <p class="text-xs font-semibold uppercase tracking-wider text-muted">{{ s }}</p>
            </div>
          </div>
        </div>

        <div class="relative hidden h-[460px] lg:block">
          <div
            v-for="(b, i) in top.slice(0, 5)"
            :key="b.id"
            class="hero-book absolute w-40 transition-transform duration-300 hover:z-20 hover:scale-105"
            :style="{ left: `${[0, 36, 60, 18, 48][i]}%`, top: `${[4, 0, 32, 48, 52][i]}%`, zIndex: i, transform: `rotate(${[-8, 5, -3, 7, -5][i]}deg)` }"
          >
            <router-link :to="{ name: 'book', params: { id: b.id } }"><BookCover :book="b" size="sm" /></router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="container-x py-14">
      <div data-reveal class="mb-8 flex items-end justify-between gap-4">
        <div>
          <p class="eyebrow">Kategoriyalar</p>
          <h2 class="mt-1 font-display text-3xl font-semibold">Nimani o'qimoqchisiz?</h2>
        </div>
        <router-link :to="{ name: 'books' }" class="hidden text-sm font-semibold text-accent hover:underline sm:block">Barchasi →</router-link>
      </div>
      <div data-reveal="stagger" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <router-link
          v-for="(c, i) in categories"
          :key="c.id"
          :to="{ name: 'books', query: { categoryId: c.id } }"
          class="group card flex flex-col gap-3 p-5 transition hover:-translate-y-1 hover:shadow-lift"
        >
          <span class="text-2xl">{{ categoryIcons[i % categoryIcons.length] }}</span>
          <span>
            <span class="block font-display text-base font-semibold leading-tight group-hover:text-accent">{{ c.name }}</span>
            <span class="text-xs text-muted">{{ c.bookCount }} ta kitob</span>
          </span>
        </router-link>
      </div>
    </section>

    <!-- POPULAR -->
    <section class="bg-paper-2/60 py-16">
      <div class="container-x">
        <div data-reveal class="mb-8 flex items-end justify-between gap-4">
          <div>
            <p class="eyebrow">Mashhur</p>
            <h2 class="mt-1 font-display text-3xl font-semibold">Ko'p o'qilayotgan kitoblar</h2>
          </div>
          <router-link :to="{ name: 'books', query: { sort: 'popular' } }" class="text-sm font-semibold text-accent hover:underline">Barchasi →</router-link>
        </div>
        <div data-reveal="stagger" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          <BookCard v-for="b in top.slice(0, 6)" :key="b.id" :book="b" />
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="container-x py-20">
      <div data-reveal class="mx-auto max-w-2xl text-center">
        <p class="eyebrow">Qanday ishlaydi</p>
        <h2 class="mt-1 font-display text-3xl font-semibold text-balance">Uch oddiy qadam — va kitob qo'lingizda</h2>
      </div>
      <div data-reveal="stagger" class="mt-10 grid gap-6 md:grid-cols-3">
        <div v-for="(s, i) in [
          { t: 'Ro\'yxatdan o\'ting', d: 'Bir daqiqada hisob yarating — bepul va majburiyatsiz.' },
          { t: 'Kitobni tanlang', d: 'Kategoriya, muallif yoki nom bo\'yicha qidiring va tanishib chiqing.' },
          { t: 'O\'qing yoki buyurtma bering', d: 'PDF ni brauzerda o\'qing yoki qog\'oz nusxasiga buyurtma qiling.' },
        ]" :key="i" class="card relative overflow-hidden p-7">
          <span class="absolute -right-3 -top-4 font-display text-8xl font-black text-ink/[0.04]">{{ i + 1 }}</span>
          <span class="grid size-10 place-items-center rounded-full bg-accent font-display text-lg font-bold text-white">{{ i + 1 }}</span>
          <h3 class="mt-5 font-display text-xl font-semibold">{{ s.t }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-ink-3">{{ s.d }}</p>
        </div>
      </div>
    </section>

    <!-- LATEST -->
    <section class="container-x pb-8">
      <div data-reveal class="mb-8 flex items-end justify-between gap-4">
        <div>
          <p class="eyebrow">Yangi</p>
          <h2 class="mt-1 font-display text-3xl font-semibold">So'nggi qo'shilgan kitoblar</h2>
        </div>
        <router-link :to="{ name: 'books', query: { sort: 'newest' } }" class="text-sm font-semibold text-accent hover:underline">Barchasi →</router-link>
      </div>
      <div data-reveal="stagger" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <BookCard v-for="b in latest.slice(0, 6)" :key="b.id" :book="b" />
      </div>
    </section>

    <!-- CTA -->
    <section v-if="!auth.isAuthenticated" class="container-x py-16">
      <div data-reveal class="relative overflow-hidden rounded-3xl bg-ink px-8 py-14 text-center text-paper sm:px-16">
        <div class="absolute -left-20 -top-20 size-72 rounded-full bg-accent/40 blur-3xl" />
        <div class="absolute -bottom-24 -right-16 size-72 rounded-full bg-gold/30 blur-3xl" />
        <h2 class="relative font-display text-3xl font-semibold text-balance sm:text-4xl">O'qishni bugun boshlang</h2>
        <p class="relative mx-auto mt-3 max-w-xl text-paper/70">Ro'yxatdan o'tgan foydalanuvchilar barcha kitoblarni onlayn o'qishi va buyurtma berishi mumkin.</p>
        <router-link :to="{ name: 'register' }" class="btn-accent relative mt-8">Hisob yaratish</router-link>
      </div>
    </section>
  </div>
</template>
