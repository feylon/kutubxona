import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

const Superadmin = defineStore("counter", () => {
  const count = ref(0);
  const name = ref("Eduardo");
  const bookEdit = ref(false);
  const UploadPicsBook = ref(false);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, name, doubleCount, bookEdit, increment };
});

const User = defineStore("counter", () => {
  const count = ref(0);
  const isAuth = ref(false);
  const orders = ref(loadOrdersFromLocalStorage());
  const UpdateOrder = ref(false);
  const doubleCount = computed(() => count.value * 2);

  function checkBookIdInOrders(id) {
    return orders.value.some((order) => order.book.id === id);
  }

  function increment() {
    count.value++;
  }
  function loadOrdersFromLocalStorage() {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      return JSON.parse(savedOrders); 
    }
    return []; 
  }
  watch(
    orders,
    (newOrders) => {
      saveOrdersToLocalStorage();
    },
    { deep: true }
  );
  function saveOrdersToLocalStorage() {
    localStorage.setItem('orders', JSON.stringify(orders.value)); 
  }
  return {
    count,
    doubleCount,
    increment,
    orders,
    checkBookIdInOrders,
    UpdateOrder,
  };
});
export { Superadmin, User };
