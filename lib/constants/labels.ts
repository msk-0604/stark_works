/** 画面上の呼び方（職人さんも使う前提の言葉） */
export const LABELS = {
  member: "メンバー",
  memberShort: "担当",
  memberAdd: "メンバーを追加",
  memberEdit: "メンバー編集",
  memberEmpty: "メンバーがまだいません",
  memberSelect: "担当を選んでください",
  todayWork: "今日やること",
} as const;

export const WORK_PRESETS = [
  "給水工事",
  "排水工事",
  "トイレ設置",
  "洗面台設置",
  "配管工事",
] as const;

export const TIME_PRESETS = [
  { label: "終日", start: "08:00", end: "17:00" },
  { label: "午前", start: "08:00", end: "12:00" },
  { label: "午後", start: "13:00", end: "17:00" },
] as const;
