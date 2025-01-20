// AUTH
import login from "./Auth/login.js";
import profile from "./Auth/profile.js"
import signOut from "./Auth/signOut.js";

// Admin
import addAdmin from "./admin/addAdmin.js"
import EditAdmin from "./Admin/editAdmin.js"
import changestatus from "./Admin/changeStatus.js"
import getadmin from "./Admin/getAdmin.js"


// Users
import getUser from "./user/get.js";
import changeStatususer from "./user/changeStatus.js"
export default [

    // AUTH
    {path:"/login", component : login},
    {path:"/profile", component : profile},
    {path : "/signOut", component : signOut},

    // ADMIN
    {path:"/addadmin", component : addAdmin},
    {path : "/editadmin", component : EditAdmin},
    {path : "/admin/changestatus", component : changestatus},
    {path : "/admin/getadmin", component : getadmin},

    // Users

    {path : "/users/getusers", component : getUser},
    {path : "/users/changestatus", component : changeStatususer}


]