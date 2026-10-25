import { describe, expect, it } from "vitest";
import { addDays, dayOfWeek, isDateString, todayIn } from "@/lib/dates";
import { bestStreak, currentStreak, history, isMilestone, startOfWeek, weeklyCompletion } from "@/lib/streaks";

const TODAY = "2026-10-21"; // a Wednesday

describe("dates", () => {
  it("adds days across month and year boundaries", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
    expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
  });

  it("knows the weekday", () => {
    expect(dayOfWeek("2026-10-18")).toBe(0); // Sunday
    expect(dayOfWeek(TODAY)).toBe(3);
  });

  it("validates date strings", () => {
    expect(isDateString("2026-10-21")).toBe(true);
    expect(isDateString("2026-02-30")).toBe(false);
    expect(isDateString("21/10/2026")).toBe(false);
    expect(isDateString(42)).toBe(false);
  });

  it("computes today in a time zone", () => {
    const now = new Date("2026-10-21T23:30:00Z");
    expect(todayIn("UTC", now)).toBe("2026-10-21");
    expect(todayIn("Asia/Jerusalem", now)).toBe("2026-10-22");
    expect(todayIn("America/Los_Angeles", now)).toBe("2026-10-21");
    expect(todayIn("Not/AZone", now)).toBe("2026-10-21");
  });
});

describe("currentStreak", () => {
  it("is 0 with no check-ins", () => {
    expect(currentStreak([], TODAY)).toBe(0);
  });

  it("counts consecutive days ending today", () => {
    expect(currentStreak(["2026-10-19", "2026-10-20", TODAY], TODAY)).toBe(3);
  });

  it("does not break when today is not checked yet", () => {
    expect(currentStreak(["2026-10-19", "2026-10-20"], TODAY)).toBe(2);
  });

  it("breaks after a missed day", () => {
    expect(currentStreak(["2026-10-17", "2026-10-18", "2026-10-20"], TODAY)).toBe(1);
    expect(currentStreak(["2026-10-18", "2026-10-19"], TODAY)).toBe(0);
  });

  it("ignores duplicates", () => {
    expect(currentStreak([TODAY, TODAY, "2026-10-20"], TODAY)).toBe(2);
  });
});

describe("bestStreak", () => {
  it("finds the longest run anywhere in history", () => {
    const dates = ["2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-10-20", TODAY];
    expect(bestStreak(dates)).toBe(4);
  });

  it("handles unsorted input and month boundaries", () => {
    expect(bestStreak(["2026-11-01", "2026-10-30", "2026-10-31"])).toBe(3);
  });

  it("is 0 with no check-ins", () => {
    expect(bestStreak([])).toBe(0);
  });
});

describe("history", () => {
  it("returns 30 days oldest first ending today", () => {
    const days = history([TODAY, "2026-09-22"], TODAY);
    expect(days).toHaveLength(30);
    expect(days[0]).toEqual({ date: "2026-09-22", done: true });
    expect(days[29]).toEqual({ date: TODAY, done: true });
    expect(days.filter((d) => d.done)).toHaveLength(2);
  });
});

describe("weeklyCompletion", () => {
  it("starts the week on Sunday", () => {
    expect(startOfWeek(TODAY)).toBe("2026-10-18");
    expect(startOfWeek("2026-10-18")).toBe("2026-10-18");
    expect(startOfWeek("2026-10-24")).toBe("2026-10-18");
  });

  it("is 0 with no habits", () => {
    expect(weeklyCompletion([], TODAY)).toBe(0);
  });

  it("caps each habit at its target", () => {
    const habits = [
      { target: 2, doneDates: ["2026-10-18", "2026-10-19", "2026-10-20"] }, // 2 of 2
      { target: 4, doneDates: ["2026-10-19"] }, // 1 of 4
    ];
    expect(weeklyCompletion(habits, TODAY)).toBe(50);
  });

  it("ignores check-ins from last week", () => {
    expect(weeklyCompletion([{ target: 1, doneDates: ["2026-10-17"] }], TODAY)).toBe(0);
  });
});

describe("isMilestone", () => {
  it("celebrates 7, 30, 100 and 365 days", () => {
    expect([7, 30, 100, 365].every(isMilestone)).toBe(true);
    expect([0, 1, 6, 8, 29].some(isMilestone)).toBe(false);
  });
});
