import { createApp } from "vue";
import "./style.css";
import naive from "naive-ui";
import router from "../Pages";
import App from "./App.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from 'pinia'


// * Developer settings
window.url = "http://localhost:4100/api";
window.web_url = "http://localhost:4100";
window.fetchSuperAdmin = async function (url, method, body, router) {
  let options;
  if (body) {
     options = {
      method: method, // HTTP method
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    };
  } else {
    options = {
      method: method, // HTTP method
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      
    };
  };
  console.log(url, options);
  const response = await fetch(`${window.url}${url}`, options);
  if (response.status === 401) {
    router.push("/superadmin/login");
    return;
  }
  if (response.status === 403) {
    router.push("/superadmin/login");
    return;
  }
  return response;
};
window.fetchUser = async function (url, method, body, router) {
  let options;
  if (body) {
     options = {
      method: method, // HTTP method
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    };
  } else {
    options = {
      method: method, // HTTP method
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      
    };
  };
  console.log(url, options);
  const response = await fetch(`${window.url}/users${url}`, options);
  // if (response.status === 401) {
  //   router.push("/superadmin/login");
  //   return;
  // }
  // if (response.status === 403) {
  //   router.push("/superadmin/login");
  //   return;
  // }
  return response;
};
//  Developer settings

// Import all icons
import * as solidIcons from "@fortawesome/free-solid-svg-icons";
import * as regularIcons from "@fortawesome/free-regular-svg-icons";
import * as brandIcons from "@fortawesome/free-brands-svg-icons";
// npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/vue-fontawesome

// Add all icons to the library
const solidIconValues = Object.values(solidIcons).filter(
  (icon) => icon.iconName
); // Filter valid icons
const regularIconValues = Object.values(regularIcons).filter(
  (icon) => icon.iconName
);
const brandIconValues = Object.values(brandIcons).filter(
  (icon) => icon.iconName
);

library.add(...solidIconValues, ...regularIconValues, ...brandIconValues);
const pinia = createPinia();
const app = createApp(App);
app.use(naive);
app.component("fonta", FontAwesomeIcon);
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(router);
app.use(pinia)
app.mount("#app");
