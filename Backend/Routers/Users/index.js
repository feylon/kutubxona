// Auth user
import register from "./Auth/Registration.js";
import login from "./Auth/login.js"
import logout from "./Auth/logout.js"

export default [
//   Auth user
    {path : "/register", component : register},
    {path : "/login", component : login},
    {path : "/signout", component : logout}
];