<script setup lang="ts">
import { ref, watch } from 'vue'

const days = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
const today = new Date()
const todayIndex = ref((today.getDay() + 6) % 7)
const selectedDayIndex = ref(todayIndex.value)

import { defineProps, defineEmits } from 'vue';

const props = defineProps<{ selectedDate: string }>(); 
const emit = defineEmits<{
  (e: 'update-day-selected', value: string): void; 
}>();



watch(
  () => props.selectedDate,
  (newDate) => {
    const selectedDate = new Date(newDate)
    if(isNaN(selectedDate.getTime())){
      return;
    }
    const diffDays = Math.round(
      (selectedDate.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24),
    )
    selectedDayIndex.value = (todayIndex.value + diffDays + 7) % 7
  },
  { immediate: true },
)

function selectDay(index: number) {
  selectedDayIndex.value = index
  const selectedDate = new Date()
  const diff = index - todayIndex.value

  selectedDate.setDate(today.getDate() + diff)

  emit('update-day-selected', selectedDate.toISOString().slice(0, 10))
}
</script>

<template>
  <div class="current-week">
    <div class="navigation-days">
      <span v-for="(day, index) in days" :key="index" :class="{ selected: index === selectedDayIndex }"
        @click="selectDay(index)">
        {{ day }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.current-week {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.navigation-days {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  width: 100%;
  max-width: 600px;
  overflow-x: auto;
  scrollbar-width: none;
}

.navigation-days::-webkit-scrollbar {
  display: none;
}

.navigation-days span {
  padding: 0.5rem 1rem;
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  color: #007bff;
  background-color: #f1f1f1;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.navigation-days span.selected {
  background-color: #007bff;
  color: white;
  box-shadow: 0px 4px 8px rgba(0, 123, 255, 0.3);
}

.navigation-days span:hover {
  background-color: #d0e8ff;
}

@media (max-width: 375px) {
  .current-week {
    padding: 0.5rem;
    margin: 1rem 0;
  }

  .navigation-days span {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (min-width: 376px) and (max-width: 768px) {
  .current-week {
    padding: 1rem;
    margin: 1.5rem 0;
  }

  .navigation-days span {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
}

@media (min-width: 769px) {
  .current-week {
    max-width: 800px;
    margin: 2rem auto;
  }

  .navigation-days span {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
  }
}
</style>
