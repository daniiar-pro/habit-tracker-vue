import { ref, watch } from 'vue'

export const habitsList = ref([])
export const dates = ref({})

export function loadHabits() {
  const storedHabits = JSON.parse(localStorage.getItem('habitsList') || '[]')
  habitsList.value = storedHabits

  const storedDates = JSON.parse(localStorage.getItem('dates') || '{}')
  dates.value = storedDates || {}
  watch(
    habitsList,
    (newHabits) => {
      const habitsStore = newHabits.map((habit) => ({
        title: habit.title,
        completed: habit.completed,
        date: habit.date,
        stopped: habit.stopped || false,
      }))

      localStorage.setItem('habitsList', JSON.stringify(habitsStore))
    },
    { deep: true },
  )

  watch(
    dates,
    (newDates) => {
      localStorage.setItem('dates', JSON.stringify(newDates))
    },
    { deep: true },
  )
}

export function saveDates() {
  localStorage.setItem('dates', JSON.stringify(dates.value))
}

export function handleStopHabit(habitTitle, selectedDate) {
  const today = new Date()
  const stopDate = new Date(selectedDate)

  for (let i = 0; i <= 365; i++) {
    const currentDate = new Date(today)
    currentDate.setDate(today.getDate() + i)

    const formattedDate = currentDate.toISOString().slice(0, 10)

    if (currentDate >= stopDate) {
      if (!dates.value[formattedDate]) {
        dates.value[formattedDate] = habitsList.value.map((habit) => ({
          title: habit.title,
          completed: false,
        }))
      }

      const habit = dates.value[formattedDate].find((habit) => habit.title === habitTitle)

      if (habit) {
        habit.stopped = true
      }
    }
  }

  localStorage.setItem('dates', JSON.stringify(dates.value))
}

export function deleteHabitGlobally(habitTitle) {
  for (const date in dates.value) {
    dates.value[date] = dates.value[date].filter((habit) => habit.title !== habitTitle)
  }

  habitsList.value = habitsList.value.filter((habit) => habit.title !== habitTitle)

  localStorage.setItem('dates', JSON.stringify(dates.value))

  localStorage.setItem('habitsList', JSON.stringify(habitsList.value))
}

export function getHabitsForDate(selectedDate) {
  const today = new Date().toISOString().slice(0, 10)
  const isFutureDate = selectedDate > today

  if (isFutureDate) {
    return (
      dates.value[selectedDate] ||
      habitsList.value.map((habit) => ({
        title: habit.title,
        completed: false,
      }))
    )
  }

  if (!dates.value[selectedDate] && habitsList.value.length > 0) {
    dates.value[selectedDate] = habitsList.value.map((habit) => ({
      title: habit.title,
      completed: false,
    }))
    saveDates()
  }

  return dates.value[selectedDate] || []
}

export function toggleHabitCompletion(selectedDate, habitTitle) {
  if (!dates.value[selectedDate]) {
    dates.value[selectedDate] = habitsList.value.map((habit) => ({
      title: habit.title,
      completed: false,
      stopped: habit.stopped || false,
    }))
  }

  const habit = dates.value[selectedDate].find((habit) => habit.title === habitTitle)
  if (habit) {
    habit.completed = !habit.completed
  }

  saveDates()
}
