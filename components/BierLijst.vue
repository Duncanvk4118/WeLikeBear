<script setup>
const { data: beers } = await useFetch('/api/connection');
</script>

<template>
  <div>
    <h2>Bier Lijst 🍻</h2>
    <ul>
      <li v-for="beer in beers" :key="beer.id">{{ beer.name }}</li>
    </ul>
  </div>
</template>

<style scoped>

</style>