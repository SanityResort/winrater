<template>

  <form>
    <input type="text" placeholder="coach name" v-model="coachName" />
    <button id="addButton" @click.prevent="loadData" :disabled="loading">Add</button>
  </form>

  <div class="error">
    {{ errorMessage }}
  </div>

</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { load } from "./service";

const emit = defineEmits(["matches", "count", "coach"]);

const coachName: Ref<string> = ref("")
const loading = ref(false);
const errorMessage: Ref<string> = ref("")

const matchesCallback = (data: []) => emit("matches", data);
const errorCallback = (msg: string) => errorMessage.value = msg;
const countCallback = (count: number) => emit("count", count);
const coachCallback = (msg: string) => emit("coach", msg);

async function loadData() {

  loading.value = true;

  await load(coachName.value, countCallback, matchesCallback, errorCallback, coachCallback);

  coachName.value = ""
  loading.value = false;

}

</script>

<style scoped>

.error {
    color: red
}

</style>