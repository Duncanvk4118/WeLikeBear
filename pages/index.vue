<script setup>
import Cookies from 'js-cookie'
const cookieBox = Cookies.get('cookie_id')

if (!cookieBox) {
  Cookies.set('cookie_id','test', {expires: 7})
}

console.log(cookieBox)
</script>

<template>
  <div class="container mx-auto">
    <BierLijst />
  </div>
</template>
