/**
 * Toggles `value` in/out of a multi-select array, capping the result at
 * `max`. Selecting past the cap drops the oldest pick (FIFO) so the UI
 * never has to block a tap - it just shifts.
 */
export function toggleWithMax<T>(current: T[], value: T, max: number): T[] {
  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }
  const next = [...current, value];
  return next.length > max ? next.slice(next.length - max) : next;
}
