<script setup>
const { data: beers } = await useAsyncData('beers', () => $fetch('/api/connection'));

const handleLikeChange = async (bierID, type) => {
  const request = await fetch(`/api/connection/${bierID}`, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      type
    )
  });
  if (!request.ok) {
    throw new Error("Fetch failed")
  }
  return true;
}

</script>

<template>
  <div>
    <h2 class="flex text-2xl font-bold mb-4 w-full justify-center">
      Bier Lijst 🍻
    </h2>
    <ul>
      <li
          v-for="beer in beers"
          :key="beer.id"
          class="flex py-2 border-b border-gray-300"
      >
        <div class="flex justify-between w-full items-center">
                    <span>
                        {{ beer.name }} - {{ beer.brewer }}
                    </span>
          <div class="flex items-center space-x-2">
            <button
                @click="handleLikeChange(beer.id, 'Like')"
                class="text-green-500"
            >
              👍
            </button>
            <span class="text-gray-500">
                            {{ beer.like_count }}
                        </span>
            <button
                @click="handleLikeChange(beer.id, 'Dislike')"
                class="text-red-500"
            >
              👎
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>