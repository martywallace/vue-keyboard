<template>
  <div>
    <keyboard layouts="abc123|xyz456|{space:space}"></keyboard>
  </div>
</template>

<script>
import keyboard from '../src/keyboard.vue';

export default {
  name: 'App',
  components: {
    keyboard,
  },
}
</script>

<style>

</style>
