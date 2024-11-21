<script setup>
import '@/assets/main.css'

import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <header class="header">
    <nav class="navigation">
      <RouterLink :to="{ name: 'Home' }" class="nav-link" active-class="active-link">
        Home
      </RouterLink>
      <RouterLink :to="{ name: 'Habits' }" class="nav-link" active-class="active-link">
        Habits
      </RouterLink>
      <RouterLink :to="{ name: 'Calendar' }" class="nav-link" active-class="active-link">
        Calendar
      </RouterLink>
    </nav>
  </header>
  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped></style>
