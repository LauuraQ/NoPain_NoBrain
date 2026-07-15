<script setup>
import CustomPopup from './components/CustomPopup.vue'
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'
</script>

<template>
  <div class="app-layout">
    <TheHeader />
    <main class="main-content">
      <RouterView />
    </main>
    <CustomPopup />
    <TheFooter />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex-grow: 1;
}
</style>
