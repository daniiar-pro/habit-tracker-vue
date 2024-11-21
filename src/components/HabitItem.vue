<script setup>
const props = defineProps(['title', 'completed', 'stopped', 'isFutureDate'])
const emit = defineEmits(['delete-habit', 'edit-habit', 'toggle-completed', 'stop-habit'])

function handleCompleted() {
  emit('toggle-completed', props.title)
}

function handleDelete() {
  emit('delete-habit', props.title)
}

function handleStop() {
  emit('stop-habit', props.title)
}

function handleEdit() {
  emit('edit-habit')
}
</script>

<template>



  <div class="habit-item">
    <h3>
      {{ title }}
      <i v-if="stopped" style="color: lightblue; font-size: 0.9rem">(stopped habit)</i>
    </h3>
    <input v-if="!stopped" type="checkbox" :checked="completed" :disabled="isFutureDate" @change="handleCompleted" />
    <button class="edit-btn" @click="handleEdit" v-if="!stopped">Edit</button>
    <button class="delete-btn" @click="handleDelete">Delete</button>
    <button class="stop-btn" :disabled="stopped" @click="handleStop">
      <span v-if="!stopped">Stop</span>
      <span v-else style="color: lightgrey;">Stopped</span>
    </button>
  </div>


</template>
<style scoped>
.habit-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.habit-item h3 {
  margin: 0;
  font-size: 0.9rem;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

input[type='checkbox'] {
  transform: scale(0.9);
  cursor: pointer;
  flex-shrink: 0;
}

button {
  padding: 0.2rem 0.4rem;
  font-size: 0.75rem;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;
}

.edit-btn {
  background-color: #4caf50;
}

.edit-btn:hover {
  background-color: #388e3c;
}

.delete-btn {
  background-color: #e53935;
}

.delete-btn:hover {
  background-color: #b71c1c;
}

.stop-btn {
  background-color: #ffa726;
}

.stop-btn:hover {
  background-color: #fb8c00;
}

@media (max-width: 375px) {
  .habit-item {
    gap: 0.2rem;
    padding: 0.4rem;
  }

  .habit-item h3 {
    font-size: 0.8rem;
  }

  input[type='checkbox'] {
    transform: scale(0.85);
  }

  button {
    padding: 0.2rem 0.3rem;
    font-size: 0.7rem;
  }
}
</style>
