<template>
  <div>
    <h1>Rick and Morty</h1>
    <div class="characters-list">
      <div class="characters-list__item" v-for="character in store.characters" :key="character.id">
        <img class="characters-list__item-img" :src="character.image" alt="">
        <h1 @click="goToCharacterPage(character.id)">{{ character.name }}</h1>
        <p>{{ character.status }}</p>
        <p>{{ character.species }}</p>
      </div>
    </div>
    <button @click="loadNextPage" >
      Load Next Page
    </button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { characterStore } from '@/stores/characters';
import { useRouter } from 'vue-router';

const store = characterStore();
const router = useRouter()

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
.characters-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  &__item {
    cursor: pointer;
    flex-basis: 20%;
    margin: 8px;
    padding: 16px;
    box-shadow: 0px 0px 14px 1px #e6e6e6;

    // &-img {
    //   width: 70%;
    // }
  }


}
</style>
