<template>
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
  <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
    <form>
      <div class="mb-4">
        <label for="username" class="block text-gray-600 font-medium mb-2">Username</label>
        <input type="text" id="username" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" placeholder="Username" />
      </div>
      <div class="mb-4">
        <label for="password" class="block text-gray-600 font-medium mb-2">Parol</label>
        <input type="password" id="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" placeholder="Parol" />
      </div>
      <div class="mb-4 text-right mt-3"  >
    </div>
      <button type="submit" class="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition duration-300">Login</button>
    </form>
    <p class="text-center text-gray-600 text-sm mt-6">
      Ro'yxatdan o'tmadingizmi ? <router-link to="/"  class="text-blue-500 hover:underline">Ro'yxatdan o'tish</router-link>
    </p>
  </div>
</div>

</template>

<script setup>
import {ref} from "vue";

</script>

<style lang="scss" scoped>

</style>