<template>
  <div>
    <h1>Rick and Morty</h1>
    <div>
      <label for="character">Find a character</label>
      <input type="text" name="" id="">
      <label for="status">Status</label>
      <select name="" id="">
        <option value="null" default>Select Status</option>
        <option value="alive">Alive</option>
        <option value="dead">Dead</option>
        <option value="unknown">Unknown</option>
      </select>
    </div>
    <div class="characters-list">
      <div class="characters-list__item" v-for="character in store.characters" :key="character.id">
        <div v-if="characters === null">
        Loading...
      </div>
        <img class="characters-list__item-img" :src="character.image" alt="">
        <h1 @click="goToCharacterPage(character.id)">{{ character.name }}</h1>
        <p>{{ character.status }}</p>
        <p>{{ character.species }}</p>
        <span
            v-for="(episode, index) in character.episode.slice(0, 5)"
            :key="index" class="episodes-list">
            <ul>
              <RouterLink :to="`/episode/${store.getNumber(episode)}`">
                <li class="episodes-list__item">
                  {{ `Episode No. ${store.getNumber(episode)}` }}
                </li>
              </RouterLink>
            </ul>
        </span>
      </div>
    </div>
    <button @click="loadNextPage" >
      Load Next Page
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { characterStore } from '@/stores/characters';
import { useRouter } from 'vue-router';

const store = characterStore();
const router = useRouter()

let searchQuery = ref('')
let status = ref(null)

onMounted(() => {
  console.log('page', store.currentPage);
  store.fetchCharacters(store.currentPage);
});

const goToCharacterPage = (id) => {
  router.push({name: 'character', params: {id}})
}


const loadNextPage = async () => {
  const nextPage = store.currentPage + 1;
  console.log('next', nextPage);
  await store.fetchCharacters(nextPage);
};


</script>

<style lang="scss" scoped>
div {
  max-width: 800px; /* Adjust the value based on your design */
  margin: 0 auto; /* Center the content */
}

div > div {
  margin-bottom: 16px;
}

input, select {
  margin-right: 8px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}
.characters-list {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex-wrap: wrap;

  &__item {
    cursor: pointer;
    // flex-basis: 20%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 0px 14px 1px #e6e6e6;
    padding: 16px;
    margin: 8px;
    border-radius: 8px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #f0f0f0;
    }

    &-img {
      width: 80px; 
      margin-right: 16px;
    }
  }
}

.episodes-list {
  display: flex;
  flex-direction: column;
}
</style>
