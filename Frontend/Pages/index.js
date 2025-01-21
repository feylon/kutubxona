import { createRouter, createWebHashHistory } from "vue-router";
import  SuperAdminlogin from "../src/components/SuperAdmin/Auth/login.vue"


const router = createRouter({
    history : createWebHashHistory(),
    routes : [
        {path : "/superadmin/login", component : SuperAdminlogin},

    ]
}) ;

export default router;