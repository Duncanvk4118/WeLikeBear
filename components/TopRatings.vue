<template>
    <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg mb-6">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
                <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <button class="flex items-center gap-x-3 focus:outline-none">
                        <span>Top 10 Bieren</span>
                    </button>
                </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="beer in results.beers" :key="beer.bier_id">
                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                    ID: {{ beer.bier_id }} - Rating: {{ beer.rating }}
                </td>
            </tr>
            </tbody>
        </table>
    </div>

    <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg mb-6">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-   gray-800">
            <tr>
                <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <button class="flex items-center gap-x-3 focus:outline-none">
                        <span>Top 10 Brouwers</span>
                    </button>
                </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="brewer in results.brewers" :key="brewer.brewer">
                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                    Brewer: {{ brewer.brewer }} - Average Rating: {{ brewer.average_rating }}
                </td>
            </tr>
            </tbody>
        </table>
    </div>

    <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg mb-6">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
                <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <button class="flex items-center gap-x-3 focus:outline-none">
                        <span>Top 10 Types</span>
                    </button>
                </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="type in results.types" :key="type.type">
                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                    Type: {{ type.type }} - Average Rating: {{ type.average_rating }}
                </td>
            </tr>
            </tbody>
        </table>
    </div>

    <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
                <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <button class="flex items-center gap-x-3 focus:outline-none">
                        <span>Top 10 Beers by Number of Ratings</span>
                    </button>
                </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
            <tr v-for="beer in results.beersMostRated" :key="beer.id">
                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                    ID: {{ beer.id }} - Name: {{ beer.name }} - Ratings: {{ beer.rating_count }}
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            results: {
                beers: [],
                brewers: [],
                types: [],
                beersMostRated: []
            }
        };
    },
    async mounted() {
        const response = await fetch('/api/top10');
        this.results = await response.json();
    }
};
</script>

<style scoped>
/* Add your styles here */
</style>