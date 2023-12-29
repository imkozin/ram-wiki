<template>
  <div v-if="episode !== null">
    <h3>Episode No {{episode.id}}</h3>
    <div  class="episode">
      <h2>{{episode.episode }}</h2>
      <h1>{{ episode.name }}</h1>
      <p>Released: {{ episode.air_date }} </p>
    </div>
    <div v-if="episode && episode.characters">
        <div v-for="char in characterImages" :key="char" class="w-full md:w-1/3 p-1 md:p-2">
        <RouterLink :to="`/character/${store.getNumber(char)}`">
            <img :alt="char" :src="char" class="block h-full w-full rounded-lg object-cover object-center" />
        </RouterLink>
        </div>
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
const episode = ref(null);
const characterImages = ref(null)

onMounted(async () => {
  await getEpisode(id);
});

const getEpisode = async (id) => {
  try {
    const res = await axios.get(`https://rickandmortyapi.com/api/episode/${id}`);
    const data = res.data
    episode.value = data
    console.log('data', data);
    await getCharacterImages()
  } catch (error) {
    console.error('Error in onMounted:', error);
  }
};

const getCharacterImages = async () => {
  try {
    const promises = episode.value.characters.map(async (character) => {
      const response = await axios.get(character)
      const data = response.data
      return data.image
    })

    characterImages.value = await Promise.all(promises)
    console.log('charImages', characterImages.value);
  } catch (error) {
    console.error('Error fetching characters:', error)
  }
}
</script>

<style lang="scss" scoped>
/* Your styles here */
</style>
