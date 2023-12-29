import { defineStore } from 'pinia';
import axios from 'axios';

export const characterStore = defineStore('characters', {
  state: () => ({
    characters: [],
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
        console.log('chars', this.characters)
        console.log('cur page', this.currentPage)
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
})
