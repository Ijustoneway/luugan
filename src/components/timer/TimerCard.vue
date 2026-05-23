<template>
  <div class="timer-card">
    <div class="card-left">
      <span class="record-emoji">{{ record.emoji }}</span>
    </div>
    <div class="card-body">
      <div class="record-label">{{ record.label }}</div>
      <div class="record-time-point">
        🕐 {{ formattedRecordedAt }}
      </div>
      <!-- 实时倒计时 -->
      <div class="elapsed-row">
        <span class="elapsed-badge" :class="elapsedClass">
          {{ elapsed }}
        </span>
      </div>
      <!-- 详细拆解 -->
      <div class="detail-row">
        <span class="detail-item" v-if="detailed.days > 0">
          <span class="detail-num">{{ detailed.days }}</span><span class="detail-unit">天</span>
        </span>
        <span class="detail-item">
          <span class="detail-num">{{ detailed.hours }}</span><span class="detail-unit">时</span>
        </span>
        <span class="detail-item">
          <span class="detail-num">{{ detailed.minutes }}</span><span class="detail-unit">分</span>
        </span>
        <span class="detail-item">
          <span class="detail-num">{{ detailed.seconds }}</span><span class="detail-unit">秒</span>
        </span>
      </div>
    </div>
    <div class="card-actions">
      <button class="action-icon-btn" @click="$emit('edit', record)" title="编辑">✏️</button>
      <button class="action-icon-btn danger" @click="confirmDelete" title="删除">🗑️</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useElapsedTimer } from '../../composables/useElapsedTimer'
import type { TimerRecord } from '../../stores'

const props = defineProps<{ record: TimerRecord }>()
const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'edit', record: TimerRecord): void
}>()

const { elapsed, detailed } = useElapsedTimer(props.record.recordedAt)

const formattedRecordedAt = computed(() =>
  dayjs(props.record.recordedAt).format('YYYY年M月D日 HH:mm:ss')
)

const elapsedClass = computed(() => {
  const days = detailed.value.days
  if (days >= 30) return 'badge-gold'
  if (days >= 7) return 'badge-green'
  if (days >= 1) return 'badge-blue'
  return 'badge-purple'
})

const confirmDelete = () => {
  if (confirm(`确认删除"${props.record.label}"？`)) {
    emit('delete', props.record.id)
  }
}
</script>

<style scoped>
.timer-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.card-left {
  flex-shrink: 0;
  font-size: 2rem;
  width: 44px;
  height: 44px;
  background: rgba(255,255,255,0.06);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-body { flex: 1; min-width: 0; }

.record-label {
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.record-time-point {
  color: rgba(255,255,255,0.4);
  font-size: 0.75rem;
  margin-bottom: 8px;
}

.elapsed-row { margin-bottom: 8px; }

.elapsed-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-purple { background: rgba(139,92,246,0.2); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3); }
.badge-blue { background: rgba(59,130,246,0.2); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
.badge-green { background: rgba(52,211,153,0.2); color: #34d399; border: 1px solid rgba(52,211,153,0.3); }
.badge-gold { background: rgba(245,158,11,0.2); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }

.detail-row {
  display: flex;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.detail-num {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  min-width: 1.5ch;
  text-align: right;
}

.detail-unit {
  color: rgba(255,255,255,0.4);
  font-size: 0.7rem;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.action-icon-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.action-icon-btn:hover { opacity: 1; }
.action-icon-btn.danger:hover { filter: brightness(1.2); }
</style>
