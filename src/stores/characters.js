import { defineStore } from 'pinia';
import axios from 'axios';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export const characterStore = defineStore('characters', {
  state: () => ({
    characters: null,
    currentPage: 1,
  }),
  actions: {
    async fetchCharacters(page) {
      try {
        console.log('fetch page', page)
        const res = await axios.get(
          `https://rickandmortyapi.com/api/character/?page=${page}`
        )
        this.characters = res.data.results
        // console.log('chars', this.characters)
        // console.log('cur page', this.currentPage)
        this.currentPage = page
      } catch (error) {
        console.error('Error fetching characters:', error)
        throw error
      }
    },
    getNumber(url) {
      return url.replace(/[^0-9]/g, '')
    },
  },
  persist: true,
})
