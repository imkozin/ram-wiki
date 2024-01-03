<template>
  <div>
    <div v-if="episode !== null" class="episode-page">
      <div class="episode-page__details">
        <h3>Episode No {{episode.id}}</h3>
        <div  class="episode-details">
          <h2>{{episode.episode }}</h2>
          <h1 class="episode-details__title">{{ episode.name }}</h1>
          <p>Released: {{ episode.air_date }} </p>
        </div>
      </div>
      <div v-if="episode && episode.characters" class="episode-page__characters">
          <div v-for="char in characterImages" :key="char" >
          <RouterLink :to="`/character/${store.getNumber(char)}`">
              <img :alt="char" :src="char" class="episode-page__characters-images"/>
          </RouterLink>
          </div>
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
.episode-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  font-family: 'Roboto', sans-serif;

  &__details {
    text-align: center;
    margin-bottom: 30px;
  }

  &__characters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 50px;

    &-images {
      border: 5px solid #333;
      border-radius: 3px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    }
  }
}

.episode-details {
  &__title {
    font-family: 'StoryBrush', sans-serif;
    color: #333;
    letter-spacing: 3px;
    font-size: 42px;
  }
}
</style>
