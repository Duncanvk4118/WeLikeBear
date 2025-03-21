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
      confirmPassword: "",
      username: ""
    };
  },
  methods: {
    async submitRegister(e) {
      e.preventDefault();

      if (this.password !== this.confirmPassword) {
        console.error("Passwords do not match");
        return;
      }

      const formData = {
        email: this.email,
        password: this.password,
        username: this.username
      };

      try {
        const request = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!request.ok) {
          const errorData = await request.json();
          throw new Error(errorData.body || "Registration failed");
        }

        const data = await request.json();
        if (data) {
          Cookies.set('token', data.body.token, {expires: 1/24}); // Store token with a 1-hour expiry
          this.$router.push('/'); // Redirect to home after successful registration
        }
        console.log("Registration successful:", data);
      } catch (error) {
        console.error("Error:", error.message);
      }
    },
  },
};
</script>

<template>
  <div class="min-h-screen min-w-full flex flex-col items-center justify-center">
    <a href="/login" class="absolute top-5 left-5">Login</a>
    <h1 class="text-3xl p-10">Register</h1>
    <form @submit.prevent="submitRegister" class="w-md mx-auto">
      <div class="mb-5">
        <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
        <input v-model="username" type="text" id="username" class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" required />
      </div>
      <div class="mb-5">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
        <input v-model="email" type="email" id="email" class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" placeholder="name@gmail.com" required />
      </div>
      <div class="mb-5">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
        <input v-model="password" type="password" id="password" class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" required />
      </div>
      <div class="mb-5">
        <label for="confirmPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
        <input v-model="confirmPassword" type="password" id="confirmPassword" class="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light" required />
      </div>
      <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register</button>
    </form>
  </div>
</template>

<style scoped>
</style>
