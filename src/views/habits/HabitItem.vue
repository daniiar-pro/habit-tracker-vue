<script setup>
const props = defineProps(['title', 'completed'])
const emit = defineEmits(['delete-habit', 'edit-habit', 'toggle-completed'])

function handleEdit() {
  const newTitle = prompt('Edit habit:', props.title)

  if (newTitle) {
    emit('edit-habit', newTitle)
  }
}

function handleDelete() {
  emit('delete-habit')
}

function handleCompleted() {
  emit('toggle-completed')
}
</script>

<template>
  <div class="habitItem">
    <h3>{{ title }}</h3>
    <input type="checkbox" :checked="completed" @change="handleCompleted" />
    <button class="editButton" @click="handleEdit">Edit</button>
    <button class="deleteButton" @click="handleDelete">Delete</button>
  </div>
</template>

<style scoped>
.habitItem {
  display: flex;
  justify-content: space-around;
  border: 1px solid green;
  margin-top: 20px;
  text-align: center;
  padding: 5px;
}

.editButton {
  background-color: lightblue;
  border-radius: 5px;
}

.deleteButton {
  background-color: red;
  border-radius: 5px;
}
</style>
