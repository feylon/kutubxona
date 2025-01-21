import { createRouter, createWebHashHistory } from "vue-router";
import  SuperAdminlogin from "../src/components/SuperAdmin/Auth/login.vue"


const router = createRouter({
    history : createWebHashHistory(),
    routes : [
        {path : "/superadmin/login", component : SuperAdminlogin},
        {path : "/superadmin/", component : ()=>import ("../src/components/SuperAdmin/Dashtboard.vue"),
            children : [
                {path : "/superadmin/admin", component : ()=>import("../src/components/SuperAdmin/Admin/CAdmin.vue.vue")},
                {path : "/superadmin/addadmin", component : ()=>import("../src/components/SuperAdmin/Admin/addadmin.vue")},
                {path : "/superadmin/edit/:id/:fullname/:username", component : ()=>import("../src/components/SuperAdmin/Admin/EditAdmin.vue")},


            ]
        }
    ]
}) ;

export default router;