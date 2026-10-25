// Choices offered in the habit form. Shared by the UI and the server-side validation.

export const HABIT_EMOJIS = [
  "✅", "💧", "🏃", "🧘", "📚", "✍️", "🥗", "🍎",
  "😴", "💪", "🚶", "🚴", "🎸", "🎨", "💻", "🧠",
  "🌱", "☀️", "🧹", "💊", "🙏", "📵", "💰", "❤️",
] as const;

/** Keys map to the --color-habit-* design tokens in app/globals.css. */
export const HABIT_COLORS = [
  { key: "mint", label: "Mint" },
  { key: "sky", label: "Sky" },
  { key: "violet", label: "Violet" },
  { key: "rose", label: "Rose" },
  { key: "amber", label: "Amber" },
  { key: "coral", label: "Coral" },
] as const;

export type HabitColor = (typeof HABIT_COLORS)[number]["key"];

export const DEFAULT_EMOJI = HABIT_EMOJIS[0];
export const DEFAULT_COLOR: HabitColor = "mint";
export const NAME_MAX_LENGTH = 40;

export function habitColorVar(color: string | null | undefined) {
  const key = HABIT_COLORS.some((c) => c.key === color) ? color : DEFAULT_COLOR;
  return `var(--color-habit-${key})`;
}
