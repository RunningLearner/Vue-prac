<template>
  <div class="name">hi{{ name }}</div>
</template>

<script>
export default {
  setup() {
    const name = " seunam!";
    return { name };
  },
};
</script>

<style>
.name {
  color: red;
}
</style>
