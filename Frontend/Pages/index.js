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
                {path : "/superadmin/bookCategory", component : ()=>import("../src/components/SuperAdmin/Book/BookCategory.vue")},
                {path : "/superadmin/addbookCategory/:id/:name", component : ()=>import("../src/components/SuperAdmin/Book/editbookCategory.vue")},
                {path : "/superadmin/books", component : ()=>import("../src/components/SuperAdmin/Book/book.vue")},


            ]
        },


// For Users
        {path:'/', component:()=>import("../src/User/lagepage.vue"),
            children:[
                {path:'/', component : ()=>import("../src/User/Landing.vue")},
                {path:'/orders', component : ()=>import("../src/User/orders.vue")}

            ]
        },
        {path:"/login", component : ()=>import ("../src/User/AuthUser/login.vue")},
        {path:"/registr", component : ()=>import ("../src/User/AuthUser/registr.vue")},

// For Admin
        {path:"/admin/login", component : ()=>import ("../src/components/Admin/Auth/login.vue")},
        {path:"/admin", component : ()=>import ("../src/components/Admin/Dashtboard.vue")}

    ]
}) ;

export default router;