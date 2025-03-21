<script setup>
const page = ref('Main');
const userRatings = ref([]);

const { data: beers } = await useAsyncData('beers', () => $fetch('/api/connection'));
const { data: ratings } = await useAsyncData("ratings", () => $fetch("/api/ratings"));

const getAverageRating = (beerId) => {
  const stringId = beerId.toString();
  const beerRatings = ratings.value.filter(rating => rating.bier_id === stringId);

  if (beerRatings.length === 0) return 0;

  const totalRating = beerRatings.reduce((acc, rating) => acc + rating.rating, 0);
  const average = totalRating / beerRatings.length;

  return Math.round(average * 10) / 10;
};

const getUserRating = (beerId) => {
  const ratingEntry = userRatings.value.find(r => r.bier_id === beerId.toString());
  return ratingEntry ? ratingEntry.rating : 0;
};

const getLikes = async (user_id) => {
  const request = await fetch(`/api/rate?user_id=${user_id}`, {
    method: "GET",
  });
  if (!request.ok) {
    return console.error("Like Error");
  }
  const data = await request.json();
  userRatings.value = data;

  // Na het ophalen van de likes, herfetch de ratings data
  await fetchRatings();
};

const fetchRatings = async () => {
  // Herhaal de fetch om de ratings opnieuw op te halen
  const { data } = await useAsyncData("ratings", () => $fetch("/api/ratings"));
  ratings.value = data;
};


getLikes(88);

const rateBeer = async (rating, bier_id, user_id) => {
  const request = await fetch('/api/rate', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rating,
      bier_id,
      user_id
    })
  })
  if (!request.ok) {
    return console.error("Like Error");
  }
  const data = await request.json();
  console.log(data);
  // Refetch data
  getLikes(88);
  getAverageRating(bier_id);
}
</script>

<template>
  <section class="container p-4 mx-auto">
    <div class="sm:flex sm:items-center sm:justify-between">

      <div>
        <div class="flex items-center gap-x-3">
          <h2 class="text-lg font-medium text-gray-800 dark:text-white">Biertjes</h2>

          <span class="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">{{beers.length}} biertjes</span>
        </div>
      </div>
    </div>

    <div class="mt-6 md:flex md:items-center md:justify-between">
      <div class="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
        <button @click="page = 'Main'" :class="page === 'Main' && 'bg-gray-100'" class="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
          All Beers
        </button>

        <button @click="page = 'Top10'" :class="page === 'Top10' && 'bg-gray-100'" class="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">
          Top 10
        </button>
      </div>

      <div class="relative flex items-center mt-4 md:mt-0">
            <span class="absolute">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </span>

        <input type="text" placeholder="Search" class="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40">
      </div>
    </div>

    <div class="flex flex-col mt-6">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">

            <table v-if="page === 'Main'" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <button class="flex items-center gap-x-3 focus:outline-none">
                    <span>Naam</span>

                    <svg class="h-3" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z" fill="currentColor" stroke="currentColor" stroke-width="0.1" />
                      <path d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z" fill="currentColor" stroke="currentColor" stroke-width="0.1" />
                      <path d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z" fill="currentColor" stroke="currentColor" stroke-width="0.3" />
                    </svg>
                  </button>
                </th>
                <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Type
                </th>

                <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Gisting
                </th>

                <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Prijs</th>

                <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  Beoordelen
                </th>
                <th scope="col" class="relative py-3.5 px-4">
                  <span class="sr-only">AvgRate</span>
                </th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
              <tr v-for="beer in beers" :key="beer.id">
                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">
                  <div>
                    <h2 class="font-medium text-gray-800 dark:text-white ">{{ beer.name }}</h2>
                    <p class="text-sm font-normal text-gray-600 dark:text-gray-400">{{beer.brewer}}</p>
                  </div>
                </td>
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <div>
                    <h4 class="text-gray-700 dark:text-gray-200 capitalize">{{beer.type}}</h4>
                  </div>
                </td>
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <div>
                    <h4 class="text-gray-700 dark:text-gray-200 capitalize">{{beer.yeast}}</h4>
                    <p class="text-gray-500 dark:text-gray-400">{{Math.round(beer.perc * 100)}}%</p>
                  </div>
                </td>
                <td class="px-4 py-4 text-sm whitespace-nowrap">
                  <div class="flex items-center">
                    €{{beer.purchase_price}}
                  </div>
                </td>

                <td class="px-4 py-4 text-sm whitespace-nowrap">


                  <div class="flex items-center">
                    <button v-for="index in 5"
                            :key="'Star-' + index"
                            @click="rateBeer(index, beer.id, 88)"
                            class="flex items-center justify-center p-1 transition-colors duration-200 rounded-lg hover:bg-gray-100 active:bg-gray-200"
                            :class="{'text-yellow-400 hover:bg-yellow-100 active:bg-yellow-200': index <= getUserRating(beer.id), 'text-gray-300': index > getUserRating(beer.id)}">
                      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                      </svg>
                    </button>


                    <button class="hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 rounded-full p-2 ml-10">
                      <svg class="w-4 h-4 text-gray-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1v3m5-3v3m5-3v3M1 7h7m1.506 3.429 2.065 2.065M19 7h-2M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm6 13H6v-2l5.227-5.292a1.46 1.46 0 0 1 2.065 2.065L8 16Z"/>
                      </svg>
                    </button>

                  </div>
                </td>
                <td>
                  <div class="flex flex-row">
                    <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">{{ getAverageRating(beer.id) }}</p>
                    <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
                    <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>

<!--            <table v-if="page === 'Top10'" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">-->
<!--              <thead class="bg-gray-50 dark:bg-gray-800">-->
<!--              <tr>-->
<!--                <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">-->
<!--                  <button class="flex items-center gap-x-3 focus:outline-none">-->
<!--                    <span>Naam</span>-->

<!--                    <svg class="h-3" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                      <path d="M2.13347 0.0999756H2.98516L5.01902 4.79058H3.86226L3.45549 3.79907H1.63772L1.24366 4.79058H0.0996094L2.13347 0.0999756ZM2.54025 1.46012L1.96822 2.92196H3.11227L2.54025 1.46012Z" fill="currentColor" stroke="currentColor" stroke-width="0.1" />-->
<!--                      <path d="M0.722656 9.60832L3.09974 6.78633H0.811638V5.87109H4.35819V6.78633L2.01925 9.60832H4.43446V10.5617H0.722656V9.60832Z" fill="currentColor" stroke="currentColor" stroke-width="0.1" />-->
<!--                      <path d="M8.45558 7.25664V7.40664H8.60558H9.66065C9.72481 7.40664 9.74667 7.42274 9.75141 7.42691C9.75148 7.42808 9.75146 7.42993 9.75116 7.43262C9.75001 7.44265 9.74458 7.46304 9.72525 7.49314C9.72522 7.4932 9.72518 7.49326 9.72514 7.49332L7.86959 10.3529L7.86924 10.3534C7.83227 10.4109 7.79863 10.418 7.78568 10.418C7.77272 10.418 7.73908 10.4109 7.70211 10.3534L7.70177 10.3529L5.84621 7.49332C5.84617 7.49325 5.84612 7.49318 5.84608 7.49311C5.82677 7.46302 5.82135 7.44264 5.8202 7.43262C5.81989 7.42993 5.81987 7.42808 5.81994 7.42691C5.82469 7.42274 5.84655 7.40664 5.91071 7.40664H6.96578H7.11578V7.25664V0.633865C7.11578 0.42434 7.29014 0.249976 7.49967 0.249976H8.07169C8.28121 0.249976 8.45558 0.42434 8.45558 0.633865V7.25664Z" fill="currentColor" stroke="currentColor" stroke-width="0.3" />-->
<!--                    </svg>-->
<!--                  </button>-->
<!--                </th>-->
<!--                <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">-->
<!--                  Type-->
<!--                </th>-->

<!--                <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">-->
<!--                  Gisting-->
<!--                </th>-->

<!--                <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">Prijs</th>-->

<!--                <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">-->
<!--                  Beoordelen-->
<!--                </th>-->
<!--                <th scope="col" class="relative py-3.5 px-4">-->
<!--                  <span class="sr-only">AvgRate</span>-->
<!--                </th>-->
<!--              </tr>-->
<!--              </thead>-->
<!--              <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">-->
<!--              <tr v-for="beer in beers" :key="beer.id">-->
<!--                <td class="px-4 py-4 text-sm font-medium whitespace-nowrap">-->
<!--                  <div>-->
<!--                    <h2 class="font-medium text-gray-800 dark:text-white ">{{ beer.name }}</h2>-->
<!--                    <p class="text-sm font-normal text-gray-600 dark:text-gray-400">{{beer.brewer}}</p>-->
<!--                  </div>-->
<!--                </td>-->
<!--                <td class="px-4 py-4 text-sm whitespace-nowrap">-->
<!--                  <div>-->
<!--                    <h4 class="text-gray-700 dark:text-gray-200 capitalize">{{beer.type}}</h4>-->
<!--                  </div>-->
<!--                </td>-->
<!--                <td class="px-4 py-4 text-sm whitespace-nowrap">-->
<!--                  <div>-->
<!--                    <h4 class="text-gray-700 dark:text-gray-200 capitalize">{{beer.yeast}}</h4>-->
<!--                    <p class="text-gray-500 dark:text-gray-400">{{Math.round(beer.perc * 100)}}%</p>-->
<!--                  </div>-->
<!--                </td>-->
<!--                <td class="px-4 py-4 text-sm whitespace-nowrap">-->
<!--                  <div class="flex items-center">-->
<!--                    €{{beer.purchase_price}}-->
<!--                  </div>-->
<!--                </td>-->

<!--                <td class="px-4 py-4 text-sm whitespace-nowrap">-->


<!--                  <div class="flex items-center">-->
<!--                    <button v-for="index in 5"-->
<!--                            :key="'Star-' + index"-->
<!--                            @click="rateBeer(index, beer.id, 88)"-->
<!--                            class="flex items-center justify-center p-1 transition-colors duration-200 rounded-lg hover:bg-gray-100 active:bg-gray-200"-->
<!--                            :class="{'text-yellow-400 hover:bg-yellow-100 active:bg-yellow-200': index <= getUserRating(beer.id), 'text-gray-300': index > getUserRating(beer.id)}">-->
<!--                      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">-->
<!--                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>-->
<!--                      </svg>-->
<!--                    </button>-->


<!--                    <button class="hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 rounded-full p-2 ml-10">-->
<!--                      <svg class="w-4 h-4 text-gray-700 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">-->
<!--                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1v3m5-3v3m5-3v3M1 7h7m1.506 3.429 2.065 2.065M19 7h-2M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm6 13H6v-2l5.227-5.292a1.46 1.46 0 0 1 2.065 2.065L8 16Z"/>-->
<!--                      </svg>-->
<!--                    </button>-->

<!--                  </div>-->
<!--                </td>-->
<!--                <td>-->
<!--                  <div class="flex flex-row">-->
<!--                    <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">{{ getAverageRating(beer.id) }}</p>-->
<!--                    <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>-->
<!--                    <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>-->
<!--                  </div>-->
<!--                </td>-->
<!--              </tr>-->
<!--              </tbody>-->
<!--            </table>-->
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 sm:flex sm:items-center sm:justify-between ">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Page <span class="font-medium text-gray-700 dark:text-gray-100">1 of 10</span>
      </div>

      <div class="flex items-center mt-4 gap-x-4 sm:mt-0">
        <a href="#" class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
          </svg>

          <span>
                    previous
                </span>
        </a>

        <a href="#" class="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
                <span>
                    Next
                </span>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>