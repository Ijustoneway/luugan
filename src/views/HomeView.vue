<template>
  <div class="home-view">
    <!-- 壁纸背景 -->
    <div class="wallpaper-bg" :style="{ backgroundImage: `url(${wallpaper})` }">
      <div class="wallpaper-overlay"></div>
    </div>

    <!-- 顶部时间 -->
    <div class="header">
      <div class="current-time">
        <span class="time-text">{{ currentTime }}</span>
        <span class="date-text">{{ currentDate }}</span>
      </div>
    </div>

    <!-- 励志语录卡片 -->
    <div class="quote-card">
      <div class="quote-icon">✨</div>
      <p class="quote-text">"{{ quote.text }}"</p>
      <p class="quote-author">— {{ quote.author }}</p>
      <button class="refresh-btn" @click="refreshQuote">换一句</button>
    </div>

    <!-- 快速入口 -->
    <div class="quick-actions">
      <div class="action-card" @click="router.push('/calendar')">
        <span class="action-icon">📅</span>
        <span class="action-label">日记日历</span>
        <span class="action-count">{{ diaryCount }} 篇</span>
      </div>
      <div class="action-card" @click="router.push('/diary')">
        <span class="action-icon">✏️</span>
        <span class="action-label">写日记</span>
        <span class="action-hint">今日</span>
      </div>
      <div class="action-card" @click="router.push('/timer')">
        <span class="action-icon">⏱️</span>
        <span class="action-label">时刻记录</span>
        <span class="action-count">{{ timerCount }} 条</span>
      </div>
    </div>

    <!-- 最近时刻记录预览 -->
    <div v-if="recentTimers.length > 0" class="timer-preview">
      <h3 class="section-title">⏰ 最近记录</h3>
      <div v-for="record in recentTimers" :key="record.id" class="timer-item" @click="router.push('/timer')">
        <span class="timer-emoji">{{ record.emoji }}</span>
        <div class="timer-info">
          <span class="timer-label">{{ record.label }}</span>
          <TimerElapsed :recordedAt="record.recordedAt" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useDiaryStore, useTimerStore } from '../stores'
import { getDailyQuote, getDailyWallpaper, quotes, wallpapers } from '../utils/quotes'
import TimerElapsed from '../components/timer/TimerElapsed.vue'

dayjs.locale('zh-cn')

const router = useRouter()
const diaryStore = useDiaryStore()
const timerStore = useTimerStore()

const currentTime = ref('')
const currentDate = ref('')
const quote = ref(getDailyQuote())
const wallpaper = ref(getDailyWallpaper())
const quoteIndex = ref(0)

const diaryCount = computed(() => diaryStore.entries.length)
const timerCount = computed(() => timerStore.records.length)
const recentTimers = computed(() => timerStore.records.slice(-3).reverse())

let timer: ReturnType<typeof setInterval>

const updateTime = () => {
  const now = dayjs()
  currentTime.value = now.format('HH:mm:ss')
  currentDate.value = now.format('YYYY年M月D日 dddd')
}

const refreshQuote = () => {
  quoteIndex.value = (quoteIndex.value + 1) % quotes.length
  quote.value = quotes[quoteIndex.value]
  const wpIdx = (quoteIndex.value) % wallpapers.length
  wallpaper.value = wallpapers[wpIdx]
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: #0f0f1a;
  padding-bottom: 80px;
  position: relative;
  overflow-x: hidden;
}

.wallpaper-bg {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 45vh;
  background-size: cover;
  background-position: center;
  z-index: 0;
  transition: background-image 0.5s ease;
}

.wallpaper-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(15,15,26,1));
}

.header {
  position: relative;
  z-index: 1;
  padding: 40px 20px 20px;
  text-align: center;
}

.current-time {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-text {
  font-size: 3.2rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 4px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.5);
  font-variant-numeric: tabular-nums;
}

.date-text {
  font-size: 1rem;
  color: rgba(255,255,255,0.8);
  margin-top: 4px;
}

.quote-card {
  position: relative;
  z-index: 1;
  margin: 0 16px 20px;
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
}

.quote-icon { font-size: 1.5rem; margin-bottom: 10px; }

.quote-text {
  color: rgba(255,255,255,0.95);
  font-size: 1rem;
  line-height: 1.7;
  margin: 0 0 10px;
  font-style: italic;
}

.quote-author {
  color: rgba(255,255,255,0.5);
  font-size: 0.85rem;
  margin: 0 0 12px;
}

.refresh-btn {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  color: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover { background: rgba(255,255,255,0.25); }

.quick-actions {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 0 16px 20px;
}

.action-card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-card:active { transform: scale(0.95); }

.action-icon { font-size: 1.8rem; }
.action-label { color: #fff; font-size: 0.85rem; font-weight: 600; }
.action-count, .action-hint {
  color: rgba(255,255,255,0.5);
  font-size: 0.75rem;
}

.timer-preview {
  position: relative;
  z-index: 1;
  margin: 0 16px;
}

.section-title {
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  margin: 0 0 12px;
  font-weight: 600;
}

.timer-item {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.timer-item:active { transform: scale(0.98); }

.timer-emoji { font-size: 1.5rem; }

.timer-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.timer-label {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
}
</style>
