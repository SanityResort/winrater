<script setup lang="ts">
import CoachLookup from "./coachLocator/Component.vue";
import { ref } from "vue";

const matchData = ref([]);
const matchCount = ref(0);

function split(data: FumbblMatch[]): string[] {


  return data.map(value => {
    const parts = ["Division: " + value.division];

    if (value.scheduler != "None") {
      parts.push("Scheduler: " + value.scheduler);
    }
    return parts.join(" ");

  }).filter((value, index, array) => {
    return array.indexOf(value) == index;
  }).sort();


}

</script>

<template>
  <header>


  </header>

  <main>
    <CoachLookup @matches="((matches) => { matchData = matches})" @count="((count) => { matchCount = count })" />

    <div v-for="(data, index) in split(matchData)" :key="index">
      {{ data }}
    </div>

    {{ matchCount }}


  </main>
</template>

<style scoped>
header {
    line-height: 1.5;
}


@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }


    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }
}
</style>
