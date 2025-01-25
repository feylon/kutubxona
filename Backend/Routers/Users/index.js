// Auth user
import register from "./Auth/Registration.js";
import login from "./Auth/login.js"
import logout from "./Auth/logout.js"
import getTopBook from "./Book/getTopBook.js";
import getBookById from "./Book/getBookById.js"

import getBooksWithPagination from "./Book/getBooksWithPagination.js";
import getByCategory from "./Book/getByCategory.js"
import getHasBookCategory from "./Book/getHasBookCategory.js"
export default [
//   Auth user
    {path : "/register", component : register},
    {path : "/login", component : login},
    {path : "/signout", component : logout},


    // BOOK
    {path : "/book/getBooksWithPagination", component : getBooksWithPagination},
    {path : "/book/getByCategory", component : getByCategory},
    {path : "/book/getTopBook", component : getTopBook},
    {path : "/book/getHasBookCategory", component : getHasBookCategory},
    {path : "/book/getBookById", component : getBookById},

    

];