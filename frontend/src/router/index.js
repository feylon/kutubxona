import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (to, from, saved) => saved ?? (to.hash ? { el: to.hash, behavior: "smooth" } : { top: 0 }),
  routes: [
    {
      path: "/",
      component: () => import("../layouts/PublicLayout.vue"),
      children: [
        { path: "", name: "home", component: () => import("../pages/Home.vue") },
        { path: "books", name: "books", component: () => import("../pages/Books.vue") },
        { path: "books/:id", name: "book", component: () => import("../pages/BookDetail.vue"), props: true },
        { path: "orders", name: "orders", component: () => import("../pages/Orders.vue"), meta: { auth: true } },
        { path: "profile", name: "profile", component: () => import("../pages/Profile.vue"), meta: { auth: true } },
      ],
    },
    {
      path: "/books/:id/read",
      name: "reader",
      component: () => import("../pages/Reader.vue"),
      props: true,
      meta: { auth: true, title: "O'qish" },
    },
    { path: "/login", name: "login", component: () => import("../pages/Login.vue"), meta: { guest: true, title: "Kirish" } },
    { path: "/register", name: "register", component: () => import("../pages/Register.vue"), meta: { guest: true, title: "Ro'yxatdan o'tish" } },
    {
      path: "/admin",
      component: () => import("../layouts/AdminLayout.vue"),
      meta: { auth: true, roles: ["admin", "superadmin"] },
      children: [
        { path: "", name: "admin-dashboard", component: () => import("../pages/admin/Dashboard.vue"), meta: { title: "Boshqaruv paneli" } },
        { path: "books", name: "admin-books", component: () => import("../pages/admin/Books.vue"), meta: { title: "Kitoblar" } },
        { path: "categories", name: "admin-categories", component: () => import("../pages/admin/Categories.vue"), meta: { title: "Kategoriyalar" } },
        { path: "orders", name: "admin-orders", component: () => import("../pages/admin/Orders.vue"), meta: { title: "Buyurtmalar" } },
        { path: "users", name: "admin-users", component: () => import("../pages/admin/Users.vue"), meta: { title: "Foydalanuvchilar" } },
      ],
    },
    { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("../pages/NotFound.vue") },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  await auth.bootstrap();

  if (to.meta.guest && auth.isAuthenticated) {
    return auth.isAdmin ? { name: "admin-dashboard" } : { name: "home" };
  }
  const needsAuth = to.matched.some((r) => r.meta.auth);
  if (needsAuth && !auth.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }
  const roles = to.matched.flatMap((r) => r.meta.roles ?? []);
  if (roles.length && !roles.includes(auth.user?.role)) {
    return { name: "home" };
  }
});

router.afterEach((to) => {
  const title = to.meta.title ?? to.matched.findLast((r) => r.meta.title)?.meta.title;
  document.title = title ? `${title} · Kutubxona` : "Kutubxona";
});
