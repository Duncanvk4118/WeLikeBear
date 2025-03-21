<template>
    <div>
        <div class="flex w-[90%] mx-auto container">
            <div class="w-1/8 mr-10">
                <h1 class="font-bold">Top 10 Beers</h1>
                <ul v-if="results.beers.length">
                    <li v-for="beer in results.beers" :key="beer.bier_id">
                        ID: {{ beer.bier_id }} - Rating: {{ beer.rating }}
                    </li>
                </ul>
                <p v-else>No results found.</p>
            </div>
            <div class="w-1/4 mr-10">
                <h1 class="font-bold">Top 10 Brewers</h1>
                <ul v-if="results.brewers.length">
                    <li v-for="brewer in results.brewers" :key="brewer.brewer">
                        Brewer: {{ brewer.brewer }} - Average Rating: {{ brewer.average_rating }}
                    </li>
                </ul>
                <p v-else>No results found.</p>
            </div>
            <div class="w-1/4 mr-10">
                <h1 class="font-bold">Top 10 Types</h1>
                <ul v-if="results.types.length">
                    <li v-for="type in results.types" :key="type.type">
                        Type: {{ type.type }} - Average Rating: {{ type.average_rating }}
                    </li>
                </ul>
                <p v-else>No results found.</p>
            </div>
            <div class="w-1/4 mr-10">
                <h1 class="font-bold">Top 10 Beers by Number of Ratings</h1>
                <ul v-if="results.beersMostRated.length">
                    <li v-for="beer in results.beersMostRated" :key="beer.id">
                        ID: {{ beer.id }} - Name: {{ beer.name }} - Ratings: {{ beer.rating_count }}
                    </li>
                </ul>
                <p v-else>No results found.</p>
            </div>
        </div>
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