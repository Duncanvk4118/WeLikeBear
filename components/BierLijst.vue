<script setup>
const { data: beers } = await useAsyncData('beers', () => $fetch('/api/connection'));

const handleLike = (beer) => {
    beer.like_count++;
};

const handleDislike = (beer) => {
    beer.like_count--;
};
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
                            @click="handleLike(beer)"
                            class="text-green-500"
                        >
                            👍
                        </button>
                        <span class="text-gray-500">
                            {{ beer.like_count }}
                        </span>
                        <button
                            @click="handleDislike(beer)"
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