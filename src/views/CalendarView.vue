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
        :style="{ background: getCellGradient(idx, day) }"
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

// ========== 五彩渐变生成器 ==========
// 每个格子拥有独一无二的色彩，按周排列 7 种色系
const huePalettes = [
  [340, 20],   // 第一周 → 粉紫-暖红
  [10, 45],    // 第二周 → 橙-琥珀
  [30, 75],    // 第三周 → 金黄-柠檬
  [70, 160],   // 第四周 → 嫩绿-翡翠
  [170, 220],  // 第五周 → 青蓝-海洋
  [250, 310],  // 第六周 → 紫罗兰-薰衣草
]

const generateHSL = (h: number, s: number, l: number) => `hsl(${h},${s}%,${l}%)`

const getCellGradient = (idx: number, _day: CalendarDay): string => {
  const row = Math.floor(idx / 7)
  const col = idx % 7
  const palette = huePalettes[row] || huePalettes[5]

  // 在色系范围内按列微调色相
  const hueRange = palette[1] - palette[0]
  const hue = palette[0] + (col / 6) * hueRange

  // 饱和度在 45-65 之间浮动
  const saturation = 45 + ((idx * 7) % 21)

  // 明度在 22-38 之间浮动，保持深色基底
  const lightness = 22 + ((idx * 13) % 17)

  return `linear-gradient(135deg, ${generateHSL(Math.round(hue), saturation, lightness)}, ${generateHSL(Math.round(hue + 15), saturation + 8, lightness + 6)})`
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
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

.calendar-cell:active { transform: scale(0.9); }

.day-num {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.92);
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
  transition: all 0.15s;
}

.calendar-cell.other-month {
  opacity: 0.35;
}

.calendar-cell.other-month .day-num {
  color: rgba(255,255,255,0.3);
}

.calendar-cell.today {
  outline: 2px solid rgba(255,255,255,0.7);
  outline-offset: -2px;
  transform: scale(1.05);
  box-shadow: 0 0 16px rgba(255,255,255,0.15);
  z-index: 2;
}

.calendar-cell.today .day-num {
  color: #fff;
  font-weight: 800;
  font-size: 1rem;
}

.calendar-cell.selected {
  outline: 2px solid #fff;
  outline-offset: -2px;
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255,255,255,0.25);
  z-index: 1;
}

.calendar-cell.has-diary::after {
  content: '';
  position: absolute;
  bottom: 4px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 6px rgba(255,255,255,0.6);
}

.diary-dot {
  display: none;
  /* 用 ::after 替代 */
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
