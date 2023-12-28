import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import Character from '@/views/Character.vue'
import Episode from '@/views/Episode.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/character/:id',
      name: 'character',
      component: Character
    },
    {
      path: '/episode/:id',
      name: 'episode',
      component: Episode
    }
  ]
})

export default router
