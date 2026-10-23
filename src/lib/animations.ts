export const animationTiming = { reveal: 700, image: 800, counter: 2000, easing: "cubic-bezier(0.22, 1, 0.36, 1)" } as const;

export function formatCounter(value: number, decimals = 0): string {
  if (!Number.isFinite(value) || !Number.isInteger(decimals) || decimals < 0 || decimals > 20) throw new RangeError("Invalid counter value or decimal precision");
  return new Intl.NumberFormat("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
}

export function counterValueAt(value: number, elapsed: number, duration: number): number {
  if (duration <= 0 || elapsed >= duration) return value;
  const progress = Math.max(0, elapsed / duration);
  return value * (1 - (1 - progress) ** 3);
}

export function staggerDelay(index: number): number {
  return Math.min(Math.max(0, index) * 90, 270);
}
