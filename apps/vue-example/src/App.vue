<script setup lang="ts">
import theme from '@avatune/modern-cartoon-theme/vue'
import { Avatar } from '@avatune/vue'
</script>

<template>
  <div class="content">
    <h1>Modern Cartoon Avatar Example</h1>
    <Avatar
      :theme="theme"
      :config="{
        body: 'shirt',
        ears: 'default',
        eyebrows: 'funny',
        eyes: 'dots',
        hair: 'short',
        head: 'oval',
        mouth: 'smile',
        noses: 'curve',
      }"
    />

    <h2>Random Avatar (tag-based)</h2>
    <Avatar
      :theme="theme"
      :config="{
        seed: 'random-seed-123',
      }"
    />
  </div>
</template>

<style scoped>
.content {
  display: flex;
  min-height: 100vh;
  line-height: 1.1;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content h1 {
  font-size: 3.6rem;
  font-weight: 700;
}

.content h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-top: 2rem;
}
</style>
