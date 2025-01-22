import { defineStore } from 'pinia'
import {ref, computed} from "vue";
const Superadmin = defineStore('counter', () => {
    const count = ref(0)
    const name = ref('Eduardo');
    const bookEdit = ref(false);
    const doubleCount = computed(() => count.value * 2)
    function increment() {
      count.value++
    }
  
    return { count, name, doubleCount, bookEdit, increment }
  });


export {Superadmin}