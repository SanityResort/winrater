<script setup lang="ts">
import CoachLookup from "./coachLocator/Component.vue";
import Rating from "./rating/Component.vue"
import {ref} from "vue";
import { Store } from "@/rating/store";
import { match } from "@/rating/mapper";

const matchCount = ref(0);
const coachName = ref("");
const stores = ref([]);

function processMatches(matches: FumbblMatch[]) {
  stores.value.push(new Store(coachName.value, matches.map(fumbblMatch => match(fumbblMatch, coachName.value)) ))
}



</script>

<template>
  <header>
    <CoachLookup @matches="((matches) => { processMatches(matches) })" @count="((count) => { matchCount = count })"
                 @coach="((coach) => { coachName = coach})" />
    {{ matchCount }}

    <Rating v-for="store in stores" :store="store" :key="store.coachName"/>

  </header>

  <main>

  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  display: flex;
  place-items: flex-start;
}


header .wrapper {
  display: flex;
  place-items: flex-start;
  flex-wrap: wrap;
}

</style>
