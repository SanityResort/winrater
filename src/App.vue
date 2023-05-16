<script setup lang="ts">
import CoachLookup from "./coachLocator/Component.vue";
import {ref} from "vue";

const matchData = ref([]);
const matchCount = ref(0);

// .map(fumbblMatch => match(fumbblMatch, this.coachName))

</script>

<template>
  <header>
    <CoachLookup @matches="((matches) => { matchData = matches})" @count="((count) => { matchCount = count })"/>
    {{ matchCount }}

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
