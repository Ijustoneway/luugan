import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export function useElapsedTimer(targetIso: string) {
  const elapsed = ref('')
  const detailed = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const update = () => {
    const now = dayjs()
    const target = dayjs(targetIso)
    const diff = now.diff(target, 'second')

    if (diff < 0) {
      elapsed.value = '尚未到达'
      detailed.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return
    }

    const days = Math.floor(diff / 86400)
    const hours = Math.floor((diff % 86400) / 3600)
    const minutes = Math.floor((diff % 3600) / 60)
    const seconds = diff % 60

    detailed.value = { days, hours, minutes, seconds }

    const parts = []
    if (days > 0) parts.push(`${days}天`)
    if (hours > 0) parts.push(`${hours}小时`)
    if (minutes > 0) parts.push(`${minutes}分`)
    parts.push(`${seconds}秒`)

    elapsed.value = `已过去 ${parts.join('')}`
  }

  update()
  const timer = setInterval(update, 1000)
  onUnmounted(() => clearInterval(timer))

  return { elapsed, detailed }
}
