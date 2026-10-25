import { ImageResponse } from "next/og";

// Image generation cannot read CSS variables, so these values mirror the
// tokens in app/globals.css.
const BG = "#0a0b0b";
const ACCENT = "#3ecf8e";
const FG = "#eeefef";
const MUTED = "#9ca5a2";

export const alt = "HabitFlow: small daily wins, calmly tracked";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const cells = Array.from({ length: 30 }, (_, i) => [0, 3, 4, 9, 13, 17, 22].includes(i) === false);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: `radial-gradient(circle at 75% 20%, rgba(62,207,142,0.22), ${BG} 55%)`,
          color: FG,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 32 32">
              <path d="M9 16.5l4.5 4.5L23 11.5" fill="none" stroke={BG} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>HabitFlow</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, display: "flex", flexWrap: "wrap" }}>
            Small daily wins,&nbsp;<span style={{ color: ACCENT }}>calmly tracked.</span>
          </div>
          <div style={{ fontSize: 32, color: MUTED }}>Check off your day. Keep your streaks.</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {cells.map((done, i) => (
            <div
              key={i}
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: done ? ACCENT : "#1a1d1d",
              }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
