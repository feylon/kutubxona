// AUTH
import login from "./Auth/login.js";
import profile from "./Auth/profile.js"
import signOut from "./Auth/signOut.js";

// Order
import getOrder from "./Orders/getOrders.js";
import editOrder from "./Orders/EditOrder.js";
import changeorder from "./Orders/ChengeRejected.js";
import getOrdersByCondition from "./Orders/getOrdersByCondition.js";

// GET USERS
import getusers from "./Users/get.js"
export default [

    // AUTH
    {path:"/login", component : login},
    {path:"/profile", component : profile},
    {path : "/signOut", component : signOut},

    {path : "/getorder", component : getOrder},
    {path : "/editOrder", component : editOrder},
    {path : "/changeorder", component : changeorder},
    {path : "/getOrdersByCondition", component : getOrdersByCondition},
// GET USER
    {path : "/getusers", component : getusers}
]