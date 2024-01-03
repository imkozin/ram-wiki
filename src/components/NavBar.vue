<template>
    <nav class="nav" :class="{'nav-active': isActive}">
        <RouterLink class="nav-link" to="/">RaM-Wiki</RouterLink>
        <button class="nav-btn" @click="goBack()">Go Back</button>
    </nav>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const isActive = ref(false)

const goBack = () => {
    router.back()
}

onMounted(() => {
  const handleScroll = () => {
    window.scrollY > 60 ? isActive.value = true : isActive.value = false
    console.log(isActive.value);
  }
  window.addEventListener('scroll', handleScroll)
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<style lang="scss" scoped>
.nav {
  position: fixed;
  height: 50px;
  top: 0;
  right: 0;
  left: 0;
  background-color: #e1e1e1;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;

  &-link {
    font-family: 'Roboto', sans-serif;
    color: #111;
    text-decoration: none; 
    font-weight: bold;

    &:hover {
        color: #fff;
    }

    &:active {
        color: #fff;
        font-weight: bold;
    }
  }

  &-btn {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;

    &:hover {
        cursor: pointer;
        background-color: #333;
        color: #fff;
    }
  }
}

.nav-active {
  background-color: rgba(255, 255, 255, 0.40);
}
</style>