<template>
  <div>
    <div v-if="character !== null" class="character-page">
      <div class="character-page__image">
        <img :src="character.image" :alt="character.name">
      </div>
      <div class="character-page__details">
        <h1 class="character-name">{{ character.name }}</h1>
        <div class="details-section">
          <p class="detail-label">Status:</p>
          <p class="detail-value">{{ character.status }}</p>
        </div>
        <div class="details-section">
          <p class="detail-label">Species:</p>
          <p class="detail-value">{{ character.species }}</p>
        </div>
        <div class="details-section">
          <p class="detail-label">Location:</p>
          <p class="detail-value">{{ character.location.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

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
.character-page {
  margin-top: 30px;
  height: 50vh;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.40);
  display: flex;
  justify-content: space-between;

   &__image {
    width: 200px;
    height: 200px;
  }

  &__details {
    padding: 20px;
    border-radius: 10px;

    .character-name {
      font-size: 24px;
      margin-bottom: 10px;
      color: #333;
    }

    .details-section {
      display: flex;
      margin-bottom: 10px;

      .detail-label {
        font-weight: bold;
        margin-right: 10px;
      }

      .detail-value {
        color: #555;
      }
    }
  }
  @media screen and (max-width: 640px) {
    height: 60vh;
    flex-direction: column;
  }

  @media screen and (max-width: 440px) {

    &__image {
      position: relative;
      top: 5%;
      left: 10%;
    }

    &__details {
      text-align: center;

      .details-section {
        justify-content: center;
      }
    }
  }
}
</style>
