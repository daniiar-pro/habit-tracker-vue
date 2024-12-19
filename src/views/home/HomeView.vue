<script setup lang="ts">
import { ref, onMounted } from 'vue'

const userName = ref<string>('')
const welcomeMessage = ref<string>('')
const showModal = ref<boolean>(false)
const isInputInvalid = ref<boolean>(false)

onMounted(() => {
  const storedName = localStorage.getItem('userName')
  if (storedName) {
    userName.value = storedName
    welcomeMessage.value = `Welcome, ${storedName}!`
    showModal.value = false
  } else {
    showModal.value = true
  }
})

function checkUserName() {
  if (!userName.value.trim()) {
    isInputInvalid.value = true
    return
  }

  localStorage.setItem('userName', userName.value)
  welcomeMessage.value = `Welcome, ${userName.value}!`
  showModal.value = false
  isInputInvalid.value = false
}
</script>

<template>
  <div class="home-view">
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Please Enter Your Name</h3>
        <input type="text" v-model="userName" :class="{ 'input-invalid': isInputInvalid }" placeholder="Your name" />
        <span v-if="isInputInvalid" class="error-message">Name cannot be empty</span>
        <button @click="checkUserName">Submit</button>
      </div>
    </div>

    <div v-else class="user-guidance">
      <h1 class="welcome-message">{{ welcomeMessage }}</h1>
      <h2 class="subheading">Let's get started!</h2>

      <div class="guidance-card">
        <p class="intro-text">This app helps you track your habits. It consists of 3 pages:</p>

        <div class="guidance-section">
          <h3>🏠 Home Page</h3>
          <p>Guides you on how to use the app.</p>
        </div>

        <div class="guidance-section">
          <h3>📋 Habits Page</h3>
          <p>Manage your habits and track your daily and weekly progress.</p>
        </div>

        <div class="guidance-section">
          <h3>📅 Calendar Page</h3>
          <p>Navigate to past or future dates and see your progress on specific days.</p>
        </div>
      </div>
    </div>
  </div>
</template>




<style scoped>
.user-guidance {
  padding: 2rem;
  text-align: center;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 800px;
  margin: 2rem auto;
}

.welcome-message {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 1rem;
}

.subheading {
  font-size: 1.5rem;
  font-weight: normal;
  color: #333;
  margin-bottom: 2rem;
}

.guidance-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 2rem;
  text-align: left;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.intro-text {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #555;
  line-height: 1.5;
}

.guidance-section {
  margin-bottom: 1.5rem;
}

.guidance-section h3 {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.guidance-section p {
  font-size: 1rem;
  color: #555;
  margin: 0;
}

@media (max-width: 768px) {
  .user-guidance {
    padding: 1.5rem;
  }

  .welcome-message {
    font-size: 1.8rem;
  }

  .subheading {
    font-size: 1.3rem;
  }

  .guidance-card {
    padding: 1.5rem;
  }

  .guidance-section h3 {
    font-size: 1.2rem;
  }

  .guidance-section p {
    font-size: 0.9rem;
  }
}

.home-view {
  padding: 2rem;
  text-align: center;
  font-family: Arial, sans-serif;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.modal h3 {
  margin-bottom: 1rem;
}

.modal input {
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: border-color 0.3s ease;
}

.modal input.input-invalid {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: block;
}

.modal button {
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal button:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .home-view {
    padding: 1rem;
  }

  .modal {
    padding: 1.5rem;
  }

  .modal button {
    width: 100%;
  }
}
</style>
