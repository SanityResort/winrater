<script setup lang="ts">
import CoachLookup from "./coachLocator/Component.vue";
import { ref } from "vue";

const matchData = ref([]);
const matchCount = ref(0);

</script>

<template>
  <header>


  </header>

  <main>
    <CoachLookup @matches="((matches) => { matchData = matches})" @count="((count) => { matchCount = count })" />

    {{ matchData.length }}

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
