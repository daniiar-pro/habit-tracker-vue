import { ref, watch } from 'vue'

export type Habit = {
  title: string
  completed: boolean
  date: Date | string
  stopped?: boolean
}

type DatesType = Record<string, Habit[]>

export const habitsList = ref<Habit[]>([])
export const dates = ref<DatesType>({})

export function loadHabits() {
  try {
    const storedHabits: Habit[] = JSON.parse(localStorage.getItem('habitsList') || '[]')
    habitsList.value = storedHabits
  } catch {
    habitsList.value = []
  }

  try {
    const storedDates: DatesType = JSON.parse(localStorage.getItem('dates') || '{}')
    dates.value = storedDates || {}
  } catch {
    dates.value = {}
  }
  watch(
    habitsList,
    (newHabits) => {
      const habitsStore = newHabits.map((habit: Habit) => ({
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

export function handleStopHabit(habitTitle: string, selectedDate: string) {
  const today: Date = new Date()
  const stopDate: Date = new Date(selectedDate)

  for (let i = 0; i <= 365; i++) {
    const currentDate: Date = new Date(today)
    currentDate.setDate(today.getDate() + i)

    const formattedDate: string = currentDate.toISOString().slice(0, 10)

    if (currentDate >= stopDate) {
      if (!dates.value[formattedDate]) {
        dates.value[formattedDate] = habitsList.value.map((habit) => ({
          title: habit.title,
          completed: false,
          stopped: false,
          date: formattedDate,
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

export function deleteHabitGlobally(habitTitle: string) {
  for (const date in dates.value) {
    dates.value[date] = dates.value[date].filter((habit) => habit.title !== habitTitle)
  }

  habitsList.value = habitsList.value.filter((habit) => habit.title !== habitTitle)

  localStorage.setItem('dates', JSON.stringify(dates.value))

  localStorage.setItem('habitsList', JSON.stringify(habitsList.value))
}

export function getHabitsForDate(selectedDate: string): Habit[] {
  const today: string = new Date().toISOString().slice(0, 10)
  const isFutureDate: boolean = selectedDate > today

  if (isFutureDate) {
    return (
      dates.value[selectedDate] ||
      habitsList.value.map((habit) => ({
        title: habit.title,
        completed: false,
        date: selectedDate,
      }))
    )
  }

  if (!dates.value[selectedDate] && habitsList.value.length > 0) {
    dates.value[selectedDate] = habitsList.value.map((habit) => ({
      title: habit.title,
      completed: false,
      date: selectedDate,
    }))
    saveDates()
  }

  return dates.value[selectedDate] || []
}

export function toggleHabitCompletion(selectedDate: string, habitTitle: string) {
  if (!dates.value[selectedDate]) {
    dates.value[selectedDate] = habitsList.value.map((habit) => ({
      title: habit.title,
      completed: false,
      stopped: habit.stopped || false,
      date: selectedDate,
    }))
  }

  const habit = dates.value[selectedDate].find((habit) => habit.title === habitTitle)
  if (habit) {
    habit.completed = !habit.completed
  }

  saveDates()
}

