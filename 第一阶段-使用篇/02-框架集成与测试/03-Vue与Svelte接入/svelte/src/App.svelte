<script>
  // Svelte 5 的 runes 语法：$state 声明响应式状态
  let count = $state(0);
</script>

<main class="wrap">
  <h1>Svelte 5 + Vite</h1>
  <button onclick={() => count++}>count is {count}</button>
  <p class="tip">改文案保存 → 局部更新且计数保留；build 产物几乎无运行时</p>
</main>

<style>
  /* Svelte 的 <style> 默认就是组件级作用域 */
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
    border: 1px solid #ff3e00;
    background: #ff3e00;
    color: #fff;
    border-radius: 8px;
    cursor: pointer;
  }
  .tip {
    color: #888;
    font-size: 0.85rem;
  }
</style>
