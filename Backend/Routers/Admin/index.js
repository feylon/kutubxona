// AUTH
import login from "./Auth/login.js";
import profile from "./Auth/profile.js"
import signOut from "./Auth/signOut.js";

// Order
import getOrder from "./Orders/getOrders.js";
export default [

    // AUTH
    {path:"/login", component : login},
    {path:"/profile", component : profile},
    {path : "/signOut", component : signOut},

    {path : "/getorder", component : getOrder}
]