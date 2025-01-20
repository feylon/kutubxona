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
import changeStatususer from "./user/changeStatus.js";

// BookCategory

import AddBookCategory from "./BookCategory/AddBookCategory.js";
import EditBookCategory from "./BookCategory/EditBookCategory.js";
import GetAllBookCategories from "./BookCategory/GetAllBookCategories.js"
import GetByBookCategories from "./BookCategory/GetByBookCategories.js";

// Book
import Addbook from "./Book/AddBook.js";
import getbook from "./Book/getBooksWithPagination.js";
import Editbook from "./Book/EditBook.js";
import deleteBook from "./book/DeleteBook.js";
import pdfload from "./book/UploadPdf.js";
import UploadPics from "./Book/UploadPics.js";
import getByCategory from "./Book/getByCategory.js"
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
    {path : "/users/changestatus", component : changeStatususer},

    // BookCategory
    {path : "/BookCategory/AddBookCategory", component : AddBookCategory},
    {path : "/BookCategory/EditBookCategory", component : EditBookCategory},
    {path : "/BookCategory/GetAllBookCategories", component : GetAllBookCategories},
    {path : "/BookCategory/GetByBookCategories", component : GetByBookCategories},

    // Book
    {path : "/book/Addbook", component : Addbook},
    {path : "/book/get", component : getbook},
    {path : "/book/Editbook", component : Editbook},
    {path : "/book/deleteBook", component : deleteBook},
    {path : "/book/pdfload", component : pdfload},
    {path : "/book/UploadPics", component : UploadPics},
    {path : "/book/getByCategory", component : getByCategory}
]