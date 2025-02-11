<script setup>
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/vue/24/solid'
const { data: beers } = await useAsyncData('beers', () => $fetch('/api/connection'));

const fetchChanges = async () => {
  const request = await fetch("/api/connection")
  beers.value = await request.json();
  if (!request.ok) {
    throw new Error("Fetch error");
  }
  return true;
}

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
  return await fetchChanges();
}

</script>
<template>
  <div class="px-4 sm:px-6 lg:px-8 pt-4">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Bier lijst</h1>
      </div>
    </div>
    <div class="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead>
        <tr>
          <th scope="col" class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">Naam</th>
          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Brouwer</th>
          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Gisting</th>
          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Percentage</th>
          <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Type</th>
          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Prijs</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="beer in beers"
            :key="beer.id">
          <td class="border-t border-gray-200 hidden px-6 py-3.5 text-sm lg:table-cell">
            <div class="font-medium text-gray-900">
              {{ beer.name }}
            </div>
          </td>
          <td class="border-t border-gray-200 hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell">{{ beer.brewer }}</td>
          <td class="border-t border-gray-200 hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell">{{ beer?.yeast === null ? 'geen' : beer.yeast }}</td>
          <td class="border-t border-gray-200 hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell">{{ beer?.perc === null ? '0' : (Math.floor(beer.perc * 100))}}%</td>
          <td class="border-t border-gray-200 hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell">{{ beer.type }}</td>
          <td class="border-t border-gray-200 hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell">€{{ beer.purchase_price }}</td>
          <td :class="{'border-t border-gray-200': beer.id !== 1, 'border-none': beer.id === 1}" class="px-3 py-3.5 text-sm text-gray-500 md:flex md:flex-row md:justify-between items-center">
            <!-- Like Button -->
            <button @click="handleLikeChange(beer.id, 'Like')" type="button" class="flex flex-1 items-center rounded-md bg-white py-1.5 text-sm font-semibold text-emerald-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white justify-center">
              <HandThumbUpIcon class="size-6" />
            </button>

            <!-- Like Count -->
            <span :class="{ 'text-rose-600': beer.like_count < 0, 'text-black': beer.like_count >= 0 }" class="px-3">
    {{beer.like_count}}
  </span>

            <!-- Dislike Button -->
            <button @click="handleLikeChange(beer.id, 'Dislike')" type="button" class="flex flex-1 items-center rounded-md bg-white py-1.5 text-sm font-semibold text-rose-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white justify-center">
              <HandThumbDownIcon class="size-6" />
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
