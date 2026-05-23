<template>
  <div class="calendar-view app-page">
    <div class="page-header">
      <button class="nav-btn" @click="router.push('/')">← 返回</button>
      <h1>日记日历</h1>
      <div></div>
    </div>

    <!-- 月份导航 -->
    <div class="month-nav">
      <button class="month-btn" @click="prevMonth">‹</button>
      <span class="month-label">{{ displayMonth }}</span>
      <button class="month-btn" @click="nextMonth">›</button>
    </div>

    <!-- 星期头 -->
    <div class="weekday-header">
      <span v-for="d in weekdays" :key="d">{{ d }}</span>
    </div>

    <!-- 日历格子 -->
    <div class="calendar-grid">
      <div
        v-for="(day, idx) in calendarDays"
        :key="idx"
        class="calendar-cell"
        :class="{
          'other-month': !day.currentMonth,
          'today': day.isToday,
          'has-diary': day.hasDiary,
          'selected': day.dateStr === selectedDate,
        }"
        @click="selectDay(day)"
      >
        <span class="day-num">{{ day.day }}</span>
        <span v-if="day.hasDiary" class="diary-dot">●</span>
      </div>
    </div>

    <!-- 选中日期的日记预览 -->
    <div v-if="selectedEntry" class="diary-preview" @click="openDiary(selectedDate)">
      <div class="preview-header">
        <span class="preview-date">{{ selectedDate }}</span>
        <span class="mood-badge">{{ moodEmoji[selectedEntry.mood] }}</span>
      </div>
      <h3 class="preview-title">{{ selectedEntry.title }}</h3>
      <p class="preview-content">{{ selectedEntry.content.slice(0, 100) }}{{ selectedEntry.content.length > 100 ? '...' : '' }}</p>
    </div>
    <div v-else-if="selectedDate" class="no-diary-hint">
      <p>{{ selectedDate }} 还没有日记</p>
      <button class="write-btn" @click="openDiary(selectedDate)">✏️ 写一篇</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useDiaryStore, type DiaryEntry } from '../stores'

dayjs.locale('zh-cn')

const router = useRouter()
const diaryStore = useDiaryStore()

const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const moodEmoji: Record<string, string> = {
  happy: '😊', normal: '😐', sad: '😢', excited: '🤩', anxious: '😰'
}

const today = dayjs()
const currentMonth = ref(dayjs().startOf('month'))
const selectedDate = ref(today.format('YYYY-MM-DD'))

const displayMonth = computed(() => currentMonth.value.format('YYYY年M月'))

const prevMonth = () => { currentMonth.value = currentMonth.value.subtract(1, 'month') }
const nextMonth = () => { currentMonth.value = currentMonth.value.add(1, 'month') }

interface CalendarDay {
  day: number
  dateStr: string
  currentMonth: boolean
  isToday: boolean
  hasDiary: boolean
}

const calendarDays = computed<CalendarDay[]>(() => {
  const start = currentMonth.value.startOf('month')
  const end = currentMonth.value.endOf('month')
  const days: CalendarDay[] = []

  // 填充前面的空白
  const startDow = start.day()
  for (let i = 0; i < startDow; i++) {
    const d = start.subtract(startDow - i, 'day')
    days.push({
      day: d.date(),
      dateStr: d.format('YYYY-MM-DD'),
      currentMonth: false,
      isToday: false,
      hasDiary: diaryStore.getDatesWithEntries.has(d.format('YYYY-MM-DD')),
    })
  }

  for (let d = start; d.isBefore(end) || d.isSame(end, 'day'); d = d.add(1, 'day')) {
    const ds = d.format('YYYY-MM-DD')
    days.push({
      day: d.date(),
      dateStr: ds,
      currentMonth: true,
      isToday: ds === today.format('YYYY-MM-DD'),
      hasDiary: diaryStore.getDatesWithEntries.has(ds),
    })
  }

  // 补齐末尾
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const d = end.add(i, 'day')
    days.push({
      day: d.date(),
      dateStr: d.format('YYYY-MM-DD'),
      currentMonth: false,
      isToday: false,
      hasDiary: diaryStore.getDatesWithEntries.has(d.format('YYYY-MM-DD')),
    })
  }

  return days
})

const selectedEntry = computed<DiaryEntry | undefined>(() =>
  selectedDate.value ? diaryStore.getByDate(selectedDate.value) : undefined
)

const selectDay = (day: CalendarDay) => {
  selectedDate.value = day.dateStr
  if (!day.currentMonth) {
    currentMonth.value = dayjs(day.dateStr).startOf('month')
  }
}

const openDiary = (date: string) => {
  router.push(`/diary/${date}`)
}
</script>

<style scoped>
.calendar-view {
  min-height: 100vh;
  background: #0f0f1a;
  padding-bottom: 80px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 8px;
}

.page-header h1 { color: #fff; font-size: 1.2rem; margin: 0; }

.nav-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  font-size: 1rem;
  cursor: pointer;
  padding: 4px 8px;
}

.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 12px;
}

.month-label { color: #fff; font-size: 1.1rem; font-weight: 700; }
.month-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  width: 36px; height: 36px;
  border-radius: 50%;
  font-size: 1.4rem;
  cursor: pointer;
  transition: background 0.2s;
}
.month-btn:hover { background: rgba(255,255,255,0.2); }

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 8px;
  margin-bottom: 4px;
}

.weekday-header span {
  text-align: center;
  color: rgba(255,255,255,0.4);
  font-size: 0.8rem;
  padding: 4px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 0 8px;
}

.calendar-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
  background: rgba(255,255,255,0.03);
}

.calendar-cell:active { transform: scale(0.9); }

.day-num {
  font-size: 0.95rem;
  color: #fff;
  font-weight: 500;
}

.calendar-cell.other-month .day-num { color: rgba(255,255,255,0.2); }

.calendar-cell.today {
  background: rgba(99, 102, 241, 0.3);
  border: 1px solid rgba(99, 102, 241, 0.6);
}

.calendar-cell.today .day-num { color: #818cf8; font-weight: 700; }

.calendar-cell.selected {
  background: rgba(99, 102, 241, 0.5);
  border: 1px solid #818cf8;
}

.calendar-cell.has-diary .day-num { color: #34d399; }

.diary-dot {
  font-size: 0.35rem;
  color: #34d399;
  position: absolute;
  bottom: 4px;
}

.diary-preview {
  margin: 16px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.diary-preview:active { transform: scale(0.98); }

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.preview-date { color: rgba(255,255,255,0.5); font-size: 0.8rem; }
.mood-badge { font-size: 1.2rem; }

.preview-title { color: #fff; font-size: 1rem; font-weight: 700; margin: 0 0 8px; }
.preview-content { color: rgba(255,255,255,0.6); font-size: 0.85rem; line-height: 1.6; margin: 0; }

.no-diary-hint {
  margin: 16px;
  text-align: center;
  padding: 20px;
}

.no-diary-hint p { color: rgba(255,255,255,0.4); margin-bottom: 12px; }

.write-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  color: #fff;
  padding: 10px 24px;
  border-radius: 24px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.write-btn:hover { opacity: 0.9; }
</style>
