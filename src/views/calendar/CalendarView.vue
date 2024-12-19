<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { getHabitsForDate, Habit, toggleHabitCompletion } from '../../store/localStorage'
import '@/components/HabitItem.vue'

const router = useRouter()
const route = useRoute()

const format = (date: Date) => {
  const day = `${date.getDate()}`.padStart(2, '0')
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

const normalizeDate = (dateStr: string): string => {
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`
  }
  return new Date().toISOString().slice(0, 10)
}

const selectedDate = ref(
  typeof route.query.date === 'string' ? normalizeDate(route.query.date) : new Date().toISOString().slice(0, 10),
)

watch(
  () => route.query.date,
  (newDate) => {
    selectedDate.value = normalizeDate(newDate as string || new Date().toISOString().slice(0, 10))
  },
  { immediate: true },
)

const isFutureDate = computed<boolean>(() => {
  const today = new Date().toISOString().slice(0, 10)
  return selectedDate.value > today
})

const habitsForSelectedDate = computed<Habit[]>(() => {
  return getHabitsForDate(selectedDate.value)
})

const handleDateSelected = (newDate: Date) => {
  const isoDate = normalizeDate(new Date(newDate).toISOString().slice(0, 10))
  selectedDate.value = isoDate
  router.push({ name: 'Calendar', query: { date: isoDate } })
}

const handleToggleCompletion = (habitTitle: string) => {
  if (!isFutureDate.value) {
    toggleHabitCompletion(selectedDate.value, habitTitle)
  }
}
</script>
<template>
  <div class="calendar-view">
    <div class="calendar-header">
      <h1>Pick a Date</h1>
      <VueDatePicker v-model="selectedDate" @update:model-value="handleDateSelected" placeholder="Pick a Date"
        :format="format" class="date-picker" />
    </div>

    <div class="habits-list" v-if="isFutureDate">
      <h2 style="text-align: center;">Habits for {{ selectedDate }}</h2>
      <ul v-if="habitsForSelectedDate.length">
        <li v-for="habit in habitsForSelectedDate" :key="habit.title" class="habit-item">
          <span>{{ habit.title }}</span>
          <input type="checkbox" :checked="habit.completed" disabled />
        </li>
      </ul>
      <div v-else class="no-habits">No habits available for future dates.</div>
    </div>

    <div class="habits-list" v-else>
      <h2 style="text-align: center;">Habits on {{ selectedDate }}</h2>
      <ul v-if="habitsForSelectedDate.length">
        <li v-for="habit in habitsForSelectedDate" :key="habit.title" class="habit-item">
          <span>{{ habit.title }}</span>
          <input v-if="!habit.stopped" type="checkbox" :checked="habit.completed"
            @change="handleToggleCompletion(habit.title)" />
          <i v-if="habit.stopped" style="color: lightblue; font-size: 0.9rem">(stopped habit)</i>
        </li>
      </ul>
      <div v-else class="no-habits">No habits completed on this date.</div>
    </div>
  </div>
</template>

<style scoped>
.calendar-view {
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 600px;
  width: 100%;
  box-sizing: border-box;
}

.calendar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.date-picker {
  max-width: 320px;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.habits-list {
  margin-top: 1.5rem;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.habit-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.habit-item span {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.habit-item input {
  transform: scale(1.1);
  margin-left: 1rem;
}

.stopped {
  font-size: 0.8rem;
  color: #999;
  font-style: italic;
}

.no-habits {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 1rem;
}


@media (max-width: 768px) {
  .calendar-view {
    padding: 1rem;
    max-width: 100%;
  }

  .calendar-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .date-picker {
    font-size: 0.9rem;
    padding: 0.4rem;
  }

  .habit-item span {
    font-size: 0.8rem;
  }

  .habit-item input {
    transform: scale(1);
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .calendar-view {
    max-width: 700px;
  }

  .habit-item span {
    font-size: 1rem;
  }
}

@media (min-width: 1024px) {
  .calendar-view {
    max-width: 900px;
  }

  .habit-item span {
    font-size: 1.1rem;
  }
}
</style>
