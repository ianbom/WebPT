import { formatCounter } from "@/lib/animations";

type Props = { value: number; duration?: number; decimals?: number; prefix?: string; suffix?: string };

export function AnimatedCounter({ value, duration = 2, decimals = 0, prefix = "", suffix = "" }: Props) {
  const finalNumber = prefix + formatCounter(value, decimals);
  return <><strong data-counter={value} data-counter-duration={duration} data-counter-decimals={decimals} data-counter-prefix={prefix} aria-hidden="true"><span className="counter-number" data-final-number={finalNumber}><span data-counter-display>{finalNumber}</span></span>{suffix && <> <small>{suffix}</small></>}</strong><span className="sr-only">{finalNumber}{suffix && ` ${suffix}`}.</span></>;
}
