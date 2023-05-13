<template>

  <form>
    <input type="text" placeholder="coach name" v-model="coachName" />
    <button id="addButton" @click.prevent="loadData" :disabled="loading">Add</button>
  </form>

</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { load } from "./service";

const emit = defineEmits(["matches", "count"]);

const coachName: Ref<string> = ref(null as string)
const loading = ref(false);

async function loadData() {
  emit("matches", []);

  if (!coachName.value) {
    return;
  }
  loading.value = true;

  emit("matches", await load(coachName.value, (count: number) => emit("count", count)));

  coachName.value = null as string
  loading.value = false;

}

</script>

<style scoped>

</style>