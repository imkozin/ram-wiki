<template>
  <main>
    <NavBar/>
    <RouterView />
  </main>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  components: {NavBar}
}
</script>

<style scoped>

</style>
