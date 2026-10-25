import {
  Apple,
  Bed,
  Bike,
  BookOpen,
  Brain,
  Check,
  Code,
  Droplet,
  Dumbbell,
  Footprints,
  Heart,
  Languages,
  Leaf,
  type LucideIcon,
  type LucideProps,
  Moon,
  Music,
  Palette,
  PenLine,
  PiggyBank,
  Pill,
  Salad,
  Sprout,
  Sun,
  Timer,
  Wind,
} from "lucide-react";
import { DEFAULT_ICON, type HabitIconKey, isHabitIcon } from "@/lib/habit-options";

const ICONS: Record<HabitIconKey, LucideIcon> = {
  check: Check,
  droplet: Droplet,
  footprints: Footprints,
  "book-open": BookOpen,
  dumbbell: Dumbbell,
  bike: Bike,
  moon: Moon,
  bed: Bed,
  apple: Apple,
  salad: Salad,
  pill: Pill,
  heart: Heart,
  brain: Brain,
  wind: Wind,
  timer: Timer,
  sun: Sun,
  sprout: Sprout,
  leaf: Leaf,
  "pen-line": PenLine,
  languages: Languages,
  code: Code,
  music: Music,
  palette: Palette,
  "piggy-bank": PiggyBank,
};

/** Renders a habit's SVG icon. Unknown keys fall back to a check mark. */
export function HabitIcon({ icon, ...props }: { icon: string | null | undefined } & LucideProps) {
  const Icon = ICONS[isHabitIcon(icon) ? icon : DEFAULT_ICON];
  return <Icon aria-hidden="true" strokeWidth={2} {...props} />;
}

/** Human readable name for screen readers, e.g. "piggy-bank" -> "piggy bank". */
export function habitIconLabel(icon: string) {
  return icon.replace(/-/g, " ");
}
