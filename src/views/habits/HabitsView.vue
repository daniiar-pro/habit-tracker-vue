<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import CurrentWeek from './CurrentWeek.vue'
import HabitItem from '@/components/HabitItem.vue'
import { useRoute, useRouter } from 'vue-router'
import {
  habitsList,
  loadHabits,
  getHabitsForDate,
  toggleHabitCompletion,
  saveDates,
  handleStopHabit,
  deleteHabitGlobally,
  dates,
} from '@/store/localStorage'

const route = useRoute()
const router = useRouter()

const habits = habitsList
const habit = ref('')
const selectedDate = ref(new Date().toISOString().slice(0, 10))
const habitsForSelectedDate = ref([])
const showModal = ref(false)
const showEditModal = ref(false)
const showStopModal = ref(false)
const isInputInvalid = ref(false)
const habitToEdit = ref(null)
const habitToStop = ref(null)




onMounted(() => {
  loadHabits()

  const urlDate = route.params.date
  const normalizedDate = urlDate || new Date().toISOString().slice(0, 10)

  if (!dates.value[normalizedDate]) {
    dates.value[normalizedDate] = getHabitsForDate(normalizedDate)
  }

  selectedDate.value = normalizedDate
  habitsForSelectedDate.value = dates.value[normalizedDate]
})

watch(
  () => route.params.date,
  (newDate) => {
    if (newDate) {
      const normalizedDate = new Date(newDate).toISOString().slice(0, 10)
      selectedDate.value = normalizedDate
      habitsForSelectedDate.value = getHabitsForDate(normalizedDate)
    }
  },
  { immediate: true },
)

function handleSelectedDate(newDate) {
  selectedDate.value = newDate
  habitsForSelectedDate.value = getHabitsForDate(newDate)

  router.push({ name: 'Habits', params: { date: newDate } })
}

const isFutureDate = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return selectedDate.value > today
})

function openAddModal() {
  showModal.value = true
  isInputInvalid.value = false
}

function openEditModal(habit) {
  habitToEdit.value = habit
  showEditModal.value = true
}

function openStopModal(habit) {
  habitToStop.value = habit
  showStopModal.value = true
}

function closeModal() {
  showModal.value = false
  showEditModal.value = false
  showStopModal.value = false
}

function addNewHabit() {
  if (!habit.value.trim()) {
    isInputInvalid.value = true
    return
  }

  habits.value.push({
    title: habit.value.trim(),
    completed: false,
    date: selectedDate.value,
  })

  habitsForSelectedDate.value.push({
    title: habit.value.trim(),
    completed: false,
  })

  habit.value = ''
  isInputInvalid.value = false
  saveDates()
  closeModal()
}

function editHabitTitle() {
  if (!habitToEdit.value.title.trim()) {
    isInputInvalid.value = true
    return
  }

  habitsForSelectedDate.value = habitsForSelectedDate.value.map((habit) =>
    habit.title === habitToEdit.value.title ? habitToEdit.value : habit,
  )

  saveDates()
  closeModal()
}

function stopHabit() {
  handleStopHabit(habitToStop.value.title, selectedDate.value)
  closeModal()
}

function deleteHabit(habitTitle) {
  deleteHabitGlobally(habitTitle)
  habitsForSelectedDate.value = getHabitsForDate(selectedDate.value)

  saveDates()
}

function toggleCompleted(habitTitle) {
  toggleHabitCompletion(selectedDate.value, habitTitle)
  habitsForSelectedDate.value = getHabitsForDate(selectedDate.value)
}
</script>

<template>


  <div class="habits-list">
    <h1 style="text-align: center;">Current week</h1>
    <CurrentWeek @update-day-selected="handleSelectedDate" :selectedDate="selectedDate" />
    <br />

    <div class="habits-container" >
      <HabitItem v-for="(habitItem, index) in habitsForSelectedDate" :key="habitItem.title" :title="habitItem.title"
        :completed="habitItem.completed" :stopped="habitItem.stopped" :isFutureDate="isFutureDate"
        @edit-habit="openEditModal(habitItem, index)" @delete-habit="deleteHabit(habitItem.title)"
        @toggle-completed="toggleCompleted(habitItem.title)" @stop-habit="openStopModal(habitItem)" />


    </div>

    <div class="add-habit">
      <button @click="openAddModal">Add new habit</button>
    </div>

    <!-- Add Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Add New Habit</h3>
        <input type="text" v-model="habit" :class="{ 'input-invalid': isInputInvalid }" placeholder="Enter habit title"
          @keyup.enter="addNewHabit" />
        <span v-if="isInputInvalid" class="error-message">Habit title cannot be empty</span>
        <div class="modal-buttons">
          <button @click="addNewHabit">Add Habit</button>
          <button @click="closeModal" class="cancel-button">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal">
        <h3>Edit Habit</h3>
        <input type="text" v-model="habitToEdit.title" :class="{ 'input-invalid': isInputInvalid }"
          placeholder="Edit habit title" />
        <span v-if="isInputInvalid" class="error-message">Habit title cannot be empty</span>
        <div class="modal-buttons">
          <button @click="editHabitTitle">Save Changes</button>
          <button @click="closeModal" class="cancel-button">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Stop Modal -->
    <div v-if="showStopModal" class="modal-overlay">
      <div class="modal">
        <h3>Stop Habit</h3>
        <p>Are you sure you want to stop tracking this habit?</p>
        <div class="modal-buttons">
          <button @click="stopHabit">Yes, Stop</button>
          <button @click="closeModal" class="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.habits-list {
  padding: 2rem;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
}

.habits-container {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-habit {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.add-habit button {
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-habit button:hover {
  background-color: #0056b3;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal h3 {
  margin-bottom: 1rem;
}

.modal input {
  padding: 0.8rem;
  width: 100%;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: border-color 0.2s;
}

.modal input.input-invalid {
  border-color: red;
}

.modal .error-message {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.modal-buttons button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-buttons button:first-child {
  background-color: #007bff;
  color: white;
}

.modal-buttons button:first-child:hover {
  background-color: #0056b3;
}

.modal-buttons .cancel-button {
  background-color: #f44336;
  color: white;
}

.modal-buttons .cancel-button:hover {
  background-color: #c0392b;
}

@media (max-width: 768px) {
  .habits-list {
    padding: 1rem;
  }

  .modal {
    max-width: 90%;
  }
}
</style>
