<template>
  <div class="calendar-widget">
    <div v-if="loading" class="loading-state">
      <div class="loading"></div>
      <p>加载中...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button class="btn btn-sm" @click="loadCalendar">重新加载</button>
    </div>
    <div v-else-if="calendarData" class="calendar-content">
      <!-- 日期显示 -->
      <div class="calendar-date">
        <div class="solar-date">
          <span class="year">{{ calendarData.solarYear }}</span>年
          <span class="month">{{ calendarData.solarMonth }}</span>月
          <span class="day">{{ calendarData.solarDay }}</span>日
          <span class="weekday">{{ calendarData.weekday }}</span>
        </div>
        <div class="lunar-date">
          <span class="lunar-year">{{ calendarData.lunarYear }}</span>
          <span class="lunar-month">{{ calendarData.lunarMonth }}</span>
          <span class="lunar-day">{{ calendarData.lunarDay }}</span>
        </div>
      </div>

      <!-- 基本信息 -->
      <div class="calendar-info">
        <div class="basic-info">
          <span class="zodiac">{{ calendarData.zodiac }}</span>
          <span class="constellation">{{ calendarData.constellation }}</span>
          <span class="season">{{ calendarData.season }}</span>
        </div>

        <!-- 节气信息 -->
        <div class="term-section">
          <div class="term-item">
            <span class="term-name">{{ calendarData.currentTerm }}</span>
            <span class="term-days">{{ calendarData.currentTermDays }}</span>
          </div>
          <div class="term-item">
            <span class="term-name">{{ calendarData.nextTerm }}</span>
            <span class="term-days">{{ calendarData.nextTermDays }}</span>
          </div>
        </div>
      </div>

      <!-- 宜忌信息 -->
      <div class="fortune-info">
        <div class="suitable">
          <span class="label">宜：</span>
          <span class="content">{{ calendarData.suitable }}</span>
        </div>
        <div class="avoid">
          <span class="label">忌：</span>
          <span class="content">{{ calendarData.avoid }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface CalendarData {
  solarYear: string
  solarMonth: string
  solarDay: string
  weekday: string
  lunarYear: string
  lunarMonth: string
  lunarDay: string
  zodiac: string
  constellation: string
  season: string
  currentTerm: string
  currentTermDays: string
  nextTerm: string
  nextTermDays: string
  suitable: string
  avoid: string
}

const calendarData = ref<CalendarData | null>(null)
const loading = ref(false)
const error = ref<string>('')

const loadCalendar = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch('https://cn.apihz.cn/api/time/getday.php?id=10005242&key=26133b6ea58e9b96b212a7d43b851712')

    if (!response.ok) {
      throw new Error('网络请求失败')
    }

    const text = await response.text()

    let data: any
    try {
      data = JSON.parse(text)
    } catch (e) {
      throw new Error('数据格式错误')
    }

    // 验证数据
    if (!data || !data.ynian || !data.yyue || !data.yri) {
      throw new Error('数据格式不正确')
    }

    // 解析节气信息
    let currentTerm = '无'
    let currentTermDays = ''
    let nextTerm = '无'
    let nextTermDays = ''

    const jieqiMsg = data.jieqimsg || ''

    if (jieqiMsg) {
      // 格式：立冬 第5天 （距下一个节气"小雪"，还有11天）

      // 提取当前节气和天数
      const currentTermMatch = jieqiMsg.match(/^([^\s]+)\s*第(\d+)天/)
      if (currentTermMatch) {
        currentTerm = currentTermMatch[1]
        currentTermDays = '第' + currentTermMatch[2] + '天'
      }

      // 提取下一个节气和剩余天数（使用非贪婪匹配）
      const nextTermMatch = jieqiMsg.match(/距下一个节气.(.+?).，还有(\d+)天/)
      if (nextTermMatch) {
        nextTerm = nextTermMatch[1]  // 已经不包含引号了
        nextTermDays = '还有' + nextTermMatch[2] + '天'
      }
    }

    // 处理宜忌
    const suitableArray = data.yi ? data.yi.split('|') : []
    const avoidArray = data.ji ? data.ji.split('|') : []

    calendarData.value = {
      solarYear: data.ynian || '',
      solarMonth: data.yyue || '',
      solarDay: data.yri || '',
      weekday: data.xingqi || '',
      lunarYear: data.ganzhinian || '',
      lunarMonth: data.nyue || '',
      lunarDay: data.nri || '',
      zodiac: data.shengxiao ? data.shengxiao + '年' : '',
      constellation: data.xingzuo || '',
      season: data.jijie || '',
      currentTerm,
      currentTermDays,
      nextTerm,
      nextTermDays,
      suitable: suitableArray.length > 0 ? suitableArray.join('、') : '无特别事宜',
      avoid: avoidArray.length > 0 ? avoidArray.join('、') : '无特别禁忌'
    }
  } catch (err: any) {
    console.error('万年历加载失败:', err)
    error.value = '加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCalendar()
})
</script>

<style scoped>
.calendar-widget {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  color: #fff;
  box-shadow: var(--shadow-lg);
  min-height: 300px;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #fff;
}

.loading-state p,
.error-state p {
  margin-top: var(--spacing-base);
  font-size: var(--text-sm);
}

.error-state button {
  margin-top: var(--spacing-base);
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: var(--spacing-xs) var(--spacing-base);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.error-state button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.calendar-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* 日期显示 */
.calendar-date {
  text-align: center;
  padding: var(--spacing-sm) 0 var(--spacing-md) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.solar-date {
  font-size: var(--text-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.solar-date .year,
.solar-date .month,
.solar-date .day {
  font-size: 2rem;
  margin: 0 2px;
}

.solar-date .weekday {
  margin-left: var(--spacing-sm);
  font-size: var(--text-lg);
}

.lunar-date {
  font-size: var(--text-base);
  opacity: 0.9;
  margin-top: var(--spacing-xs);
}

/* 基本信息 */
.calendar-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-base);
}

.basic-info {
  display: flex;
  justify-content: space-around;
  padding: var(--spacing-sm) 0;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
}

.basic-info span {
  font-size: var(--text-sm);
  font-weight: 500;
}

/* 节气信息 */
.term-section {
  display: flex;
  gap: var(--spacing-base);
  padding: var(--spacing-sm);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
}

.term-item {
  flex: 1;
  text-align: center;
}

.term-name {
  display: block;
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: 4px;
}

.term-days {
  display: block;
  font-size: var(--text-xs);
  opacity: 0.8;
}

/* 宜忌信息 */
.fortune-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
}

.suitable,
.avoid {
  display: flex;
  gap: var(--spacing-xs);
}

.label {
  font-weight: 600;
  white-space: nowrap;
}

.content {
  flex: 1;
  line-height: 1.6;
  word-break: break-all;
}

/* 响应式 */
@media (max-width: 768px) {
  .calendar-widget {
    padding: var(--spacing-base);
  }

  .solar-date .year,
  .solar-date .month,
  .solar-date .day {
    font-size: 1.5rem;
  }

  .term-section {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
}
</style>
