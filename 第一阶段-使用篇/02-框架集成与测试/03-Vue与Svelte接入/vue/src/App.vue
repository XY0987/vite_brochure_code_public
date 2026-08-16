<template>
  <main class="wrap">
    <h1>Vue 3 + Vite</h1>
    <button @click="count++">count is {{ count }}</button>
    <p class="tip">改文案保存 → 局部更新且计数保留（@vitejs/plugin-vue 的 HMR）</p>
  </main>
</template>

<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>

<style scoped>
/* scoped：编译后会被加上 [data-v-xxxx] 属性选择器，仅作用于本组件 */
.wrap {
  font-family: system-ui, sans-serif;
  display: grid;
  place-items: center;
  min-height: 100vh;
  gap: 0.6rem;
}
button {
  font-size: 1.1rem;
  padding: 0.6rem 1.2rem;
  border: 1px solid #42b883;
  background: #42b883;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
}
.tip {
  color: #888;
  font-size: 0.85rem;
}
</style>
