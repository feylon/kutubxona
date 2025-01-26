// Auth user
import register from "./Auth/Registration.js";
import login from "./Auth/login.js";
import logout from "./Auth/logout.js";
import getTopBook from "./Book/getTopBook.js";
import getBookById from "./Book/getBookById.js";
import profile from "./Auth/profile.js";

// Book
import getBooksWithPagination from "./Book/getBooksWithPagination.js";
import getByCategory from "./Book/getByCategory.js";
import getHasBookCategory from "./Book/getHasBookCategory.js";

// Add book
import addorder from "./Order/addOrder.js";
import getorder from "./Order/getOrder.js";
import deleteOrder from "./Order/deleteOrder.js"
import EditOrder from "./Order/EditOrder.js"

export default [
  //   Auth user
  { path: "/register", component: register },
  { path: "/login", component: login },
  { path: "/signout", component: logout },
  { path: "/profile", component: profile },

  // BOOK
  { path: "/book/getBooksWithPagination", component: getBooksWithPagination },
  { path: "/book/getByCategory", component: getByCategory },
  { path: "/book/getTopBook", component: getTopBook },
  { path: "/book/getHasBookCategory", component: getHasBookCategory },
  { path: "/book/getBookById", component: getBookById },

  // Add book
  {path : "/book/addorder", component : addorder},
  {path : "/book/getorder", component : getorder},
  {path : "/book/deleteOrder", component : deleteOrder},
  {path : "/book/EditOrder", component : EditOrder}



];
