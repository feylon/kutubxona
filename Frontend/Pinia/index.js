import { defineStore } from "pinia";
import { ref, computed } from "vue";
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
  const orders = ref([]);
  const doubleCount = computed(() => count.value * 2);

  function checkBookIdInOrders(id) {
    return orders.value.some(order => order.book.id === id);
  }

  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment, orders, checkBookIdInOrders };
});
export { Superadmin, User };

