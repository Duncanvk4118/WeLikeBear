<script>
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    if (Cookies.get("token")) {
      router.push('/');
    }

    return { router };
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async submitLogin(e) {
      e.preventDefault();

      const formData = {
        email: this.email,
        password: this.password,
      };

      try {
        const request = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!request.ok) {
          const errorData = await request.json();
          throw new Error(errorData.message || "Login failed");
        }

        const data = await request.json();
        if (data && data.body.token) {
          Cookies.set('token', data.body.token, { expires: 1 / 24 });
          console.log("Login successful:", data);

          this.$router.push('/');
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    },
  },
};
</script>

<template>
  <div class="min-h-screen min-w-full flex flex-col items-center justify-center">
    <a href="/register" class="absolute top-5 left-5">Register</a>
    <h1 class="text-3xl p-10">Login</h1>
    <form @submit.prevent="submitLogin" class="w-md mx-auto">
      <div class="mb-5">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
        <input
            type="email"
            id="email"
            v-model="email"
            class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            placeholder="name@gmail.com"
            required
        />
      </div>
      <div class="mb-5">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
        <input
            type="password"
            id="password"
            v-model="password"
            class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            required
        />
      </div>
      <button
          type="submit"
          class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Login
      </button>
    </form>
  </div>
</template>

<style scoped>
</style>
