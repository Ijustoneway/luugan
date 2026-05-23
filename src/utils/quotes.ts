// 内置励志语录 + Unsplash 壁纸（无需 API Key）
export const quotes = [
  { text: '每一天都是新的开始，昨天的失败不代表今天的结局。', author: '佚名' },
  { text: '自律是最高形式的自爱。', author: '佚名' },
  { text: '坚持，不是因为你有多强大，而是因为你别无选择。', author: '佚名' },
  { text: '改变自己，才能改变命运。每一次自律，都是在向更好的自己迈进。', author: '佚名' },
  { text: '人生最大的敌人是昨天的自己。', author: '佚名' },
  { text: '你现在的努力，是在为未来的自由买单。', author: '佚名' },
  { text: '种一棵树最好的时间是十年前，其次是现在。', author: '中国谚语' },
  { text: '不要等待机会，而是要创造机会。', author: '佚名' },
  { text: '自制力是最强的力量，征服自己才能征服世界。', author: '佚名' },
  { text: '每一个清醒的早晨都是对昨天所有放纵的报复。', author: '佚名' },
  { text: '你若盛开，清风自来。', author: '佚名' },
  { text: '生命不息，奋斗不止。', author: '佚名' },
  { text: '忍一时风平浪静，退一步海阔天空。但面对自我，进一步才是成长。', author: '佚名' },
  { text: '你的身体是你灵魂的殿堂，用自律守护它。', author: '佚名' },
  { text: '每次战胜欲望，都是在雕刻更好的自己。', author: '佚名' },
  { text: '意志力是肌肉，越锻炼越强大。', author: '佚名' },
  { text: '痛苦是短暂的，放弃是永远的。', author: '佚名' },
  { text: '今日事今日毕，不拖延是对未来最好的尊重。', author: '佚名' },
  { text: '你有多自律，就有多自由。', author: '佚名' },
  { text: '一个人的成功，往往源于他对自己的严格要求。', author: '佚名' },
]

// Unsplash 免费随机风景图（无需 API，直接可用）
export const wallpapers = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1080&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1080&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&q=80',
  'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1080&q=80',
  'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1080&q=80',
  'https://images.unsplash.com/photo-1540206395-68808572332f?w=1080&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1080&q=80',
  'https://images.unsplash.com/photo-1522092787782-a8c15e96a261?w=1080&q=80',
]

export function getDailyQuote(): { text: string; author: string } {
  const day = new Date().getDate() + new Date().getMonth() * 31
  return quotes[day % quotes.length]
}

export function getDailyWallpaper(): string {
  const day = new Date().getDate() + new Date().getMonth() * 31
  return wallpapers[day % wallpapers.length]
}
