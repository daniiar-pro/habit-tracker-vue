import { ref, watch } from 'vue'

export const habits = ref([])

export function loadHabits() {
  const storedHabits = JSON.parse(localStorage.getItem('habits') || '[]')

  habits.value = storedHabits.map((habit) => ({
    ...habit,
    completed: habit.completed,
    date: habit.date,
  }))
}



watch(
  habits,
  (newHabits) => {
    const habitsStore = newHabits.map((habit) => ({
      title: habit.title,
      completed: habit.completed,
      date: habit.date,
    }))

    localStorage.setItem('habits', JSON.stringify(habitsStore))
  },
  { deep: true },
)
