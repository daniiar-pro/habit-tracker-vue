<script setup>
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const date = ref(new Date())
const flow = ref(['month', 'year', 'calendar'])

</script>

<template>
    
    <VueDatePicker v-model="date" :flow="flow" placeholder="Select Date"/>
    
    </template>

<style scoped></style>
