// Choices offered in the habit form. Shared by the UI and the server-side validation.

/** Icon keys; components/habit-icon.tsx maps each one to an SVG icon. */
export const HABIT_ICONS = [
  "check", "droplet", "footprints", "book-open", "dumbbell", "bike",
  "moon", "bed", "apple", "salad", "pill", "heart",
  "brain", "wind", "timer", "sun", "sprout", "leaf",
  "pen-line", "languages", "code", "music", "palette", "piggy-bank",
] as const;

export type HabitIconKey = (typeof HABIT_ICONS)[number];

export function isHabitIcon(value: unknown): value is HabitIconKey {
  return (HABIT_ICONS as readonly unknown[]).includes(value);
}

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

export const DEFAULT_ICON: HabitIconKey = "check";
export const DEFAULT_COLOR: HabitColor = "mint";
export const NAME_MAX_LENGTH = 40;

export function habitColorVar(color: string | null | undefined) {
  const key = HABIT_COLORS.some((c) => c.key === color) ? color : DEFAULT_COLOR;
  return `var(--color-habit-${key})`;
}
