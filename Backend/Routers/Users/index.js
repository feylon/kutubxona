// Auth user
import register from "./Auth/Registration.js";
import login from "./Auth/login.js"
import logout from "./Auth/logout.js"



import getBooksWithPagination from "./Book/getBooksWithPagination.js";
import getByCategory from "./Book/getByCategory.js"
export default [
//   Auth user
    {path : "/register", component : register},
    {path : "/login", component : login},
    {path : "/signout", component : logout},


    // BOOK
    {path : "/book/getBooksWithPagination", component : getBooksWithPagination},
    {path : "/book/getByCategory", component : getByCategory}
];