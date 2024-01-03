<template>
  <div class="main-page">
    <h1 class="main-page__title">Rick and Morty</h1>
    <div class="main-page__searchbox">
      <!-- <label for="character">Find a character</label> -->
      <input class="main-page__searchbox-input" type="text" name="query" id="query" placeholder="Search character by name" v-model="searchQuery" >
      <!-- <label for="status">Status</label> -->
      <select name="status" id="status" v-model="status" @change="onChange($event)" class="main-page__searchbox-select">
        <option value="null" default>Select by Status</option>
        <option value="alive">Alive</option>
        <option value="dead">Dead</option>
        <option value="unknown">Unknown</option>
      </select>
    </div>
    

    <div class="characters-list" v-if="store.characters && !searchQuery && !status">
      <div class="characters-list__card" v-for="character in store.characters" :key="character.id">
        <h1 class="characters-list__card-title" @click="goToCharacterPage(character.id)">{{ character.name }}</h1>
        <img class="characters-list__card-img" :src="character.image" alt="">
        <div class="characters-list__card-stat">
          <p v-if="character.status === 'Dead'" :style="{ color: '#ff0505' }">{{ character.status.toLowerCase() }}</p>
          <p v-else-if="character.status === 'Alive'" :style="{ color: 'lime' }">{{ character.status.toLowerCase() }}</p>
          <p v-else :style="{ color: '#E5C82F' }">{{ character.status.toLowerCase() }}</p>
        </div>
        <div class="characters-list__card-race">
          <p>Race:</p>
          <p>{{ character.species }}</p>
        </div>
        <div class="characters-list__card-elist">
          <p>Episodes:</p>
          <div
               v-for="(episode, index) in character.episode.slice(0, 5)"
               :key="index" class="episodes-list">
                 <RouterLink class="episodes-list__item" :to="`/episode/${store.getNumber(episode)}`">
                     {{ `${store.getNumber(episode)}` }}
                 </RouterLink>
          </div>
        </div>
      </div>
    </div>
    
    <div class="characters-list" v-if="store.characters && searchQuery || store.characters && status || store.characters && searchQuery && status">
      <div class="characters-list__card" v-for="character in filteredCharacters" :key="character.id">
        <h1 class="characters-list__card-title" @click="goToCharacterPage(character.id)">{{ character.name }}</h1>
        <img class="characters-list__card-img" :src="character.image" alt="">
        <div class="characters-list__card-stat">
          <p v-if="character.status === 'Dead'" :style="{ color: '#ff0505' }">{{ character.status.toLowerCase() }}</p>
          <p v-else-if="character.status === 'Alive'" :style="{ color: 'lime' }">{{ character.status.toLowerCase() }}</p>
          <p v-else :style="{ color: '#E5C82F' }">{{ character.status.toLowerCase() }}</p>
        </div>
        <div class="characters-list__card-race">
          <p>Race:</p>
          <p>{{ character.species }}</p>
        </div>
        <div class="characters-list__card-elist">
          <p>Episodes:</p>
          <div
               v-for="(episode, index) in character.episode.slice(0, 5)"
               :key="index" class="episodes-list">
                 <RouterLink class="episodes-list__item" :to="`/episode/${store.getNumber(episode)}`">
                     {{ `${store.getNumber(episode)}` }}
                 </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="store.characters === null" class="main-page__loading">
        Loading...
    </div>
    
    <div v-if="store.characters && !searchQuery && status === null" class="main-page__btnblock">
      <button @click="loadPrevPage" :disabled="store.currentPage === 1" class="btn btn-back">
        BACK
      </button>
      <span class="main-page__btnblock-page">{{ store.currentPage }}</span>
      <button @click="loadNextPage" :disabled="store.currentPage === 42" class="btn btn-forward">
        NEXT
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

const loadFilteredCharacters = async (e) => {
  e.preventDefault()
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
.main-page {
  &__loading {
    font-family: 'StoryBrush', sans-serif;
    font-size: 32px;
    margin: 0 auto;
  }

  &__title {
    font-family: 'StoryBrush', sans-serif;
    letter-spacing: 5px;
    font-size: 4em;
    text-align: center;
    margin: 1em 0;
    color: #393939;
  }

  &__searchbox {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2em;

    &-input {
      width: 407px;
      height: 38px;
      padding: 8px 16px;
      border-radius: 4px;
      border: 2px solid #000;
      background: #FFF;
    }

    &-select {
      width: 140px;
      height: 38px;
      padding: 6px 8px;
      border-radius: 4px;
      background: #000;
      color: white;
    }
  }

  &__btnblock {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 4em;

    &-page {
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      padding: 10px;
      background-color: #000;
      color: #FFF;
      border-radius: 5px;
    }
  }

  @media screen and (max-width: 769px) {
    &__btnblock {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}


input, select {
  margin-right: 8px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn {
  width: 100px;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  transition: background-color 0.3s;
}

.btn.btn-back {
  background-color: #000;
  color: #FFF;
  margin-right: 10px;
}

.btn.btn-back:hover {
  color: #000;
  background-color: #FFF;
}

.btn.btn-forward {
  background-color: #000;
  color: #FFF;
  margin-left: 10px;
}

.btn.btn-forward:hover {
  color: #000;
  background-color: #999;
}

.btn.btn-back:disabled {
  cursor: not-allowed;
  color: #FFF;
  background-color:#d1d1d1;;
}

.characters-list {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

.characters-list__card {
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  display: flex;
  align-items: center;
  width: 196px;
  height: 320px;
  margin: 30px 0;
  flex-direction: column;
  border-radius: 6px;
  background: #393939;  
  color: #FFF;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #A35EB3;;
  }

  &-title { 
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 42px;
    width: 194px;
    padding: 12px 0;
    color: #ADE175;
    text-align: center;
    white-space: wrap;
    font-family: 'StoryBrush', sans-serif;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  &-img {
    width: 160px;
    height: 180px;
    margin-bottom: 10px;
  }

  &-stat {
    font-size: 16px;
    margin-bottom: 10px;
  }

  &-race, &-elist {
    display: flex;
    width: 160px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .episodes-list {
    &__item {
      margin-left: auto;
      color: white;
    }
  }
}



</style>
