# Luugan - 人生记录 App

一个专注于自我记录与成长的移动端 Web App。

## ✨ 功能特性

### 📅 日记日历
- 完整月历视图，有日记的日期绿色高亮
- 点击任意日期查看/编辑对应日记
- 5 种心情标签（开心/平静/难过/兴奋/焦虑）

### ✏️ 日记书写
- 支持左右滑动切换日期
- 标题 + 正文的富文本记录
- 本地 localStorage 持久存储

### ⏱️ 时刻计时器
- 记录任意历史时刻（精确到秒）
- **实时显示距该时刻已过去多久**：X天X小时X分X秒
- 自定义 Emoji 标签（📌🚬💪❤️🎯等）
- 支持编辑和删除记录

### 🌟 励志壁纸语录
- 每日切换励志语录（内置20条+）
- Unsplash 高清风景壁纸背景
- 手动刷新换一句

## 🛠️ 技术栈

- **框架**: Vue 3 + TypeScript + Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **跨平台**: Capacitor（可打包为 iOS/Android App）
- **日期处理**: dayjs
- **样式**: 原生 CSS，深色主题

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📱 打包为移动端 App

```bash
# 初始化 Capacitor
npx cap init

# 添加 Android 平台
npx cap add android

# 同步构建产物
npm run build && npx cap sync

# 打开 Android Studio
npx cap open android
```

## 📂 项目结构

```
src/
├── views/          # 页面视图
│   ├── HomeView.vue      # 主页（壁纸+语录+快速入口）
│   ├── CalendarView.vue  # 日历视图
│   ├── DiaryView.vue     # 日记编写/查看
│   └── TimerView.vue     # 时刻计时器
├── components/     # 组件
│   └── timer/
│       ├── TimerCard.vue    # 计时器卡片
│       └── TimerElapsed.vue # 经过时间显示
├── stores/         # Pinia 状态管理
├── composables/    # 组合式函数
├── router/         # 路由配置
└── utils/          # 工具函数（语录/壁纸）
```

---

> 自律是最高形式的自爱。每一天都是新的开始。🌟
