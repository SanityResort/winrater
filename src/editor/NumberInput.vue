<template>
  <label :for="props.inputId" class="setting-label">{{ props.label }}</label>
  <input
    :id="props.inputId"
    class="setting-input"
    type="number"
    :value="props.value"
    @input="event => { if (event.target && props.callback) {
            props.callback(Number.parseInt(((event as Event).target as HTMLInputElement).value))}
          }"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  value: Number,
  inputId: String,
  callback: Function<Number>,
  label: String
})
</script>

<style scoped>
.setting-input {
  text-align: right;
  margin-left: 0.5em;
  width: 8em;
}
</style>
