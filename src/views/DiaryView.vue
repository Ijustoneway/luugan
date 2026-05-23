<template>
  <div class="diary-view app-page">
    <div class="page-header">
      <button class="nav-btn" @click="router.back()">← 返回</button>
      <h1>{{ pageTitle }}</h1>
      <button v-if="!isEditing" class="edit-btn" @click="startEdit">编辑</button>
      <button v-else class="save-btn" @click="saveDiary">保存</button>
    </div>

    <!-- 日期选择器 -->
    <div class="date-picker-bar">
      <button class="date-nav" @click="changeDate(-1)">‹</button>
      <div class="date-display">
        <span class="date-main">{{ displayDate }}</span>
        <span class="date-week">{{ displayWeek }}</span>
      </div>
      <button class="date-nav" @click="changeDate(1)">›</button>
    </div>

    <!-- 心情选择 -->
    <div class="mood-selector">
      <button
        v-for="(emoji, key) in moodOptions"
        :key="key"
        class="mood-btn"
        :class="{ active: currentMood === key }"
        @click="currentMood = key as any"
      >
        {{ emoji }}
      </button>
    </div>

    <!-- 查看模式 -->
    <div v-if="!isEditing && currentEntry" class="diary-read-view">
      <h2 class="diary-title-read">{{ currentTitle }}</h2>
      <div class="diary-content-read" v-html="formattedContent"></div>
    </div>

    <!-- 编辑模式 -->
    <div v-if="isEditing" class="diary-edit-view">
      <input
        v-model="currentTitle"
        class="title-input"
        placeholder="日记标题..."
        maxlength="50"
      />
      <textarea
        v-model="currentContent"
        class="content-textarea"
        placeholder="今天发生了什么？记录下来吧..."
        rows="16"
      ></textarea>
    </div>

    <!-- 空状态 -->
    <div v-if="!isEditing && !currentEntry" class="empty-state">
      <div class="empty-icon">📝</div>
      <p>还没有今天的日记</p>
      <button class="write-btn" @click="startEdit">开始写作</button>
    </div>

    <!-- 删除按钮 -->
    <div v-if="!isEditing && currentEntry" class="action-bar">
      <button class="delete-btn" @click="deleteDiary">🗑️ 删除</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { useDiaryStore } from '../stores'

dayjs.locale('zh-cn')

const router = useRouter()
const route = useRoute()
const diaryStore = useDiaryStore()

type Mood = 'happy' | 'normal' | 'sad' | 'excited' | 'anxious'

const moodOptions: Record<Mood, string> = {
  happy: '😊', normal: '😐', sad: '😢', excited: '🤩', anxious: '😰'
}

const today = dayjs().format('YYYY-MM-DD')
const currentDate = ref<string>(route.params.date as string || today)
const isEditing = ref(false)

const currentEntry = computed(() => diaryStore.getByDate(currentDate.value))

const currentTitle = ref('')
const currentContent = ref('')
const currentMood = ref<Mood>('normal')

const loadEntry = () => {
  if (currentEntry.value) {
    currentTitle.value = currentEntry.value.title
    currentContent.value = currentEntry.value.content
    currentMood.value = currentEntry.value.mood
    isEditing.value = false
  } else {
    currentTitle.value = ''
    currentContent.value = ''
    currentMood.value = 'normal'
    isEditing.value = false
  }
}

watch(currentDate, loadEntry, { immediate: true })

const displayDate = computed(() => dayjs(currentDate.value).format('M月D日'))
const displayWeek = computed(() => dayjs(currentDate.value).format('dddd'))
const pageTitle = computed(() => `${dayjs(currentDate.value).format('YYYY年M月D日')} 日记`)

const formattedContent = computed(() =>
  currentContent.value.replace(/\n/g, '<br/>')
)

const changeDate = (delta: number) => {
  currentDate.value = dayjs(currentDate.value).add(delta, 'day').format('YYYY-MM-DD')
}

const startEdit = () => {
  if (!currentEntry.value) {
    currentTitle.value = ''
    currentContent.value = ''
    currentMood.value = 'normal'
  }
  isEditing.value = true
}

const saveDiary = () => {
  if (!currentTitle.value.trim() && !currentContent.value.trim()) {
    isEditing.value = false
    return
  }
  diaryStore.saveEntry({
    date: currentDate.value,
    title: currentTitle.value.trim() || `${dayjs(currentDate.value).format('M月D日')} 日记`,
    content: currentContent.value,
    mood: currentMood.value,
  })
  isEditing.value = false
}

const deleteDiary = () => {
  if (confirm('确认删除这篇日记？')) {
    diaryStore.deleteEntry(currentDate.value)
    loadEntry()
  }
}
</script>

<style scoped>
.diary-view {
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

.page-header h1 { color: #fff; font-size: 1rem; margin: 0; flex: 1; text-align: center; }

.nav-btn, .edit-btn, .save-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 4px 8px;
  white-space: nowrap;
}

.save-btn { color: #818cf8; font-weight: 700; }

.date-picker-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 10px 16px;
  background: rgba(255,255,255,0.04);
  margin: 0 16px;
  border-radius: 14px;
  margin-bottom: 12px;
}

.date-nav {
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  width: 32px; height: 32px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
}

.date-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-main { color: #fff; font-size: 1.2rem; font-weight: 700; }
.date-week { color: rgba(255,255,255,0.5); font-size: 0.8rem; }

.mood-selector {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 0 16px 16px;
}

.mood-btn {
  font-size: 1.6rem;
  background: rgba(255,255,255,0.05);
  border: 2px solid transparent;
  border-radius: 50%;
  width: 48px; height: 48px;
  cursor: pointer;
  transition: all 0.2s;
}

.mood-btn.active {
  border-color: #818cf8;
  background: rgba(129, 140, 248, 0.15);
  transform: scale(1.15);
}

.diary-read-view {
  padding: 0 20px;
}

.diary-title-read {
  color: #fff;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 16px;
}

.diary-content-read {
  color: rgba(255,255,255,0.8);
  font-size: 1rem;
  line-height: 1.8;
}

.diary-edit-view {
  padding: 0 16px;
}

.title-input {
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 12px 16px;
  margin-bottom: 12px;
  outline: none;
  box-sizing: border-box;
}

.title-input:focus { border-color: #818cf8; }
.title-input::placeholder { color: rgba(255,255,255,0.3); }

.content-textarea {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  color: rgba(255,255,255,0.9);
  font-size: 1rem;
  line-height: 1.8;
  padding: 14px 16px;
  resize: none;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
}

.content-textarea:focus { border-color: rgba(255,255,255,0.25); }
.content-textarea::placeholder { color: rgba(255,255,255,0.25); }

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon { font-size: 3rem; margin-bottom: 16px; }
.empty-state p { color: rgba(255,255,255,0.4); margin-bottom: 20px; }

.write-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  color: #fff;
  padding: 12px 28px;
  border-radius: 24px;
  font-size: 1rem;
  cursor: pointer;
}

.action-bar {
  display: flex;
  justify-content: center;
  padding: 24px;
}

.delete-btn {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
}
</style>
