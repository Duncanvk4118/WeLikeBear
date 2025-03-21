<script>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import Cookies from "js-cookie";


export default {
  setup() {
    const router = useRouter();
    const userData = ref(false);

    // Check of er een token is
    onMounted(() => {
      if (Cookies.get("token")) {
        userData.value = true;
      }
    });

    // Logout functie
    const logout = () => {
      Cookies.remove("token");
      userData.value = false;
      router.push("/login");
    };

    return { userData, logout };
  },
};
</script>

<template>
  <div class="container mx-auto">
    <RouterLink
        v-if="!userData"
        to="/login"
        class="group absolute left-5 top-5 text-lg transition-all duration-300 ease-in-out text-cyan-800"
    >
      <span
          class="bg-left-bottom bg-gradient-to-r from-cyan-800 to-cyan-700 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
      >
        Login
      </span>
    </RouterLink>

    <button
        v-if="userData"
        @click="logout"
        class="group absolute left-5 top-5 text-lg transition-all duration-300 ease-in-out text-rose-800 cursor-pointer"
    >
      <span
          class="bg-left-bottom bg-gradient-to-r from-rose-800 to-rose-700 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
      >
        Logout
      </span>
    </button>

    <div class="pt-10">
      <BierLijst />
    </div>
  </div>
</template>
