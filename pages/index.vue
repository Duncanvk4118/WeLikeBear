<template>
  <div class="container mx-auto">
    <RouterLink to="login" class="group absolute left-5 top-5 text-lg transition-all duration-300 ease-in-out text-cyan-800">
      <span class="bg-left-bottom bg-gradient-to-r from-cyan-800 to-cyan-700 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">Login</span>
      </RouterLink>
    <div class="pt-10">
    <BierLijst />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>