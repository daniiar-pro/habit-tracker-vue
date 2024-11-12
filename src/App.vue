<script setup></script>
<template>
  <header id="header">
    <nav id="navigation">
      <RouterLink :to="{ name: 'Habits' }"><h1>Habits</h1></RouterLink>
      <RouterLink :to="{ name: 'Calendar' }"><h1>Calendar</h1></RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
#navigation {
  display: flex;
  justify-content: space-around;
}
</style>
