import type { MapBoot, MapTimer } from 'services/map'

import { DateTime } from 'luxon'

export function mapTimerStatus(timer: MapTimer, boot: MapBoot, region: string, now: number) {
  const zone = timer.rule.clock === 'reset' ? boot.clocks.reset : boot.clocks.server[region]
  if (!zone) return null
  const today = DateTime.fromMillis(now, { zone }).startOf('day')
  const windows: { end: number; start: number }[] = []
  for (let offset = -1; offset <= 7; offset++) {
    const day = today.plus({ days: offset })
    if (timer.rule.type === 'weekly' && !timer.rule.days?.includes(day.weekday % 7)) continue
    for (const time of timer.rule.at) {
      const [hour, minute] = time.split(':').map(Number)
      const start = day.set({ hour, minute }).toMillis()
      windows.push({ start, end: start + timer.minutes * 60000 })
    }
  }
  const live = windows.find((window) => window.start <= now && window.end > now)
  const next = windows.filter((window) => window.start > now).sort((a, b) => a.start - b.start)[0]
  const remaining = Math.max(0, Math.ceil(((live ? live.end : next?.start || now) - now) / 60000))
  return {
    isLive: Boolean(live),
    label: live
      ? `Live · ${remaining}m left`
      : `Starts in ${remaining >= 60 ? `${Math.floor(remaining / 60)}h ` : ''}${remaining % 60}m`,
    schedule: `${timer.rule.at.join(', ')} · ${zone}${timer.rule.type === 'weekly' ? ` · ${timer.rule.days?.map((day) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]).join(', ')}` : ''}`,
  }
}
