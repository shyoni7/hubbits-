"use client";

import { useActionState, useEffect } from "react";
import { saveHabit, type HabitFormState } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import {
  DEFAULT_COLOR,
  DEFAULT_EMOJI,
  HABIT_COLORS,
  HABIT_EMOJIS,
  NAME_MAX_LENGTH,
} from "@/lib/habit-options";
import type { Habit } from "@/lib/types";

type Props = { habit?: Habit; onClose: () => void };

const optionRing =
  "peer-checked:ring-2 peer-checked:ring-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent";

export function HabitDialog({ habit, onClose }: Props) {
  const [state, formAction, pending] = useActionState<HabitFormState, FormData>(saveHabit, {});

  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  const emoji = habit?.emoji && (HABIT_EMOJIS as readonly string[]).includes(habit.emoji) ? habit.emoji : DEFAULT_EMOJI;
  const color = habit?.color ?? DEFAULT_COLOR;
  const target = habit?.target_per_week ?? 7;

  return (
    <Modal
      title={habit ? "Edit habit" : "New habit"}
      description={habit ? undefined : "Small and specific works best."}
      onClose={onClose}
    >
      <form action={formAction} noValidate className="flex flex-col gap-5">
        {habit ? <input type="hidden" name="id" value={habit.id} /> : null}

        <Field
          label="Name"
          name="name"
          placeholder="e.g. Read 10 pages"
          required
          maxLength={NAME_MAX_LENGTH}
          defaultValue={habit?.name}
          error={state.fieldErrors?.name}
          autoFocus
        />

        <fieldset>
          <legend className="text-sm font-medium">Emoji</legend>
          <div className="mt-2 grid grid-cols-8 gap-1.5">
            {HABIT_EMOJIS.map((option) => (
              <label key={option} className="relative cursor-pointer">
                <input type="radio" name="emoji" value={option} defaultChecked={option === emoji} className="peer sr-only" />
                <span
                  className={`flex aspect-square items-center justify-center rounded-lg bg-surface-2 text-lg transition hover:bg-border peer-checked:bg-accent/15 ${optionRing}`}
                >
                  {option}
                </span>
              </label>
            ))}
          </div>
          {state.fieldErrors?.emoji ? <p className="mt-1.5 text-xs text-danger">{state.fieldErrors.emoji}</p> : null}
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium">Color</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {HABIT_COLORS.map((option) => (
              <label key={option.key} className="cursor-pointer">
                <input type="radio" name="color" value={option.key} defaultChecked={option.key === color} className="peer sr-only" />
                <span
                  className={`block size-9 rounded-full ring-offset-2 ring-offset-surface transition hover:scale-110 ${optionRing}`}
                  style={{ background: `var(--color-habit-${option.key})` }}
                />
                <span className="sr-only">{option.label}</span>
              </label>
            ))}
          </div>
          {state.fieldErrors?.color ? <p className="mt-1.5 text-xs text-danger">{state.fieldErrors.color}</p> : null}
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium">Days per week</legend>
          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((days) => (
              <label key={days} className="cursor-pointer">
                <input type="radio" name="target_per_week" value={days} defaultChecked={days === target} className="peer sr-only" />
                <span
                  className={`flex h-10 items-center justify-center rounded-lg bg-surface-2 text-sm font-medium tabular-nums transition hover:bg-border peer-checked:bg-accent peer-checked:text-accent-fg ${optionRing}`}
                >
                  {days}
                </span>
              </label>
            ))}
          </div>
          {state.fieldErrors?.target ? <p className="mt-1.5 text-xs text-danger">{state.fieldErrors.target}</p> : null}
        </fieldset>

        <p aria-live="polite" className="text-sm text-danger empty:hidden">
          {state.error}
        </p>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : habit ? "Save changes" : "Create habit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
