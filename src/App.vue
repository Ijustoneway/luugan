<template>
  <div id="app-root">
    <RouterView />
    <!-- 底部导航 -->
    <nav class="bottom-nav">
      <RouterLink to="/" class="nav-item" :class="{ active: route.path === '/' }">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">主页</span>
      </RouterLink>
      <RouterLink to="/calendar" class="nav-item" :class="{ active: route.path === '/calendar' }">
        <span class="nav-icon">📅</span>
        <span class="nav-label">日历</span>
      </RouterLink>
      <RouterLink :to="`/diary/${today}`" class="nav-item" :class="{ active: route.path.startsWith('/diary') }">
        <span class="nav-icon">✏️</span>
        <span class="nav-label">日记</span>
      </RouterLink>
      <RouterLink to="/timer" class="nav-item" :class="{ active: route.path === '/timer' }">
        <span class="nav-icon">⏱️</span>
        <span class="nav-label">时刻</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import dayjs from 'dayjs'
const route = useRoute()
const today = dayjs().format('YYYY-MM-DD')
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background: #0f0f1a;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

#app-root {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  background: #0f0f1a;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  background: rgba(15,15,26,0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 10px 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-icon { font-size: 1.3rem; }
.nav-label { font-size: 0.65rem; color: rgba(255,255,255,0.4); }

.nav-item.active .nav-icon { transform: scale(1.1); }
.nav-item.active .nav-label { color: #818cf8; }

input, textarea, select {
  font-family: inherit;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
</style>
