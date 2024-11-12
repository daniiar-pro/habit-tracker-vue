<script setup>
import { ref, onMounted } from 'vue'
import HabitItem from './HabitItem.vue'
import { loadHabits, habits } from '@/store/habits'
import CurrentWeek from './CurrentWeek.vue'

const habitList = habits
const habit = ref('')
const date = ref(new Date().toISOString().slice(0, 10))

onMounted(() => {
  loadHabits()
})

function addNewHabit() {
  if (habit.value.trim()) {
    habitList.value.push({
      title: habit.value.trim(),
      completed: false,
      date: date.value,
    })
    habit.value = ''
  }
}

function deleteHabit(index) {
  habitList.value.splice(index, 1)
}

function editHabit(index, newTitle) {
  console.log(newTitle)
  habitList.value[index].title = newTitle
}

function toggleCompleted(index) {
  habitList.value[index].completed = !habitList.value[index].completed
}

function updateSelectedDay(selectedDay) {
  console.log(selectedDay)
}
</script>

<template>
  <div>
    <h1 style="text-align: center">Habits</h1>

    <CurrentWeek @update-selected-day="updateSelectedDay(selectedDay)" />

    <div class="habits">
      <HabitItem
        v-for="(habitItem, index) in habitList"
        :key="index"
        P
        :title="habitItem.title"
        :completed="habitItem.completed"
        :date="date"
        @delete-habit="deleteHabit(index)"
        @edit-habit="editHabit(index, $event)"
        @toggle-completed="toggleCompleted(index)"
      />
    </div>
    <input type="text" v-model="habit" @keyup.enter="addNewHabit" placeholder="Add new habit" />
    <button @click="addNewHabit">Add new habit</button>
  </div>
</template>

<style scoped>
.habits {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
