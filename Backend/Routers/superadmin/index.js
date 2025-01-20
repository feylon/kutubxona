// AUTH
import login from "./Auth/login.js";
import profile from "./Auth/profile.js"
import signOut from "./Auth/signOut.js";

// Admin
import addAdmin from "./admin/addAdmin.js"
import EditAdmin from "./Admin/editAdmin.js"
export default [

    // AUTH
    {path:"/login", component : login},
    {path:"/profile", component : profile},
    {path : "/signOut", component : signOut},

    // ADMIN
    {path:"/addadmin", component : addAdmin},
    {path : "/editadmin", component : EditAdmin}
]