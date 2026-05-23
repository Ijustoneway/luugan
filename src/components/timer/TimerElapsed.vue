<template>
  <div class="elapsed-timer">
    <span class="elapsed-text">{{ elapsed }}</span>
  </div>
</template>

<script setup lang="ts">
import { useElapsedTimer } from '../../composables/useElapsedTimer'

const props = defineProps<{ recordedAt: string }>()
const { elapsed } = useElapsedTimer(props.recordedAt)
</script>

<style scoped>
.elapsed-timer {
  display: inline-block;
}
.elapsed-text {
  color: #f59e0b;
  font-size: 0.78rem;
  font-weight: 500;
}
</style>
