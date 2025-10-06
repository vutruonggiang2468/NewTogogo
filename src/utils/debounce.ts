
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DebouncedFn<T extends (...args: any[]) => void> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  wait = 300,
  immediate = false
): DebouncedFn<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const later = (context: unknown) => {
    timeout = null;
    if (!immediate && lastArgs) {
      fn.apply(context, lastArgs);
    }
    lastArgs = null;
  };

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    lastArgs = args;
    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => later(this), wait);
    if (callNow) {
      fn.apply(this, args);
      lastArgs = null;
    }
  } as DebouncedFn<T>;

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    lastArgs = null;
  };

  debounced.flush = () => {
    if (timeout) {
      clearTimeout(timeout);
      // immediately invoke with last args
      if (lastArgs) fn(...lastArgs);
      timeout = null;
      lastArgs = null;
    }
  };

  return debounced;
}
