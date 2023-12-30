<template>
  <div>
    <h1>Rick and Morty</h1>
    <div>
      <label for="character">Find a character</label>
      <input type="text" name="query" id="query" placeholder="Search" v-model="searchQuery">
      <label for="status">Status</label>
      <select name="status" id="status" v-model="status" @change="onChange($event)">
        <option value="null" default>Select Status</option>
        <option value="alive">Alive</option>
        <option value="dead">Dead</option>
        <option value="unknown">Unknown</option>
      </select>
    </div>

    <div class="characters-list" v-if="store.characters && !searchQuery && !status">
      <div class="characters-list__card" v-for="character in store.characters" :key="character.id">
        <img class="characters-list__card-img" :src="character.image" alt="">
        <h1 @click="goToCharacterPage(character.id)">{{ character.name }}</h1>
        <p>{{ character.status }}</p>
        <p>{{ character.species }}</p>
        <span
            v-for="(episode, index) in character.episode.slice(0, 5)"
            :key="index" class="episodes-list">
            <ul>
              <RouterLink :to="`/episode/${store.getNumber(episode)}`">
                <li class="episodes-list__item">
                  {{ `${store.getNumber(episode)}` }}
                </li>
              </RouterLink>
            </ul>
        </span>
      </div>
    </div>
    
    <div class="characters-list" v-if="store.characters && searchQuery || store.characters && status || store.characters && searchQuery && status">
      <div class="character-list__card" v-for="character in filteredCharacters" :key="character.id">
        <img class="characters-list__card-img" :src="character.image" alt="">
        <h1 @click="goToCharacterPage(character.id)">{{ character.name }}</h1>
        <p>{{ character.status }}</p>
        <p>{{ character.species }}</p>
        <span
            v-for="(episode, index) in character.episode.slice(0, 5)"
            :key="index" class="episodes-list">
            <ul>
              <RouterLink :to="`/episode/${store.getNumber(episode)}`">
                <li class="episodes-list__item">
                  {{ `${store.getNumber(episode)}` }}
                </li>
              </RouterLink>
            </ul>
        </span>
      </div>
    </div>

    <div v-else-if="store.characters === null">
        Loading...
    </div>
    
    <div v-if="store.characters && !searchQuery && status === null">
      <button @click="loadPrevPage" :disabled="store.currentPage === 1">
        Load Prev Page
      </button>
      <span>{{ store.currentPage }}</span>
      <button @click="loadNextPage" >
        Load Next Page
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect, onBeforeMount, watch } from 'vue';
import { characterStore } from '@/stores/characters';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const store = characterStore();
const router = useRouter()

let searchQuery = ref('')
let status = ref(null)


const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);


onMounted(() => {
  if (localStorage.getItem('pinia-state')) {
    pinia.state.value = JSON.parse(localStorage.getItem('pinia-state'));
  }
});

watch(() => store.currentPage, (currentPage) => {
  localStorage.setItem('pinia-state', JSON.stringify({ currentPage }));
}, { deep: true });


onBeforeMount(() => {
  const persistedState = JSON.parse(localStorage.getItem('pinia-state'));
  
  if (persistedState && persistedState.currentPage) {
    store.fetchCharacters(persistedState.currentPage);
  } else {
    store.fetchCharacters(store.currentPage);
  }
});

const goToCharacterPage = (id) => {
  router.push({name: 'character', params: {id}})
}

const loadFilteredCharacters = async () => {
  let url = `https://rickandmortyapi.com/api/character/?`;
  if (searchQuery.value) {
    url = `https://rickandmortyapi.com/api/character/?`;
    url += `name=${searchQuery.value}`;
    console.log('search url', url);
  }

  if (status.value !== null) {
    url = `https://rickandmortyapi.com/api/character/?`;
    url += `status=${status.value}`;
    console.log('stat url', url);
  }

  if (searchQuery.value && status.value) {
    url = `https://rickandmortyapi.com/api/character/?`;
    url += `name=${searchQuery.value}&status=${status.value}`
    console.log('both url', url);
  }

  const response = await axios.get(url);
  const data = response.data;
  store.characters.value = data.results;
};

watchEffect(() => {
  if (searchQuery.value) {
    loadFilteredCharacters();
  } 
  else {
    store.fetchCharacters(store.currentPage);
  }
});

watch(status.value, () => {
  store.fetchCharacters(store.currentPage);
});

watch([status.value, searchQuery.value], () => {
  loadFilteredCharacters()
})

const loadNextPage = async () => {
  const nextPage = store.currentPage + 1;
  await store.fetchCharacters(nextPage);
};

const loadPrevPage = async () => {
  const prevPage = store.currentPage - 1;
  await store.fetchCharacters(prevPage);
};

const filteredCharacters = computed(() => {
  let filteredList = store.characters.value.filter((char) =>
    char.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  return filteredList
});


const onChange = () => {
  if (status.value === "null") {
    status.value = null;
  }
  loadFilteredCharacters();
}
</script>

<style lang="scss" scoped>
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

button:disabled {
  background-color: #b6d8f9;
}

.characters-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.characters-list__card {
  cursor: pointer;
  width: 200px; /* Set a fixed width for each card */
  display: flex;
  flex-direction: column;
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
    width: 180px;
    margin-right: 16px;
  }

  .episodes-list {
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* Allow the episodes list to grow to fill the available space */
  }
}
</style>
