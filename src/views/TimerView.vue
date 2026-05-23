<template>
  <div class="timer-view app-page">
    <div class="page-header">
      <button class="nav-btn" @click="router.push('/')">← 返回</button>
      <h1>时刻记录</h1>
      <button class="add-btn" @click="showAddModal = true">+</button>
    </div>

    <!-- 空状态 -->
    <div v-if="timerStore.records.length === 0" class="empty-state">
      <div class="empty-icon">⏱️</div>
      <p>还没有记录任何时刻</p>
      <p class="empty-hint">记录一个重要时刻，追踪距今已过去多久</p>
      <button class="add-record-btn" @click="showAddModal = true">+ 添加第一条记录</button>
    </div>

    <!-- 记录列表 -->
    <div v-else class="records-list">
      <TimerCard
        v-for="record in sortedRecords"
        :key="record.id"
        :record="record"
        @delete="timerStore.deleteRecord($event)"
        @edit="startEdit"
      />
    </div>

    <!-- 添加/编辑弹窗 -->
    <Teleport to="body">
      <div v-if="showAddModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <h3 class="modal-title">{{ editingId ? '编辑记录' : '添加时刻记录' }}</h3>

          <!-- Emoji 选择 -->
          <div class="emoji-row">
            <button
              v-for="e in emojiOptions"
              :key="e"
              class="emoji-btn"
              :class="{ active: selectedEmoji === e }"
              @click="selectedEmoji = e"
            >{{ e }}</button>
          </div>

          <!-- 标签输入 -->
          <div class="form-group">
            <label>记录描述</label>
            <input
              v-model="newLabel"
              class="form-input"
              placeholder="例如：开始戒烟 / 上次撸管 / 开始健身..."
              maxlength="30"
            />
          </div>

          <!-- 时间选择 -->
          <div class="form-group">
            <label>记录时刻（精确到秒）</label>
            <input
              v-model="newDateTime"
              type="datetime-local"
              class="form-input"
              step="1"
            />
          </div>

          <!-- 快速设置当前时间 -->
          <button class="now-btn" @click="setNow">📍 设置为现在</button>

          <div class="modal-actions">
            <button class="cancel-btn" @click="closeModal">取消</button>
            <button class="confirm-btn" @click="saveRecord">{{ editingId ? '保存' : '添加' }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useTimerStore, type TimerRecord } from '../stores'
import TimerCard from '../components/timer/TimerCard.vue'

const router = useRouter()
const timerStore = useTimerStore()

const showAddModal = ref(false)
const newLabel = ref('')
const newDateTime = ref('')
const selectedEmoji = ref('📌')
const editingId = ref<string | null>(null)

const emojiOptions = ['📌', '🚬', '💪', '❤️', '🎯', '⚡', '🌟', '🔥', '😤', '🧘', '🍺', '🎮', '💊', '✂️', '🏃']

const sortedRecords = computed(() =>
  [...timerStore.records].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
)

const setNow = () => {
  newDateTime.value = dayjs().format('YYYY-MM-DDTHH:mm:ss')
}

const closeModal = () => {
  showAddModal.value = false
  editingId.value = null
  newLabel.value = ''
  newDateTime.value = ''
  selectedEmoji.value = '📌'
}

const saveRecord = () => {
  if (!newLabel.value.trim() || !newDateTime.value) {
    alert('请填写描述和时间')
    return
  }
  const isoStr = dayjs(newDateTime.value).toISOString()
  if (editingId.value) {
    timerStore.updateRecord(editingId.value, {
      label: newLabel.value.trim(),
      recordedAt: isoStr,
      emoji: selectedEmoji.value,
    })
  } else {
    timerStore.addRecord(newLabel.value.trim(), isoStr, selectedEmoji.value)
  }
  closeModal()
}

const startEdit = (record: TimerRecord) => {
  editingId.value = record.id
  newLabel.value = record.label
  newDateTime.value = dayjs(record.recordedAt).format('YYYY-MM-DDTHH:mm:ss')
  selectedEmoji.value = record.emoji
  showAddModal.value = true
}
</script>

<style scoped>
.timer-view {
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
  background: none; border: none;
  color: rgba(255,255,255,0.7);
  font-size: 1rem; cursor: pointer; padding: 4px 8px;
}

.add-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none; color: #fff;
  width: 36px; height: 36px;
  border-radius: 50%;
  font-size: 1.4rem;
  cursor: pointer;
  line-height: 36px;
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon { font-size: 3.5rem; margin-bottom: 16px; }
.empty-state p { color: rgba(255,255,255,0.5); margin-bottom: 8px; }
.empty-hint { font-size: 0.85rem !important; }

.add-record-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none; color: #fff;
  padding: 12px 28px; border-radius: 24px;
  font-size: 1rem; cursor: pointer;
  margin-top: 12px;
}

.records-list { padding: 12px 16px; }

/* 弹窗 */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(6px);
  display: flex; align-items: flex-end;
  z-index: 1000;
}

.modal-card {
  background: #1a1a2e;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px 24px 0 0;
  padding: 24px 20px 40px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  color: #fff; font-size: 1.1rem; margin: 0 0 16px; text-align: center;
}

.emoji-row {
  display: flex; flex-wrap: wrap;
  gap: 8px; margin-bottom: 16px; justify-content: center;
}

.emoji-btn {
  font-size: 1.4rem;
  background: rgba(255,255,255,0.06);
  border: 2px solid transparent;
  border-radius: 10px;
  width: 44px; height: 44px;
  cursor: pointer;
  transition: all 0.15s;
}

.emoji-btn.active {
  border-color: #818cf8;
  background: rgba(129,140,248,0.2);
  transform: scale(1.15);
}

.form-group { margin-bottom: 14px; }
.form-group label {
  display: block;
  color: rgba(255,255,255,0.5);
  font-size: 0.8rem;
  margin-bottom: 6px;
}

.form-input {
  width: 100%; box-sizing: border-box;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  color: #fff; font-size: 0.95rem;
  padding: 10px 14px;
  outline: none;
  color-scheme: dark;
}

.form-input:focus { border-color: #818cf8; }

.now-btn {
  background: rgba(99,102,241,0.15);
  border: 1px solid rgba(99,102,241,0.3);
  color: #818cf8;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  width: 100%; margin-bottom: 16px;
}

.modal-actions {
  display: flex; gap: 10px;
}

.cancel-btn {
  flex: 1;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.7);
  padding: 12px; border-radius: 12px;
  font-size: 0.95rem; cursor: pointer;
}

.confirm-btn {
  flex: 2;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none; color: #fff;
  padding: 12px; border-radius: 12px;
  font-size: 0.95rem; cursor: pointer;
  font-weight: 700;
}
</style>
