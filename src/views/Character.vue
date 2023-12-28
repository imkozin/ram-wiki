<template>
  <div>
    <h1>Character Details</h1>
    <div v-if="character !== null" class="character">
        <img :src="character.image" :alt="character.name">
      <h2>{{ character.name }}</h2>
      <p>Status: {{ character.status }}</p>
      <p>Species: {{ character.species }}</p>
      <p>Location: {{ character.location.name }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { characterStore } from '@/stores/characters';
import { useRoute } from 'vue-router';

const store = characterStore();
const route = useRoute();
const id = route.params.id;
console.log('id', id);
const character = ref(null);

onMounted(async () => {
  await getCharacter(id);
});

const getCharacter = async (id) => {
  try {
    const res = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
    const data = res.data
    character.value = data
    console.log('data', data);
  } catch (error) {
    console.error('Error in onMounted:', error);
  }
};
</script>

<style lang="scss" scoped>
/* Your styles here */
</style>
