<script setup lang="ts">
import { Shirt } from '@avatune/modern-cartoon-assets/vue'
</script>

<template>
  <div class="content">
    <h1>Rsbuild with Vue</h1>
    <p>Start building amazing things with Rsbuild.</p>
    <div class="preview">
      <Shirt class="asset" />
    </div>
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
}

.content h1 {
  font-size: 3.6rem;
  font-weight: 700;
}

.content p {
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.5;
}

.preview {
  margin-top: 24px;
}

.asset :deep(svg) {
  width: 160px;
  height: auto;
  display: inline-block;
}
</style>
