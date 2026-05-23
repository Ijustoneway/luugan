import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface DiaryEntry {
  id: string
  date: string // YYYY-MM-DD
  title: string
  content: string
  mood: 'happy' | 'normal' | 'sad' | 'excited' | 'anxious'
  createdAt: string
  updatedAt: string
}

export interface TimerRecord {
  id: string
  label: string
  recordedAt: string // ISO string 精确到秒
  emoji: string
  createdAt: string
}

const DIARY_KEY = 'luugan_diary_entries'
const TIMER_KEY = 'luugan_timer_records'

function loadFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

export const useDiaryStore = defineStore('diary', () => {
  const entries = ref<DiaryEntry[]>(loadFromStorage<DiaryEntry>(DIARY_KEY))

  const saveEntries = () => saveToStorage(DIARY_KEY, entries.value)

  const getByDate = (date: string) => entries.value.find(e => e.date === date)

  const getDatesWithEntries = computed(() => new Set(entries.value.map(e => e.date)))

  const saveEntry = (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const existing = entries.value.find(e => e.date === entry.date)
    if (existing) {
      Object.assign(existing, { ...entry, updatedAt: new Date().toISOString() })
    } else {
      entries.value.push({
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
    saveEntries()
  }

  const deleteEntry = (date: string) => {
    const idx = entries.value.findIndex(e => e.date === date)
    if (idx !== -1) {
      entries.value.splice(idx, 1)
      saveEntries()
    }
  }

  return { entries, getByDate, getDatesWithEntries, saveEntry, deleteEntry }
})

export const useTimerStore = defineStore('timer', () => {
  const records = ref<TimerRecord[]>(loadFromStorage<TimerRecord>(TIMER_KEY))

  const saveRecords = () => saveToStorage(TIMER_KEY, records.value)

  const addRecord = (label: string, recordedAt: string, emoji = '📌') => {
    records.value.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      label,
      recordedAt,
      emoji,
      createdAt: new Date().toISOString(),
    })
    saveRecords()
  }

  const deleteRecord = (id: string) => {
    const idx = records.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      records.value.splice(idx, 1)
      saveRecords()
    }
  }

  const updateRecord = (id: string, data: Partial<Pick<TimerRecord, 'label' | 'emoji' | 'recordedAt'>>) => {
    const record = records.value.find(r => r.id === id)
    if (record) {
      Object.assign(record, data)
      saveRecords()
    }
  }

  return { records, addRecord, deleteRecord, updateRecord }
})
